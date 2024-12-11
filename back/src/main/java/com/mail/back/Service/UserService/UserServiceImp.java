package com.mail.back.Service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import com.mail.back.entity.*;
import com.mail.back.DAO.UserRepository;
import java.util.List;
import java.util.Optional;
public class UserServiceImp implements UserService {
    private  UserRepository userRepository;
    @Autowired
    public UserServiceImp(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    @Override
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Override
    public User findById(int theId) {
        Optional<User> result = userRepository.findById(theId);

        User theUser = null;

        if (result.isPresent()) {
            theUser = result.get();
        }
        else {
            // we didn't find the User
            throw new RuntimeException("Did not find User id - " + theId);
        }

        return theUser;
    }

    @Override
    public User save(User theUser) {
        return userRepository.save(theUser);
    }

    @Override
    public void deleteById(int theId) {
        userRepository.deleteById(theId);
    }
}
