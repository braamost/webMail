package com.mail.back.Service.UserService;
import com.mail.back.REST.UserControl.LoginRequest;
import com.mail.back.REST.UserControl.LoginResponse;
import com.mail.back.entity.*;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
public interface UserService {
  List<User> findAll();

  User findById(Integer theId);

  User save(User theUser);

  LoginResponse login(LoginRequest loginRequest);

  User update(User theUser);

  User updatePassword(User user, String newPassword);

  void deleteById(Integer theId);

  User findByUserName(String Username);

  User findByEmail(String email);

  boolean checkPassword(User user, String password);

  String saveProfilePhoto(Integer id, MultipartFile file) throws IOException;

  Resource getProfilePhoto(Integer id, String filename) throws IOException;
}
