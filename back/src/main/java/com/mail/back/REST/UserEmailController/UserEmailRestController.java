package com.mail.back.REST.UserEmailController;

import com.mail.back.DTO.EmailResponse;
import com.mail.back.DTO.UserEmailRequest;
import com.mail.back.DTO.UserEmailResponse;
import com.mail.back.Service.UserEmailService.UserEmailService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequestMapping("/api/userEmails")
@Slf4j
public class UserEmailRestController {
    private final UserEmailService userEmailService;

    @Autowired
    public UserEmailRestController(UserEmailService userEmailService) {
        this.userEmailService = userEmailService;
    }

    @GetMapping
    public List<UserEmailResponse> findAll(Authentication authentication) {
        log.info("Finding all user emails");
        return userEmailService.findAll(authentication);
    }

    @GetMapping("/{senderId}/{receiverId}/{emailId}")
    public UserEmailResponse findById(
            @PathVariable Integer senderId,
            @PathVariable Integer receiverId,
            @PathVariable Integer emailId,
            Authentication authentication) {
        log.info(
                "Finding user email with senderId: {}, receiverId: {}, emailId: {}",
                senderId,
                receiverId,
                emailId);
        return userEmailService.findById(senderId, receiverId, emailId, authentication);
    }

    @PostMapping
    public UserEmailResponse addUserEmail(
            @Valid @RequestBody UserEmailRequest userEmail, Authentication authentication) {
        log.info("Adding new user email relationship");
        return userEmailService.save(userEmail, authentication);
    }

    @DeleteMapping("/{senderId}/{receiverId}/{emailId}")
    public String deleteById(
            @PathVariable Integer senderId,
            @PathVariable Integer receiverId,
            @PathVariable Integer emailId,
            Authentication authentication) {
        log.info(
                "Deleting user email relationship with senderId: {}, receiverId: {}, emailId: {}",
                senderId,
                receiverId,
                emailId);
        userEmailService.deleteById(senderId, receiverId, emailId, authentication);
        return "Deleted UserEmail with senderId " + senderId
                + ", receiverId " + receiverId
                + " and emailId " + emailId;
    }

    @GetMapping("/emails/{id}/{folder}")
    public List<EmailResponse> getEmails(
            @PathVariable String folder, @PathVariable Integer id, Authentication authentication) {
        log.info("Retrieving emails for user {} from folder {}", id, folder);
        return userEmailService.getEmails(folder, id, authentication);
    }
}
