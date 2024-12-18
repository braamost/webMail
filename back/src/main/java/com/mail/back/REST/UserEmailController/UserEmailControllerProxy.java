package com.mail.back.REST.UserEmailController;

import com.mail.back.GlobalHandle.NotFoundException;
import com.mail.back.Service.EmailService.EmailService;
import com.mail.back.Service.UserEmailService.UserEmailService;
import com.mail.back.Service.UserService.UserService;
import com.mail.back.entity.Email;
import com.mail.back.entity.UserEmail;
import com.mail.back.entity.UserEmailID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/userEmails")
public class UserEmailControllerProxy implements IUserEmailController {
    private final IUserEmailController realController;
    private final UserEmailService userEmailService;
    private final UserService userService;
    private final EmailService emailService;
    private final Logger logger = LoggerFactory.getLogger(UserEmailControllerProxy.class);

    public UserEmailControllerProxy(
            UserEmailRestController realController,
            UserEmailService userEmailService,
            UserService userService,
            EmailService emailService) {
        this.realController = realController;
        this.userEmailService = userEmailService;
        this.userService = userService;
        this.emailService = emailService;
    }

    @Override
    @GetMapping
    public List<UserEmail> findAll() {
        logger.info("Proxy: Retrieving all user emails");
        try {
            return realController.findAll();
        } catch (Exception e) {
            logger.error("Error retrieving all user emails", e);
            throw e;
        }
    }

    @Override
    @GetMapping("/{senderId}/{receiverId}/{emailId}")
    public UserEmail findById(
            @PathVariable Integer senderId,
            @PathVariable Integer receiverId,
            @PathVariable Integer emailId) {
        logger.info("Proxy: Finding user email with senderId: {}, receiverId: {}, emailId: {}",
                senderId, receiverId, emailId);
        try {
            validateIds(senderId, receiverId, emailId);
            return realController.findById(senderId, receiverId, emailId);
        } catch (Exception e) {
            logger.error("Error finding user email", e);
            throw e;
        }
    }

    @Override
    @PostMapping
    public UserEmail addUserEmail(@RequestBody UserEmail userEmail) {
        logger.info("Proxy: Adding new user email relationship");
        try {
            validateNewUserEmail(userEmail);
            return realController.addUserEmail(userEmail);
        } catch (Exception e) {
            logger.error("Error adding user email", e);
            throw e;
        }
    }

    @Override
    @DeleteMapping("/{senderId}/{receiverId}/{emailId}")
    public String deleteById(
            @PathVariable Integer senderId,
            @PathVariable Integer receiverId,
            @PathVariable Integer emailId) {
        logger.info("Proxy: Deleting user email relationship with senderId: {}, receiverId: {}, emailId: {}",
                senderId, receiverId, emailId);
        try {
            validateIds(senderId, receiverId, emailId);
            validateExistingUserEmail(senderId, receiverId, emailId);
            return realController.deleteById(senderId, receiverId, emailId);
        } catch (Exception e) {
            logger.error("Error deleting user email", e);
            throw e;
        }
    }

    @Override
    @GetMapping("/emails/{id}/{folder}")
    public List<Email> getEmails(@PathVariable String folder, @PathVariable Integer id) {
        logger.info("Proxy: Retrieving emails for user {} from folder {}", id, folder);
        try {
            validateGetEmailsRequest(folder, id);
            return realController.getEmails(folder, id);
        } catch (Exception e) {
            logger.error("Error retrieving emails", e);
            throw e;
        }
    }

    // Private validation methods
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

        // Validate folder name
        Set<String> validFolders = new HashSet<>(Arrays.asList(
                "INBOX", "SENT", "STARRED", "SPAM", "TRASH", "ARCHIVE", "DRAFT"
        ));

        if (!validFolders.contains(folder.toUpperCase())) {
            throw new IllegalArgumentException("Invalid folder: " + folder);
        }
    }
}
