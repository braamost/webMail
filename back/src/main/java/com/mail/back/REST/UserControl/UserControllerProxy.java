package com.mail.back.REST.UserControl;

import com.mail.back.GlobalHandle.NotFoundException;
import com.mail.back.GlobalHandle.UnauthorizedException;
import com.mail.back.GlobalHandle.UserAlreadyExistsException;
import com.mail.back.Service.UserService.UserService;
import com.mail.back.entity.User;
import jakarta.servlet.http.HttpServletRequest;
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

    private void validateSession(HttpServletRequest request, int userId) {
        Integer sessionUserId = (Integer) request.getSession().getAttribute("userId");
        if (sessionUserId == null || sessionUserId != userId) {
            throw new UnauthorizedException("Unauthorized access");
        }
    }

    @Override
    public List<User> findAll() {
        logger.info("Retrieving all users");
        return realController.findAll();
    }

    @Override
    public ResponseEntity<User> findById(int id) {
        logger.info("Finding user: {}", id);
        User user = userService.findById(id);
        if (user == null) {
            throw new NotFoundException("User " + id + " not found");
        }
        return realController.findById(id);
    }

    @Override
    public ResponseEntity<User> login(User loginRequest, HttpServletRequest request) {
        logger.info("Login attempt: {}", loginRequest.getUserName());
        User user = userService.findByUserName(loginRequest.getUserName());
        if (user == null) {
            throw new NotFoundException("User not found");
        }
        if (!userService.checkPassword(user, loginRequest.getPassword())) {
            throw new UnauthorizedException("Invalid password");
        }
        return realController.login(loginRequest, request);
    }

    @Override
    public ResponseEntity<String> logout(HttpServletRequest request) {
        logger.info("Logout user: {}", request.getSession().getAttribute("userId"));
        return realController.logout(request);
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
    public ResponseEntity<User> updateUser(User user, int id, HttpServletRequest request) {
        logger.info("Updating user: {}", id);
        validateSession(request, id);
        if (userService.findById(id) == null) {
            throw new NotFoundException("User not found");
        }
        return realController.updateUser(user, id, request);
    }

    @Override
    public ResponseEntity<String> deleteUser(int id, HttpServletRequest request) {
        logger.info("Deleting user: {}", id);
        validateSession(request, id);
        if (userService.findById(id) == null) {
            throw new NotFoundException("User not found");
        }
        return realController.deleteUser(id, request);
    }
}