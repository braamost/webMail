package com.mail.back.REST.UserEmailController;

import com.mail.back.entity.Email;
import com.mail.back.entity.UserEmail;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface IUserEmailController {
    List<UserEmail> findAll(Authentication authentication);
    UserEmail findById(Integer senderId, Integer receiverId, Integer emailId, Authentication authentication);
    UserEmail addUserEmail(UserEmail userEmail, Authentication authentication);
    String deleteById(Integer senderId, Integer receiverId, Integer emailId, Authentication authentication);
    List<Email> getEmails(String folder, Integer id, Authentication authentication);
}
