package com.mail.back.Service.EmailService;

import com.mail.back.DTO.EmailRequest;
import com.mail.back.DTO.EmailResponse;
import com.mail.back.entity.Attachment;
import com.mail.back.entity.Email;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface EmailService {
    List<EmailResponse> findAll(Authentication authentication);

    EmailResponse getById(Integer id, Authentication authentication);

    Email findById(Integer id);

    EmailResponse create(EmailRequest request, Authentication authentication);

    EmailResponse updateFolder(String folder, Integer id, Authentication authentication);

    void deleteById(Integer id, Authentication authentication);

    List<Attachment> getAttachmentsForEmail(Integer emailId);

    EmailResponse saveDraft(EmailRequest request, Authentication authentication);

    EmailResponse updateDraft(Integer id, EmailRequest request, Authentication authentication);

    void deleteDraft(Integer id, Authentication authentication);
}
