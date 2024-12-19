package com.mail.back.REST.UserControl;

import com.mail.back.Service.UserService.UserService;
import com.mail.back.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.logging.Logger;

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
    return ResponseEntity.ok(user);
  }

  @Override
  public ResponseEntity<User> findByUserName(String username) {
    User user = userService.findByUserName(username);
    return ResponseEntity.ok(user);
  }

  @Override
  public ResponseEntity<User> findByEmail(String email) {
    User user = userService.findByEmail(email);
    return ResponseEntity.ok(user);
  }

  @Override
  public ResponseEntity<User> login(User loginRequest) {
    User user = userService.findByUserName(loginRequest.getUserName());
    return ResponseEntity.ok(user);
  }

  @Override
  public ResponseEntity<User> addUser(User user) {
    return ResponseEntity.status(HttpStatus.CREATED).body(userService.save(user));
  }

  @Override
  public ResponseEntity<User> updateUser(User user) {
    return ResponseEntity.ok(userService.update(user));
  }

  @Override
  public ResponseEntity<String> deleteUser(User user) {
    userService.deleteById(user.getId());
    return ResponseEntity.ok("Deleted user " + user.getId());
  }

  @Override
  public User uploadPhoto(String email, MultipartFile photo) throws IOException {
    User user = userService.findByEmail(email);
    byte[] photoBytes = photo.getBytes();
    user.setPhoto(photoBytes);
    return userService.update(user);
  }
}