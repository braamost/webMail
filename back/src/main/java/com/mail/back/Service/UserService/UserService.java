package com.mail.back.Service.UserService;

import com.mail.back.DTO.LoginRequest;
import com.mail.back.DTO.LoginResponse;
import com.mail.back.DTO.RegisterRequest;
import com.mail.back.DTO.UpdatePasswordRequest;
import com.mail.back.DTO.UserResponse;
import com.mail.back.Storage.ObjectService.StoredObject;
import com.mail.back.entity.User;
import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface UserService {
    List<User> findAll();

    User findById(Integer theId);

    User save(User theUser);

    UserResponse register(RegisterRequest request, MultipartFile photo);

    LoginResponse login(LoginRequest loginRequest);

    User update(User theUser);

    void updatePassword(Integer id, UpdatePasswordRequest request, Authentication authentication);

    void deleteById(Integer theId, Authentication authentication);

    User findByUserName(String Username);

    User findByEmail(String email);

    UserResponse getByUserName(String username);

    UserResponse getByEmail(String email);

    boolean checkPassword(User user, String password);

    String saveProfilePhoto(Integer id, MultipartFile file, Authentication authentication);

    StoredObject openProfilePhoto(Integer id, String filename);
}
