package com.mail.back.REST;

import com.mail.back.GlobalHandle.NotFoundException;
import com.mail.back.GlobalHandle.UserAlreadyExistsException;
import com.mail.back.GlobalHandle.WrongPasswordException;
import com.mail.back.Service.UserService.UserService;
import com.mail.back.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/users")
public class UserRestController {

  private final UserService userService;

  @Autowired
  public UserRestController(UserService userService) {
    this.userService = userService;
  }

  // Fetch all users
  @GetMapping
  public List<User> findAll() {
    return userService.findAll();
  }

  // Fetch user by ID
  @GetMapping("/{id}")
  public User findById(@PathVariable int id) {
      return userService.findById(id);
  }

  // Fetch user by username
  @GetMapping("/username/{userName}/{password}")
  public ResponseEntity<User> findByUserName(@PathVariable String userName, @PathVariable String password) {
    User user = userService.findByUserName(userName);
    if (user == null) {
      throw new NotFoundException("User with username " + userName + " not found.");
    }
    if(!user.getPassword().equals(password)) {
      throw new WrongPasswordException("Wrong password.");
    }
    return ResponseEntity.ok(user);
  }

  // Add a new user
  @PostMapping
  public ResponseEntity<User> addUser(@RequestBody User user) {
    user.setId(null); // Ensure the ID is set to null for creating a new entity
    String userName = user.getUserName();
    String email = user.getEmail();

    if (userService.findByUserName(userName) != null) {
      throw new UserAlreadyExistsException("User with username " + userName + " already exists.");
    }
    if (userService.findByEmail(email) != null) {
      throw new UserAlreadyExistsException("User with email " + email + " already exists.");
    }
    User savedUser = userService.save(user);
    return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
  }

  // Update an existing user
  @PutMapping("/{id}")
  public User updateUser(@RequestBody User user, @PathVariable int id) {
    User theUser = userService.findById(id);
    if(theUser == null) {
      throw new NotFoundException("User with ID " + id + " not found.");
    }
    user.setId(id);
    user.setCreatedAt(theUser.getCreatedAt());
    return userService.save(user);
  }

  // Delete user by ID
  @DeleteMapping("/{id}")
  public String deleteById(@PathVariable int id) {
    User user = userService.findById(id);
    if (user == null) {
      throw new NotFoundException("User with ID " + id + " not found.");
    }
    userService.deleteById(id);
    return "Deleted user with ID " + id;
  }

  // Delete user by username
  @DeleteMapping("/username/{userName}")
  public String deleteByUserName(@PathVariable String userName) {
    User user = userService.findByUserName(userName);
    if (user == null) {
      throw new NotFoundException("User with username " + userName + " not found.");
    }
    userService.deleteById(user.getId());
    return "Deleted user with username " + userName;
  }
}