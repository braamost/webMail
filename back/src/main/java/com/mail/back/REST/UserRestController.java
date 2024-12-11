package com.mail.back.REST;

import com.mail.back.GlobalHandle.NotFoundException;
import com.mail.back.Service.UserService.UserService;
import com.mail.back.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
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
  @GetMapping("/username/{userName}")
  public User findByUserName(@PathVariable String userName) {
    User user = userService.getByUserName(userName);
    if (user == null) {
      throw new NotFoundException("User with username " + userName + " not found.");
    }
    return user;
  }

  // Add a new user
  @PostMapping
  public User addUser(@RequestBody User user) {
    user.setId(null); // Ensure the ID is set to null for creating a new entity
    return userService.save(user);
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
    User user = userService.getByUserName(userName);
    if (user == null) {
      throw new NotFoundException("User with username " + userName + " not found.");
    }
    userService.deleteById(user.getId());
    return "Deleted user with username " + userName;
  }
}