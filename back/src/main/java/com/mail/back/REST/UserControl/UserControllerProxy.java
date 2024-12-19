package com.mail.back.REST.UserControl;

import com.mail.back.GlobalHandle.NotFoundException;
import com.mail.back.GlobalHandle.UnauthorizedException;
import com.mail.back.GlobalHandle.UserAlreadyExistsException;
import com.mail.back.Service.UserService.UserService;
import com.mail.back.entity.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Objects;

import org.springframework.web.multipart.MultipartFile;
@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequestMapping("/api/users")
public class UserControllerProxy implements IUserController {
    private final IUserController realController;
    private final UserService userService;
    private final Logger logger = LoggerFactory.getLogger(UserControllerProxy.class);

    public UserControllerProxy(UserRestController realController, UserService userService) {
        this.realController = realController;
        this.userService = userService;
    }

    @Override
    @GetMapping
    public List<User> findAll() {
        logger.info("Proxy: Retrieving all users");
        try {
            return realController.findAll();
        } catch (Exception e) {
            logger.error("Error retrieving all users", e);
            throw e;
        }
    }

    @Override
    @GetMapping("/{id}")
    public ResponseEntity<User> findById(@PathVariable int id) {
        logger.info("Proxy: Finding user by id: {}", id);
        validateId(id);
        return realController.findById(id);
    }

    @Override
    @GetMapping("/username/{username}")
    public ResponseEntity<User> findByUserName(@PathVariable String username) {
        logger.info("Proxy: Finding user by username: {}", username);
        validateUsername(username);
        return realController.findByUserName(username);
    }

    @Override
    @GetMapping("/email/{email}")
    public ResponseEntity<User> findByEmail(@PathVariable String email) {
        logger.info("Proxy: Finding user by email: {}", email);
        validateEmail(email);
        return realController.findByEmail(email);
    }

    @Override
    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody User loginRequest) {
        logger.info("Proxy: Login attempt for user: {}", loginRequest.getUserName());
        validateLoginRequest(loginRequest);
        return realController.login(loginRequest);
    }

    @Override
    @PostMapping
    public ResponseEntity<User> addUser(@RequestBody User user) {
        logger.info("Proxy: Adding new user: {}", user.getUserName());
        validateNewUser(user);
        validateNewPassword(user.getPassword());
        return realController.addUser(user);
    }

    @Override
    @PutMapping
    public ResponseEntity<User> updateUser(@RequestBody User user) {
        logger.info("Proxy: Updating user: {}", user.getUserName());
        validateUpdateUser(user);
        return realController.updateUser(user);
    }

    @Override
    @PutMapping("/update-password/{oldPassword}/{newPassword}")
    public ResponseEntity<User> updatePassword(@PathVariable String oldPassword, @PathVariable String newPassword, @RequestBody User user) {
        logger.info("Proxy: Updating password: {}", user);
        validateOldPassword(user, oldPassword);
        validateNewPassword(newPassword);
        return realController.updatePassword(oldPassword, newPassword, user);
    }

    @Override
    @DeleteMapping
    public ResponseEntity<String> deleteUser(@RequestBody User user) {
        logger.info("Proxy: Deleting user: {}", user.getUserName());
        validateDeleteUser(user);
        return realController.deleteUser(user);
    }

    @PostMapping("/upload-photo/{email}")
    public User uploadPhoto(@PathVariable  String email,
                            @RequestParam("photo") MultipartFile photo) throws IOException {
        logger.info("Proxy: Uploading photo for user: {}", email);
        logger.info("Proxy: the photo before: {}", photo);
        validateEmail (email);
        return realController.uploadPhoto(email, photo);
    }

    // Private validation methods
    private void validateId(int id) {
        if (id <= 0) {
            throw new IllegalArgumentException("Invalid user ID");
        }
        if (userService.findById(id) == null) {
            throw new NotFoundException("User not found");
        }
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

    private void validateLoginRequest(User loginRequest) {
        if (loginRequest.getUserName() == null || loginRequest.getPassword() == null) {
            throw new IllegalArgumentException("Username and password are required");
        }
        User user = userService.findByUserName(loginRequest.getUserName());
        if (user == null) {
            throw new NotFoundException("User not found");
        }
        if (userService.checkPassword(user, loginRequest.getPassword())) {
            throw new UnauthorizedException("Invalid password");
        }
    }

    private void validateNewUser(User user) {
        if (user.getUserName() == null || user.getEmail() == null || user.getPassword() == null) {
            throw new IllegalArgumentException("Username, email, and password are required");
        }
        if (userService.findByUserName(user.getUserName()) != null) {
            throw new UserAlreadyExistsException("Username taken");
        }
        if (userService.findByEmail(user.getEmail()) != null) {
            throw new UserAlreadyExistsException("Email taken");
        }
    }

    private void validateUpdateUser(User user) {
        if (user.getId() <= 0) {
            throw new IllegalArgumentException("Invalid user ID");
        }
        User existingUser = userService.findById(user.getId());
        if (existingUser == null) {
            throw new NotFoundException("User not found");
        }
        // Check if new username is taken by another user
        User userWithUsername = userService.findByUserName(user.getUserName());
        if (userWithUsername != null && !Objects.equals(userWithUsername.getId(), user.getId())) {
            throw new UserAlreadyExistsException("Username taken");
        }
        // Check if new email is taken by another user
        User userWithEmail = userService.findByEmail(user.getEmail());
        if (userWithEmail != null && !Objects.equals(userWithEmail.getId(), user.getId())) {
            throw new UserAlreadyExistsException("Email taken");
        }
    }

    private void validateDeleteUser(User user) {
        if (user.getId() <= 0) {
            throw new IllegalArgumentException("Invalid user ID");
        }
        User existingUser = userService.findById(user.getId());
        if (existingUser == null) {
            throw new NotFoundException("User not found");
        }
    }

    private void validateOldPassword(User user, String oldPassword) {
        if(userService.checkPassword(user, oldPassword)){
            logger.error("Invalid oldPassword");
            throw new UnauthorizedException("Invalid oldPassword");
        }
    }
    private void validateNewPassword( String newPassword) {
        if (newPassword == null || newPassword.trim().isEmpty()) {
            logger.error("New password cannot be empty");
            throw new IllegalArgumentException("New password cannot be empty");
        }
    }

}

