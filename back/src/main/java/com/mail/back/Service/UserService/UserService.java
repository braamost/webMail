package com.mail.back.Service.UserService;
import com.mail.back.entity.*;
import java.util.List;
public interface UserService {
  List<User> findAll();

  User findById(int theId);

  User save(User theUser);

  void deleteById(int theId);
}
