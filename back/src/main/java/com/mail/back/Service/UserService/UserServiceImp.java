package com.mail.back.Service.UserService;

import com.mail.back.DAO.UserRepository;
import com.mail.back.DTO.EntityMapper;
import com.mail.back.DTO.LoginRequest;
import com.mail.back.DTO.LoginResponse;
import com.mail.back.DTO.RegisterRequest;
import com.mail.back.DTO.UpdatePasswordRequest;
import com.mail.back.DTO.UserResponse;
import com.mail.back.GlobalHandle.NotFoundException;
import com.mail.back.GlobalHandle.UserAlreadyExistsException;
import com.mail.back.Security.JwtUtil;
import com.mail.back.Service.Validation.ValidationService;
import com.mail.back.Storage.ObjectService;
import com.mail.back.Storage.ObjectService.StoredObject;
import com.mail.back.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImp implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final ObjectService objectService;
    private final ValidationService validationService;
    private final EntityMapper entityMapper;

    @Autowired
    public UserServiceImp(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil,
            ObjectService objectService,
            ValidationService validationService,
            EntityMapper entityMapper) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.objectService = objectService;
        this.validationService = validationService;
        this.entityMapper = entityMapper;
    }

    @Override
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Override
    public User findById(Integer theId) {
        @SuppressWarnings("null")
        Optional<User> result = userRepository.findById(theId);
        if (result.isPresent()) {
            return result.get();
        }
        throw new NotFoundException("User with ID " + theId + " not found.");
    }

    @Override
    public User save(User theUser) {
        String email = theUser.getEmail(), userName = theUser.getUserName(), password = theUser.getPassword();
        if (email == null || userName == null || password == null) {
            throw new IllegalArgumentException("User name, email and password are required");
        }
        if (userRepository.findByEmail(email) != null) {
            throw new UserAlreadyExistsException("email taken");
        }
        if (userRepository.findByUserName(userName) != null) {
            throw new UserAlreadyExistsException("username taken");
        }
        theUser.setPassword(passwordEncoder.encode(theUser.getPassword()));
        return userRepository.save(theUser);
    }

    @Override
    public UserResponse register(RegisterRequest request, MultipartFile photo) {
        User savedUser = save(entityMapper.toUser(request));
        if (photo != null && !photo.isEmpty()) {
            validationService.validateFile(photo);
            persistProfilePhoto(savedUser, photo);
        }
        return entityMapper.toUserResponse(savedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByUserName(request.getUserName());
        if (user == null) {
            throw new NotFoundException("User not found");
        }
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid username/email or password");
        }
        String token = jwtUtil.generateToken(user.getUserName());
        return new LoginResponse(
                token,
                user.getId(),
                user.getUserName(),
                user.getProfileUrl(),
                user.getEmail(),
                user.getPhoneNumber());
    }

    @Override
    public String saveProfilePhoto(Integer id, MultipartFile file, Authentication authentication) {
        User authenticated = validationService.requireAuthenticatedUser(authentication);
        validationService.requireOwnership(
                authenticated, id, "You are not authorized to upload profile photo for this user");
        validationService.validateFile(file);
        User user = findById(id);
        return persistProfilePhoto(user, file);
    }

    private String persistProfilePhoto(User user, MultipartFile file) {
        String storedReference = objectService.save(file, "users/photos");
        String url = storedReference.startsWith("http://") || storedReference.startsWith("https://")
                ? storedReference
                : "/api/users/" + user.getId() + "/profile-photo/"
                + Path.of(storedReference).getFileName();
        user.setProfileUrl(url);
        userRepository.save(user);
        return url;
    }

    @Override
    public StoredObject openProfilePhoto(Integer id, String filename) {
        User user = findById(id);
        if (user.getProfileUrl() == null || user.getProfileUrl().isBlank()) {
            throw new NotFoundException("Profile photo not found");
        }
        String storedReference = user.getProfileUrl().startsWith("/api/")
                ? "users/photos/" + filename
                : user.getProfileUrl();
        return objectService.open(storedReference);
    }

    @SuppressWarnings("null")
    @Override
    public User update(User theUser) {
        return userRepository.save(theUser);
    }

    @Override
    public void updatePassword(Integer id, UpdatePasswordRequest request, Authentication authentication) {
        User authenticated = validationService.requireAuthenticatedUser(authentication);
        validationService.requireOwnership(
                authenticated, id, "You are not authorized to update password for this user");
        User user = findById(id);
        validationService.validateOldPassword(user, request.getOldPassword());
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @SuppressWarnings("null")
    @Override
    public void deleteById(Integer theId, Authentication authentication) {
        User authenticated = validationService.requireAuthenticatedUser(authentication);
        validationService.requireOwnership(
                authenticated, theId, "You are not authorized to delete this user");
        validationService.requireExistingUserId(theId);
        userRepository.deleteById(theId);
    }

    @Override
    public User findByUserName(String Username) {
        return userRepository.findByUserName(Username);
    }

    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public UserResponse getByUserName(String username) {
        return entityMapper.toUserResponse(validationService.requireExistingUsername(username));
    }

    @Override
    public UserResponse getByEmail(String email) {
        return entityMapper.toUserResponse(validationService.requireExistingEmail(email));
    }

    @Override
    public boolean checkPassword(User user, String password) {
        return passwordEncoder.matches(password, user.getPassword());
    }
}
