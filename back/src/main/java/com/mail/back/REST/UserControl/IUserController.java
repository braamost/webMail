package com.mail.back.REST.UserControl;

import com.mail.back.entity.User;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface IUserController {
    ResponseEntity<User> findByUserName(String username);
    ResponseEntity<User> findByEmail(String email);
    ResponseEntity<LoginResponse> login(LoginRequest loginRequest);
    ResponseEntity<Void> registerUser(UserDto userDto, MultipartFile photo);
    ResponseEntity<Void> updatePassword(int id, String oldPassword, String newPassword, Authentication authentication);
    ResponseEntity<Void> deleteUser(int id, Authentication authentication);
    ResponseEntity<String> uploadProfilePhoto(Integer id, MultipartFile file, Authentication authentication);
    ResponseEntity<Resource> getProfilePhoto(Integer id, String filename) throws IOException;
}