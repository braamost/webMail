package com.mail.back.Service.UserService;
import com.mail.back.entity.*;
import java.util.List;
public interface UserService {
  List<User> findAll();

  User findById(Integer theId);

  User save(User theUser);

  void deleteById(Integer theId);

  User getByUserName(String Username);
}
