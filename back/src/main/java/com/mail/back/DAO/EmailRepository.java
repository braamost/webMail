package com.mail.back.DAO;

import com.mail.back.entity.Attachment;
import com.mail.back.entity.Email;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.util.List;

public interface EmailRepository extends JpaRepository<Email, Integer> {

    @Query("SELECT a FROM Attachment a WHERE a.email.id = :emailId")
    List<Attachment> findAttachmentsByEmailId(@Param("emailId") Integer emailId);

    @Modifying
    @Transactional
    @Query("DELETE FROM Email e WHERE e.folder = 'TRASH' AND e.sentAt < :threshold")
    int deleteOldTrashEmails(@Param("threshold") LocalDateTime threshold);



}
