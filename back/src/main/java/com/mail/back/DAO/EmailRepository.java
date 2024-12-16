package com.mail.back.DAO;

import com.mail.back.entity.Attachment;
import com.mail.back.entity.Email; // Import your Email entity
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EmailRepository extends JpaRepository<Email, Integer> {
    @Query("SELECT a FROM Attachment a WHERE a.email.id = :emailId")
    List<Attachment> findAttachmentsByEmailId(@Param("emailId") Integer emailId);
}
