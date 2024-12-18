package com.mail.back.Service.UserEmailService;
import com.mail.back.entity.Email;
import com.mail.back.entity.UserEmail;
import com.mail.back.entity.UserEmailID;

import java.util.List;
public interface UserEmailService {
  List<UserEmail> findAll();

  UserEmail findById(UserEmailID theId);

  UserEmail save(UserEmail theUserEmail);

  void deleteById(UserEmailID theId);

  List<Email> getEmailsByReceiverAndFolder(Integer receiverId,  Email.Folder folder);

  List<Email> getEmailsBySenderAndFolder(Integer senderId,  Email.Folder folder);

}
