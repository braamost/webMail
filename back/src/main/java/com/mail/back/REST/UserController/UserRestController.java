package com.mail.back.REST.UserController;

import com.mail.back.DTO.LoginRequest;
import com.mail.back.DTO.LoginResponse;
import com.mail.back.DTO.RegisterRequest;
import com.mail.back.DTO.UpdatePasswordRequest;
import com.mail.back.DTO.UserResponse;
import com.mail.back.Service.UserService.UserService;
import com.mail.back.Storage.ObjectService.StoredObject;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequestMapping("/api/users")
@Slf4j
public class UserRestController {
    private final UserService userService;

    public UserRestController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<UserResponse> findByUserName(@PathVariable String username) {
        log.info("Finding user by username: {}", username);
        return ResponseEntity.ok(userService.getByUserName(username));
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<UserResponse> findByEmail(@PathVariable String email) {
        log.info("Finding user by email: {}", email);
        return ResponseEntity.ok(userService.getByEmail(email));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        log.info("Login attempt for user: {}", loginRequest.getUserName());
        return ResponseEntity.ok(userService.login(loginRequest));
    }

    @PostMapping("/{id}/profile-photo")
    public ResponseEntity<String> uploadProfilePhoto(
            @PathVariable Integer id,
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        log.info("Uploading profile photo for user id: {}", id);
        return ResponseEntity.ok(userService.saveProfilePhoto(id, file, authentication));
    }

    @SuppressWarnings("null")
    @GetMapping("/{id}/profile-photo/{filename:.+}")
    public ResponseEntity<Resource> getProfilePhoto(
            @PathVariable Integer id,
            @PathVariable String filename) {
        StoredObject storedObject = userService.openProfilePhoto(id, filename);
        if (storedObject.isRedirect()) {
            return ResponseEntity.status(HttpStatus.FOUND).location(storedObject.redirect()).build();
        }
        try {
            MediaType mediaType = storedObject.contentType() == null
                    ? MediaType.APPLICATION_OCTET_STREAM
                    : MediaType.parseMediaType(storedObject.contentType());
            return ResponseEntity.ok().contentType(mediaType).body(storedObject.resource());
        } catch (Exception exception) {
            throw new IllegalStateException("Unable to read stored user photo", exception);
        }
    }

    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> registerUser(
            @Valid @RequestPart("user") RegisterRequest userDto,
            @RequestPart(value = "photo", required = false) MultipartFile photo) {
        UserResponse saved = userService.register(userDto, photo);
        log.info("New user registered: {}", saved.getUserName());
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/password")
    public ResponseEntity<Void> updatePassword(
            @PathVariable int id,
            @Valid @RequestBody UpdatePasswordRequest request,
            Authentication authentication) {
        log.info("Updating password for user: {}", id);
        userService.updatePassword(id, request, authentication);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable int id, Authentication authentication) {
        log.info("Deleting user: {}", id);
        userService.deleteById(id, authentication);
        return ResponseEntity.noContent().build();
    }
}
