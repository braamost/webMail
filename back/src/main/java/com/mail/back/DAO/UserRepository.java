package com.mail.back.DAO;

import com.mail.back.entity.User; // Import your Email entity
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {
    // Define custom query methods here if needed
    public User getByUserName(String Username);
}
