package com.mail.back.DAO;

import com.mail.back.entity.Email; // Import your Email entity
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmailRepository extends JpaRepository<Email, Integer> {
    // Define custom query methods here if needed
}
