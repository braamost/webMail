package com.mail.back.Service.UserEmailService;

import com.mail.back.DTO.EmailResponse;
import com.mail.back.DTO.UserEmailRequest;
import com.mail.back.DTO.UserEmailResponse;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface UserEmailService {
    List<UserEmailResponse> findAll(Authentication authentication);

    UserEmailResponse findById(
            Integer senderId,
            Integer receiverId,
            Integer emailId,
            Authentication authentication);

    UserEmailResponse save(UserEmailRequest request, Authentication authentication);

    void deleteById(
            Integer senderId,
            Integer receiverId,
            Integer emailId,
            Authentication authentication);

    List<EmailResponse> getEmails(String folder, Integer userId, Authentication authentication);
}
