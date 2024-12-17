package com.mail.back.REST.UserControl;

import com.mail.back.GlobalHandle.NotFoundException;
import com.mail.back.Service.UserService.UserService;
import com.mail.back.Singleton.LoggedInUser;
import com.mail.back.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@Component

public class UserRestController implements IUserController {
  private final UserService userService;

  @Autowired
  public UserRestController(UserService userService) {
    this.userService = userService;
  }


  @Override
  public List<User> findAll() {
    return userService.findAll();
  }

  @Override
  public ResponseEntity<User> findById(int id) {
    User user = userService.findById(id);
    if (user == null) {
      throw new NotFoundException("User with id " + id + " not found");
    }
    return ResponseEntity.ok(user);
  }


  @Override
  public ResponseEntity<User> findByUserName(String username) {
    User user = userService.findByUserName(username);
    if (user == null) {
      throw new NotFoundException("User with username " + username + " not found");
    }
    return ResponseEntity.ok(user);
  }

  @Override
  public ResponseEntity<User> findByEmail(String email) {
    User user = userService.findByEmail(email);
    if (user == null) {
      throw new NotFoundException("User with email " + email + " not found");
    }
    return ResponseEntity.ok(user);
  }

  @Override
  public ResponseEntity<User> login(User loginRequest) {
    User user = userService.findByUserName(loginRequest.getUserName());
    LoggedInUser LOGGED_IN = LoggedInUser.getInstance();
    LOGGED_IN.setUser(user);
    return ResponseEntity.ok(user);
  }

  @Override
  public ResponseEntity<User> addUser(User user) {
    LoggedInUser LOGGED_IN = LoggedInUser.getInstance();
    LOGGED_IN.setUser(user);
    return ResponseEntity.status(HttpStatus.CREATED).body(userService.save(user));
  }


  @Override
  public ResponseEntity<User> updateUser(User user) {
    user.setId(user.getId());
    LoggedInUser LOGGED_IN = LoggedInUser.getInstance();
    LOGGED_IN.setUser(user);
    return ResponseEntity.ok(userService.save(user));
  }

  @Override
  public ResponseEntity<String> deleteUser(User user) {
    userService.deleteById(user.getId());
    LoggedInUser LOGGED_IN = LoggedInUser.getInstance();
    LOGGED_IN.setUser(null);
    return ResponseEntity.ok("Deleted user " + user.getId());
  }
}