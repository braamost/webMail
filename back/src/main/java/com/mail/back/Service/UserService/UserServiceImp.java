package com.mail.back.Service.UserService;

import com.mail.back.GlobalHandle.NotFoundException;
import com.mail.back.GlobalHandle.UserAlreadyExistsException;
import com.mail.back.REST.UserControl.LoginRequest;
import com.mail.back.REST.UserControl.LoginResponse;
import com.mail.back.Security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.mail.back.entity.*;
import com.mail.back.DAO.UserRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
@Service
public class UserServiceImp implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final Path root = Paths.get("uploads/profile-photos");


    @Autowired
    public UserServiceImp(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Override
    public User findById(Integer theId) {
        Optional<User> result = userRepository.findById(theId);

        User theUser = null;

        if (result.isPresent()) {
            theUser = result.get();
        }
        else {
            // we didn't find the User
            throw new NotFoundException("User with ID " + theId + " not found.");
        }

        return theUser;
    }

    @Override
    public User save(User theUser) {
        String email = theUser.getEmail(), userName = theUser.getUserName(), password = theUser.getPassword();
        if(email == null || userName == null || password == null)
            throw new IllegalArgumentException("User name, email and password are required");
        if(userRepository.findByEmail(email) != null)
            throw new  UserAlreadyExistsException("email taken");
        if(userRepository.findByUserName(userName) != null)
            throw new  UserAlreadyExistsException("username taken");
        theUser.setPassword(passwordEncoder.encode(theUser.getPassword()));
        return userRepository.save(theUser);
    }

    @Override
    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        // find user by username or email
        User user = userRepository.findByUserName(request.getUserName());
        if(user == null)
            throw new NotFoundException("User not found");

        // check password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid username/email or password");
        }

        // generate JWT token
        String token = jwtUtil.generateToken(user.getUserName());

        return new LoginResponse(token, user.getId(), user.getUserName(), user.getProfileUrl(), user.getEmail(),user.getPhoneNumber());
    }

    @Override
    public String saveProfilePhoto(Integer id, MultipartFile file) throws IOException {
        if (!Files.exists(root)) {
            Files.createDirectories(root);
        }

        String filename = id + "_" + file.getOriginalFilename();
        Path filePath = root.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return userRepository.findById(id).map(user -> {
            String url = "/api/users/" + id + "/profile-photo/" + filename;
            user.setProfileUrl(url);
            userRepository.save(user);
            return url;
        }).orElseThrow(() -> new NotFoundException("User not found"));
    }

    @Override
    public Resource getProfilePhoto(Integer id, String filename) throws IOException {
        Path file = root.resolve(filename);
        Resource resource = new UrlResource(file.toUri());
        if (resource.exists() && resource.isReadable()) {
            return resource;
        }
        throw new FileNotFoundException("Profile photo not found: " + filename);
    }


    @Override
    public User update(User theUser) {
        return userRepository.save(theUser);
    }

    @Override
    public User updatePassword(User user, String newPassword) {
        user.setPassword(passwordEncoder.encode(newPassword));
        return userRepository.save(user);
    }

    @Override
    public void deleteById(Integer theId) {
        userRepository.deleteById(theId);
    }

    @Override
    public User findByUserName(String Username){
        return userRepository.findByUserName(Username);
    }
    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    @Override
    public boolean checkPassword(User user, String password) {
        return !passwordEncoder.matches(password, user.getPassword());
    }
}
