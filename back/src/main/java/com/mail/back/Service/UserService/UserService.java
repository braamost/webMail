package com.mail.back.Service.UserService;
import com.mail.back.entity.*;
import java.util.List;
public interface UserService {
  List<User> findAll();

  User findById(Integer theId);

  User save(User theUser);

  User update(User theUser);

  void deleteById(Integer theId);

  User findByUserName(String Username);

  User findByEmail(String email);

  boolean checkPassword(User user, String password);
}
