package com.mail.back.REST.UserEmailController;

import com.mail.back.entity.Email;
import com.mail.back.entity.UserEmail;

import java.util.List;

public interface IUserEmailController {
    List<UserEmail> findAll();
    UserEmail findById(Integer senderId, Integer receiverId, Integer emailId);
    UserEmail addUserEmail(UserEmail userEmail);
    String deleteById(Integer senderId, Integer receiverId, Integer emailId);
    List<Email> getEmails(String folder, Integer id);
}
