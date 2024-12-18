package com.mail.back.REST;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import com.mail.back.GlobalHandle.NotFoundException;
import com.mail.back.Service.AttachmentService.AttachmentService;
import com.mail.back.Service.EmailService.EmailService;
import com.mail.back.Service.UserService.UserService;
import com.mail.back.Singleton.LoggedInUser;
import com.mail.back.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.mail.back.Service.UserEmailService.UserEmailService;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/userEmails")

public class UserEmailRestController {
  private final UserEmailService userEmailService ;
  private final UserService userService;
  private final EmailService emailService;

  @Autowired
  public UserEmailRestController(UserEmailService userEmailService, UserService userService, EmailService emailService) {
    this.userService = userService;
    this.emailService = emailService;
    this.userEmailService = userEmailService;
  }
  

  @GetMapping
  public List<UserEmail> findAll() {
    return userEmailService.findAll();
  }

  @GetMapping("/{senderId}/{receiverId}/{emailId}")
  public UserEmail findById(@PathVariable int senderId, @PathVariable int receiverId, @PathVariable int emailId) {
      return userEmailService.findById(new UserEmailID(senderId, receiverId, emailId));
  }

  @PostMapping
  public UserEmail addUserEmail(@RequestBody UserEmail userEmail) {   // I'm not sure if this is enough
    if (userEmail.getUserEmailID() == null) {
      throw new IllegalArgumentException("UserEmailID must be provided");
    }
    userEmail.setEmail(emailService.findById(userEmail.getUserEmailID().getEmailId()));
    userEmail.setReceiver(userService.findById(userEmail.getUserEmailID().getReceiverId()));
    userEmail.setSender(userService.findById(userEmail.getUserEmailID().getSenderId()));
    return userEmailService.save(userEmail);
  }

  // don't know if we should enable updating...

  @DeleteMapping("/{senderId}/{receiverId}/{emailId}")
  public String deleteById(
          @PathVariable Integer senderId,
          @PathVariable Integer receiverId,
          @PathVariable Integer emailId
  ) {
    UserEmailID userEmailID = new UserEmailID(senderId, receiverId, emailId);
    UserEmail existingUserEmail = userEmailService.findById(userEmailID);

    if (existingUserEmail == null) {
      throw new NotFoundException("UserEmail with senderId " + senderId + ", receiverId " + receiverId + " and emailId " + emailId + " not found.");
    }

    userEmailService.deleteById(userEmailID);
    return "Deleted UserEmail with senderId " + senderId + ", receiverId " + receiverId + " and emailId " + emailId;
  }

  @GetMapping("/emails/{id}/{folder}")
  public List<Email> getEmails(@PathVariable String folder, @PathVariable int id) {
    // get the currently logged-in user

    //determine the folder
    List<Email> emails;

    System.out.println(folder);
    Email.Folder theFolder;
    switch (folder){
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
        break;
    }
    //add the attachments
    for (Email email : emails){
      List<Attachment> attachments = emailService.getAttachmentsForEmail(email.getId());
      email.setAttachments(attachments);
    }
    return emails ;
  }
}
