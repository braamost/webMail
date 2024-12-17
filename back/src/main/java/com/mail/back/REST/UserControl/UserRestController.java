package com.mail.back.REST.UserControl;

import com.mail.back.GlobalHandle.NotFoundException;
import com.mail.back.Service.UserService.UserService;
import com.mail.back.Singleton.LoggedInUser;
import com.mail.back.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequestMapping("/api/users")
public class UserRestController implements IUserController {
  private final UserService userService;

  @Autowired
  public UserRestController(UserService userService) {
    this.userService = userService;
  }

  @GetMapping
  public List<User> findAll() {
    return userService.findAll();
  }

  @GetMapping("/{id}")
  public ResponseEntity<User> findById(@PathVariable int id) {
    User user = userService.findById(id);
    if (user == null) {
      throw new NotFoundException("User with id " + id + " not found");
    }
    return ResponseEntity.ok(user);
  }

  @GetMapping("/username/{username}")
  public ResponseEntity<User> findByUserName(@PathVariable String username) {
    User user = userService.findByUserName(username);
    if (user == null) {
      throw new NotFoundException("User with username " + username + " not found");
    }
    return ResponseEntity.ok(user);
  }

  @GetMapping("/email/{email}")
  public ResponseEntity<User> findByEmail(@PathVariable String email) {
    User user = userService.findByEmail(email);
    if (user == null) {
      throw new NotFoundException("User with email " + email + " not found");
    }
    return ResponseEntity.ok(user);
  }

  @PostMapping("/login")
  public ResponseEntity<User> login(@RequestBody User loginRequest) {
    User user = userService.findByUserName(loginRequest.getUserName());
    LoggedInUser LOGGED_IN = LoggedInUser.getInstance();
    LOGGED_IN.setUser(user);
    return ResponseEntity.ok(user);
  }

  @PostMapping
  public ResponseEntity<User> addUser(@RequestBody User user) {
    LoggedInUser LOGGED_IN = LoggedInUser.getInstance();
    LOGGED_IN.setUser(user);
    return ResponseEntity.status(HttpStatus.CREATED).body(userService.save(user));
  }

  @PutMapping
  public ResponseEntity<User> updateUser(@RequestBody User user) {
    user.setId(user.getId());
    LoggedInUser LOGGED_IN = LoggedInUser.getInstance();
    LOGGED_IN.setUser(user);
    return ResponseEntity.ok(userService.save(user));
  }

  @DeleteMapping
  public ResponseEntity<String> deleteUser(@RequestBody User user) {
    userService.deleteById(user.getId());
    LoggedInUser LOGGED_IN = LoggedInUser.getInstance();
    LOGGED_IN.setUser(null);
    return ResponseEntity.ok("Deleted user " + user.getId());
  }
}