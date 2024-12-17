package com.mail.back.REST;

import java.util.List;

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

  @GetMapping("/emails")
  public List<Email> getEmails(@RequestParam Email.Folder folder) {
    System.out.println(folder);
    LoggedInUser LOGGED_IN = LoggedInUser.getInstance();
    User user = LOGGED_IN.getUser();
    List<Email> Temp =  userEmailService.getEmailsByReceiverAndFolder(user.getId(), folder);
    for (Email email : Temp){
      List<Attachment> attachments = emailService.getAttachmentsForEmail(email.getId());
      email.setAttachments(attachments);
    }
    return Temp ;
  }

}
