package com.mail.back.REST.UserEmailController;

import java.util.List;

import com.mail.back.Service.EmailService.EmailService;
import com.mail.back.Service.UserService.UserService;
import com.mail.back.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import com.mail.back.Service.UserEmailService.UserEmailService;

@Component
public class UserEmailRestController implements IUserEmailController {
  private final UserEmailService userEmailService;
  private final UserService userService;
  private final EmailService emailService;

  @Autowired
  public UserEmailRestController(
          UserEmailService userEmailService,
          UserService userService,
          EmailService emailService) {
    this.userEmailService = userEmailService;
    this.userService = userService;
    this.emailService = emailService;
  }

  @Override
  public List<UserEmail> findAll() {
    return userEmailService.findAll();
  }

  @Override
  public UserEmail findById(Integer senderId, Integer receiverId, Integer emailId) {
    return userEmailService.findById(new UserEmailID(senderId, receiverId, emailId));
  }

  @Override
  public UserEmail addUserEmail(UserEmail userEmail) {
    userEmail.setEmail(emailService.findById(userEmail.getUserEmailID().getEmailId()));
    userEmail.setReceiver(userService.findById(userEmail.getUserEmailID().getReceiverId()));
    userEmail.setSender(userService.findById(userEmail.getUserEmailID().getSenderId()));
    return userEmailService.save(userEmail);
  }

  @Override
  public String deleteById(Integer senderId, Integer receiverId, Integer emailId) {
    UserEmailID userEmailID = new UserEmailID(senderId, receiverId, emailId);
    userEmailService.deleteById(userEmailID);
    return "Deleted UserEmail with senderId " + senderId +
            ", receiverId " + receiverId +
            " and emailId " + emailId;
  }

  @Override
  public List<Email> getEmails(String folder, Integer id) {
    List<Email> emails;
    Email.Folder theFolder;

    switch (folder.toUpperCase()) {
      case "INBOX":
        theFolder = Email.Folder.GENERAL;
        emails = userEmailService.getEmailsByReceiverAndFolder(id, theFolder);
        break;
      case "SENT":
        theFolder = Email.Folder.GENERAL;
        emails = userEmailService.getEmailsBySenderAndFolder(id, theFolder);
        break;
      case "STARRED":
        emails = userEmailService.getEmailsByStarred(id);
        break;
      default:
        theFolder = Email.Folder.valueOf(folder);
        emails = userEmailService.getEmailsByReceiverAndFolder(id, theFolder);
        emails.addAll(userEmailService.getEmailsBySenderAndFolder(id, theFolder));
    }

    for (Email email : emails) {
      email.setAttachments(emailService.getAttachmentsForEmail(email.getId()));
    }
    return emails;
  }
}
