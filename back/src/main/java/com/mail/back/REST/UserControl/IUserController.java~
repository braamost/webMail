package com.mail.back.REST.UserControl;

import com.mail.back.entity.User;
import org.springframework.http.ResponseEntity;
import java.util.List;

public interface IUserController {
    List<User> findAll();
    ResponseEntity<User> findById(int id);
    ResponseEntity<User> findByUserName(String username);
    ResponseEntity<User> findByEmail(String email);
    ResponseEntity<User> login(User loginRequest);
    ResponseEntity<User> addUser(User user);
    ResponseEntity<User> updateUser(User user);
    ResponseEntity<String> deleteUser(User user);
}