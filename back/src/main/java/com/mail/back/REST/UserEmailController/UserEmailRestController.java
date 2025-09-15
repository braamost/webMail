package com.mail.back.REST.UserEmailController;

import java.util.List;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

import com.mail.back.GlobalHandle.NotFoundException;
import com.mail.back.GlobalHandle.UnauthorizedException;
import com.mail.back.Service.EmailService.EmailService;
import com.mail.back.Service.UserService.UserService;
import com.mail.back.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.mail.back.Service.UserEmailService.UserEmailService;
import lombok.extern.slf4j.Slf4j;

import static com.mail.back.entity.Email.Folder.DRAFT;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequestMapping("/api/userEmails")
@Slf4j
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
  @GetMapping
  public List<UserEmail> findAll(Authentication authentication) {
    log.info("Finding all user emails");
    validateAuthentication(authentication);
    return userEmailService.findAll();
  }

  @Override
  @GetMapping("/{senderId}/{receiverId}/{emailId}")
  public UserEmail findById(@PathVariable Integer senderId, @PathVariable Integer receiverId, @PathVariable Integer emailId, Authentication authentication) {
    log.info("Finding user email with senderId: {}, receiverId: {}, emailId: {}", senderId, receiverId, emailId);
    validateAuthentication(authentication);
    validateIds(senderId, receiverId, emailId);
    return userEmailService.findById(new UserEmailID(senderId, receiverId, emailId));
  }

  @Override
  @PostMapping
  public UserEmail addUserEmail(@RequestBody UserEmail userEmail, Authentication authentication) {
    log.info("Adding new user email relationship");
    validateAuthentication(authentication);
    validateNewUserEmail(userEmail);
    userEmail.setEmail(emailService.findById(userEmail.getUserEmailID().getEmailId()));
    userEmail.setReceiver(userService.findById(userEmail.getUserEmailID().getReceiverId()));
    userEmail.setSender(userService.findById(userEmail.getUserEmailID().getSenderId()));
    return userEmailService.save(userEmail);
  }

  @Override
  @DeleteMapping("/{senderId}/{receiverId}/{emailId}")
  public String deleteById(@PathVariable Integer senderId, @PathVariable Integer receiverId, @PathVariable Integer emailId, Authentication authentication) {
    log.info("Deleting user email relationship with senderId: {}, receiverId: {}, emailId: {}", senderId, receiverId, emailId);
    validateAuthentication(authentication);
    validateIds(senderId, receiverId, emailId);
    validateExistingUserEmail(senderId, receiverId, emailId);
    UserEmailID userEmailID = new UserEmailID(senderId, receiverId, emailId);
    userEmailService.deleteById(userEmailID);
    return "Deleted UserEmail with senderId " + senderId +
            ", receiverId " + receiverId +
            " and emailId " + emailId;
  }

  @Override
  @GetMapping("/emails/{id}/{folder}")
  public List<Email> getEmails(@PathVariable String folder, @PathVariable Integer id, Authentication authentication) {
    log.info("Retrieving emails for user {} from folder {}", id, folder);
    validateAuthentication(authentication);
    validateGetEmailsRequest(folder, id);
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
      case "DRAFT":
        emails = userEmailService.getEmailsBySenderAndFolder(id, DRAFT);
        System.out.println(emails);
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

  // Private validation methods
  private void validateAuthentication(Authentication authentication) {
    if (authentication == null || authentication.getPrincipal() == null) {
      throw new UnauthorizedException("Authentication required");
    }
    String username = (String) authentication.getPrincipal();
    User user = userService.findByUserName(username);
    if (user == null) {
      throw new UnauthorizedException("Invalid user");
    }
  }

  private void validateIds(Integer senderId, Integer receiverId, Integer emailId) {
    if (senderId == null || senderId <= 0) {
      throw new IllegalArgumentException("Invalid sender ID");
    }
    if (receiverId == null || receiverId <= 0) {
      throw new IllegalArgumentException("Invalid receiver ID");
    }
    if (emailId == null || emailId <= 0) {
      throw new IllegalArgumentException("Invalid email ID");
    }

    // Validate that users exist
    if (userService.findById(senderId) == null) {
      throw new NotFoundException("Sender not found with ID: " + senderId);
    }
    if (userService.findById(receiverId) == null) {
      throw new NotFoundException("Receiver not found with ID: " + receiverId);
    }
    if (emailService.findById(emailId) == null) {
      throw new NotFoundException("Email not found with ID: " + emailId);
    }
  }

  private void validateNewUserEmail(UserEmail userEmail) {
    if (userEmail == null) {
      throw new IllegalArgumentException("UserEmail cannot be null");
    }
    if (userEmail.getUserEmailID() == null) {
      throw new IllegalArgumentException("UserEmailID must be provided");
    }

    UserEmailID id = userEmail.getUserEmailID();
    validateIds(id.getSenderId(), id.getReceiverId(), id.getEmailId());
  }

  private void validateExistingUserEmail(Integer senderId, Integer receiverId, Integer emailId) {
    UserEmailID userEmailID = new UserEmailID(senderId, receiverId, emailId);
    if (userEmailService.findById(userEmailID) == null) {
      throw new NotFoundException(
              String.format("UserEmail with senderId %d, receiverId %d and emailId %d not found",
                      senderId, receiverId, emailId));
    }
  }

  private void validateGetEmailsRequest(String folder, Integer id) {
    if (id == null || id <= 0) {
      throw new IllegalArgumentException("Invalid user ID");
    }
    if (userService.findById(id) == null) {
      throw new NotFoundException("User not found with ID: " + id);
    }

    Set<String> validFolders = new HashSet<>(Arrays.asList(
            "INBOX", "SENT", "STARRED", "SPAM", "TRASH", "ARCHIVE", "DRAFT"
    ));

    if (!validFolders.contains(folder.toUpperCase())) {
      throw new IllegalArgumentException("Invalid folder: " + folder);
    }
  }
}
