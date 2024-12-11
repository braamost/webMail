package com.mail.back.REST;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;
import com.mail.back.Service.UserService.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import com.mail.back.entity.User;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;




@RestController
@RequestMapping("/api")
public class UserRestController {
  private UserService userService;

  @Autowired
  public UserRestController(UserService userService) {
    this.userService = userService;
  }
  
  @GetMapping("/users")
  public List<User> findAll() {
    return userService.findAll();
  }
  
  @GetMapping("/users/{id}")
  public User get(@PathVariable int id) {
    return userService.findById(id);
  }
  @GetMapping("/users/{userName}")
  public User getByUserName(@PathVariable String userName) {
    return userService.getByUserName(userName);
  }
  @PostMapping("/users")
  public User postMethodName(@RequestBody User user) {
    user.setId((long)0);
      User entity = userService.save(user);
      return entity;
  }

  @PutMapping("/users")
  public User putMethodName(@PathVariable User user) {
      User entity = userService.save(user);
      return entity;
  }
  
  @DeleteMapping("/users/{id}")
  public void delete(@PathVariable int id) {
    userService.deleteById(id);
  }

  @DeleteMapping("/users/{username}")
  public void delete(@PathVariable String username) {
    long id = userService.getByUserName(username).getId();
    userService.deleteById((int)id);
  }
}
