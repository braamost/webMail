package com.mail.back.DAO;

import com.mail.back.entity.Attachment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttachmentRepository extends JpaRepository<Attachment, Integer> {
    // Additional query methods if needed
}
