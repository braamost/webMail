package com.mail.back.REST.UserControl;

import com.mail.back.Service.UserService.UserService;
import com.mail.back.entity.User;
import jakarta.servlet.http.HttpServletRequest;
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
    return ResponseEntity.ok(userService.findById(id));
  }

  @PostMapping("/login")
  public ResponseEntity<User> login(@RequestBody User loginRequest, HttpServletRequest request) {
    User user = userService.findByUserName(loginRequest.getUserName());
    request.getSession().setAttribute("userId", user.getId());
    user.setSessionId(request.getSession().getId());
    return ResponseEntity.ok(user);
  }

  @PostMapping("/logout")
  public ResponseEntity<String> logout(HttpServletRequest request) {
    request.getSession().invalidate();
    return ResponseEntity.ok("Logged out");
  }

  @PostMapping
  public ResponseEntity<User> addUser(@RequestBody User user) {
    return ResponseEntity.status(HttpStatus.CREATED).body(userService.save(user));
  }

  @PutMapping("/{id}")
  public ResponseEntity<User> updateUser(@RequestBody User user, @PathVariable int id,
                                         HttpServletRequest request) {
    user.setId(id);
    return ResponseEntity.ok(userService.save(user));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<String> deleteUser(@PathVariable int id, HttpServletRequest request) {
    userService.deleteById(id);
    return ResponseEntity.ok("Deleted user " + id);
  }
}