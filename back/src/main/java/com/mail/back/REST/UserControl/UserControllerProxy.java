package com.mail.back.REST.UserControl;

import com.mail.back.GlobalHandle.NotFoundException;
import com.mail.back.GlobalHandle.UnauthorizedException;
import com.mail.back.GlobalHandle.UserAlreadyExistsException;
import com.mail.back.Service.UserService.UserService;
import com.mail.back.entity.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class UserControllerProxy implements IUserController {
    private final UserRestController realController;
    private final UserService userService;
    private final Logger logger = LoggerFactory.getLogger(UserControllerProxy.class);

    public UserControllerProxy(UserRestController realController, UserService userService) {
        this.realController = realController;
        this.userService = userService;
    }

    @Override
    public List<User> findAll() {
        logger.info("Retrieving all users");
        return realController.findAll();
    }

    @Override
    public ResponseEntity<User> findById(int id) {
        logger.info("Finding user by id: {}", id);
        return realController.findById(id);
    }

    @Override
    public ResponseEntity<User> findByUserName(String username) {
        logger.info("Finding user by username: {}", username);
        return realController.findByUserName(username);
    }

    @Override
    public ResponseEntity<User> findByEmail(String email) {
        logger.info("Finding user by email: {}", email);
        return realController.findByEmail(email);
    }

    @Override
    public ResponseEntity<User> login(User loginRequest) {
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

    @Override
    public ResponseEntity<User> addUser(User user) {
        logger.info("Adding new user: {}", user.getUserName());
        if (userService.findByUserName(user.getUserName()) != null) {
            throw new UserAlreadyExistsException("Username taken");
        }
        if (userService.findByEmail(user.getEmail()) != null) {
            throw new UserAlreadyExistsException("Email taken");
        }
        return realController.addUser(user);
    }

    @Override
    public ResponseEntity<User> updateUser(User user) {
        logger.info("Updating user: {}", user.getUserName());
        if (userService.findById(user.getId()) == null) {
            throw new NotFoundException("User not found");
        }
        return realController.updateUser(user);
    }

    @Override
    public ResponseEntity<String> deleteUser(User user) {
        logger.info("Deleting user: {}", user.getUserName());
        if (userService.findById(user.getId()) == null) {
            throw new NotFoundException("User not found");
        }
        return realController.deleteUser(user);
    }
}