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

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequestMapping("/api/users")
public class UserControllerProxy implements IUserController {
    private final UserRestController realController;
    private final UserService userService;
    private final Logger logger = LoggerFactory.getLogger(UserControllerProxy.class);

    public UserControllerProxy(UserRestController realController, UserService userService) {
        this.realController = realController;
        this.userService = userService;
    }

    @GetMapping
    public List<User> findAll() {
        logger.info("Retrieving all users");
        return realController.findAll();
    }


    @GetMapping("/{id}")
    public ResponseEntity<User> findById(@PathVariable int id) {
        logger.info("Finding user by id: {}", id);
        return realController.findById(id);
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<User> findByUserName(@PathVariable String username) {
        logger.info("Finding user by username: {}", username);
        return realController.findByUserName(username);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<User> findByEmail(@PathVariable String email) {
        logger.info("Finding user by email: {}", email);
        return realController.findByEmail(email);
    }

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody User loginRequest) {
        logger.info("Login attempt: {}", loginRequest.getUserName());
        User user = userService.findByUserName(loginRequest.getUserName());
        if (user == null) {
            throw new NotFoundException("User not found");
        }
        if (!userService.checkPassword(user, loginRequest.getPassword())) {
            throw new UnauthorizedException("Invalid password");
        }
        return realController.login(loginRequest);
    }

    @PostMapping
    public ResponseEntity<User> addUser(@RequestBody User user) {
        logger.info("Adding new user: {}", user.getUserName());
        if (userService.findByUserName(user.getUserName()) != null) {
            throw new UserAlreadyExistsException("Username taken");
        }
        if (userService.findByEmail(user.getEmail()) != null) {
            throw new UserAlreadyExistsException("Email taken");
        }
        return realController.addUser(user);
    }

    @PutMapping
    public ResponseEntity<User> updateUser(@RequestBody User user) {
        logger.info("Updating user: {}", user.getUserName());
        if (userService.findById(user.getId()) == null) {
            throw new NotFoundException("User not found");
        }
        return realController.updateUser(user);
    }

    @DeleteMapping
    public ResponseEntity<String> deleteUser(@RequestBody User user) {
        logger.info("Deleting user: {}", user.getUserName());
        if (userService.findById(user.getId()) == null) {
            throw new NotFoundException("User not found");
        }
        return realController.deleteUser(user);
    }
}