package com.mail.back.REST.UserControl;

import com.mail.back.GlobalHandle.NotFoundException;
import com.mail.back.GlobalHandle.UnauthorizedException;
import com.mail.back.Service.UserService.UserService;
import com.mail.back.entity.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;


import org.springframework.web.multipart.MultipartFile;
@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequestMapping("/api/users")
@Slf4j
public class UserRestController implements IUserController {
    private final UserService userService;
    public UserRestController(UserService userService) {
        this.userService = userService;
    }
    @Override
    @GetMapping("/username/{username}")
    public ResponseEntity<User> findByUserName(@PathVariable String username) {
        log.info("Proxy: Finding user by username: {}", username);
        validateUsername(username);
        return ResponseEntity.ok(userService.findByUserName(username));
    }

    @Override
    @GetMapping("/email/{email}")
    public ResponseEntity<User> findByEmail(@PathVariable String email) {
        log.info("Proxy: Finding user by email: {}", email);
        validateEmail(email);
        return ResponseEntity.ok(userService.findByEmail(email));
    }

    @Override
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        log.info("Proxy: Login attempt for user: {}", loginRequest.getUserName());
        LoginResponse loginResponse = userService.login(loginRequest);
        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/{id}/profile-photo")
    public ResponseEntity<String> uploadProfilePhoto(
            @PathVariable Integer id,
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        try {
            String usernameFromToken = (String) authentication.getPrincipal();
            log.info("Proxy: Uploading profile photo for user: {}", usernameFromToken);
            User user = userService.findByUserName(usernameFromToken);
            if(user.getId() != (int)id)
                throw new UnauthorizedException("You are not authorized to upload profile photo for this user");

            String url = userService.saveProfilePhoto(id, file);
            return ResponseEntity.ok(url);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Could not upload file: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/profile-photo/{filename}")
    public ResponseEntity<Resource> getProfilePhoto(
            @PathVariable Integer id,
            @PathVariable String filename) throws IOException {

        Resource resource = userService.getProfilePhoto(id, filename);

        Path file = Paths.get("uploads").resolve(filename);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, Files.probeContentType(file))
                .body(resource);
    }

    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> registerUser(
            @RequestPart("user") UserDto userDto,
            @RequestPart(value = "photo", required = false) MultipartFile photo) {

        // 1) Save user first
        User user = new User();
        user.setUserName(userDto.getUsername());
        user.setEmail(userDto.getEmail());
        user.setPassword(userDto.getPassword());
        user.setPhoneNumber(userDto.getPhoneNumber());
        User savedUser = userService.save(user);

        // 2) Save photo if provided
        if (photo != null) {
            try {
                String url = userService.saveProfilePhoto(savedUser.getId(), photo);
                log.info("Profile photo uploaded: {}", url);
            } catch (IOException e) {
                log.error("Failed to upload profile photo for user {}", savedUser.getId(), e);
            }
        }

        log.info("New user registered: {}", savedUser.getUserName());
        return ResponseEntity.noContent().build();
    }

    @Override
    @PutMapping("/update-password/{id}/{oldPassword}/{newPassword}")
    public ResponseEntity<Void> updatePassword(@PathVariable int id,
                                               @PathVariable String oldPassword,
                                               @PathVariable String newPassword,
                                               Authentication authentication) {
        log.info("Proxy: Updating password for user: {}", id);
        String usernameFromToken = (String) authentication.getPrincipal();
        User user = userService.findByUserName(usernameFromToken);
        if(user.getId() != id)
            throw new UnauthorizedException("You are not authorized to update password for this user");
        validateOldPassword(id, oldPassword);
        validateNewPassword(newPassword);
        User u = userService.updatePassword(userService.findById(id), newPassword);
        return ResponseEntity.noContent().build();
    }

    @Override
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable int id,
                                           Authentication authentication) {
        log.info("Proxy: Deleting user: {}", id);
        String usernameFromToken = (String) authentication.getPrincipal();
        User user = userService.findByUserName(usernameFromToken);
        if(user.getId() != id)
            throw new UnauthorizedException("You are not authorized to delete this user");
        validateDeleteUser(id);
        userService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private void validateUsername(String username) {
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("Username cannot be empty");
        }
        if (userService.findByUserName(username) == null) {
            throw new NotFoundException("User not found");
        }
    }

    private void validateEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be empty");
        }
        if (!email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new IllegalArgumentException("Invalid email format");
        }
        if (userService.findByEmail(email) == null) {
            throw new NotFoundException("User not found");
        }
    }

    private void validateDeleteUser(int id) {
        if (id <= 0) {
            throw new IllegalArgumentException("Invalid user ID");
        }
        User existingUser = userService.findById(id);
        if (existingUser == null) {
            throw new NotFoundException("User not found");
        }
    }

    private void validateOldPassword(int id, String oldPassword) {
        User user = userService.findById(id);
        if(userService.checkPassword(user, oldPassword)){
            log.error("Invalid oldPassword");
            throw new UnauthorizedException("Invalid oldPassword");
        }
    }

    private void validateNewPassword(String newPassword) {
        if (newPassword == null || newPassword.trim().isEmpty()) {
            throw new IllegalArgumentException("New password cannot be empty");
        }
        if (!newPassword.matches("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,}$")) {
            throw new IllegalArgumentException("Invalid password format");
        }
    }

}

