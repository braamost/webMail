package com.mail.back.DAO;

import com.mail.back.entity.UserEmailID; // Import your Email entity
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserEmailIDRepository extends JpaRepository<UserEmailID, Integer> {
    // Define custom query methods here if needed
}
