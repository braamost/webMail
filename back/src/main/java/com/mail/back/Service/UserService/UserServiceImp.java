package com.mail.back.Service.UserService;

import com.mail.back.GlobalHandle.NotFoundException;
import com.mail.back.Security.SecurityConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.mail.back.entity.*;
import com.mail.back.DAO.UserRepository;
import java.util.List;
import java.util.Optional;
@Service
public class UserServiceImp implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImp(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
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
        theUser.setPassword(passwordEncoder.encode(theUser.getPassword()));
        return userRepository.save(theUser);
    }

    @Override
    public void deleteById(Integer theId) {
        userRepository.deleteById(theId);
    }

    @Override
    public User findByUserName(String Username){
        return userRepository.findByUserName(Username);
    }
    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    public boolean checkPassword(User user, String password) {
        return passwordEncoder.matches(password, user.getPassword());
    }
}
