package com.mail.back.REST.EmailController;

import com.mail.back.GlobalHandle.NotFoundException;
import com.mail.back.GlobalHandle.UnauthorizedException;
import com.mail.back.Service.EmailService.EmailService;
import com.mail.back.Service.UserService.UserService;
import com.mail.back.entity.Email;
import com.mail.back.entity.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequestMapping("/api/emails")
@Slf4j
public class EmailRestController implements IEmailController {
    private final EmailService emailService;
    private final UserService userService;

    @Autowired
    public EmailRestController(EmailService emailService, UserService userService) {
        this.emailService = emailService;
        this.userService = userService;
    }

    @Override
    @GetMapping
    public List<Email> findAll(Authentication authentication) {
        log.info("Finding all emails");
        validateAuthentication(authentication);
        return emailService.findAll();
    }

    @Override
    @GetMapping("/{id}")
    public Email getById(@PathVariable Integer id, Authentication authentication) {
        log.info("Finding email by ID: {}", id);
        validateAuthentication(authentication);
        validateId(id);
        return emailService.findById(id);
    }

    @Override
    @PostMapping("/add")
    public ResponseEntity<Email> addEmail(@RequestBody Email email, Authentication authentication) {
        log.info("Adding new email");
        validateAuthentication(authentication);
        validateNewEmail(email);
        email.setId(null);
        Email savedEmail = emailService.save(email);
        log.info("Email saved: {}", savedEmail);
        return ResponseEntity.ok(savedEmail);
    }

    @Override
    @PutMapping("/{folder}/{id}")
    public Email updateFolder(@PathVariable String folder, @PathVariable Integer id, Authentication authentication) {
        log.info("Updating email {} for folder: {}", id, folder);
        validateAuthentication(authentication);
        validateFolderUpdate(folder, id);
        Email email = emailService.findById(id);

        switch (folder.toLowerCase()) {
            case "starred":
                email.setStarred(!email.isStarred());
                break;
            case "read":
                email.setRead(!email.isRead());
                break;
            case "open":
                email.setRead(true);
                break;
            case "spam":
                email.setFolder(email.getFolder().equals(Email.Folder.SPAM) ?
                        Email.Folder.GENERAL : Email.Folder.SPAM);
                break;
            case "trash":
                email.setFolder(email.getFolder().equals(Email.Folder.TRASH) ?
                        Email.Folder.GENERAL : Email.Folder.TRASH);
                break;
            case "archive":
                email.setFolder(email.getFolder().equals(Email.Folder.ARCHIVE) ?
                        Email.Folder.GENERAL : Email.Folder.ARCHIVE);
                break;
        }

        return emailService.save(email);
    }

    @Override
    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable Integer id, Authentication authentication) {
        log.info("Deleting email with ID: {}", id);
        validateAuthentication(authentication);
        validateId(id);
        emailService.deleteById(id);
    }

    // Save or Update Draft
    @PostMapping("/drafts/save")
    public ResponseEntity<Email> saveDraft(@RequestBody Email email, Authentication authentication) {
        log.info("Saving draft");
        validateAuthentication(authentication);
        email.setFolder(Email.Folder.DRAFT);
        email.setEmailDirection(Email.EmailDirection.DRAFT);
        Email savedDraft = emailService.save(email);
        return ResponseEntity.ok(savedDraft);
    }

    @DeleteMapping("/drafts/delete/{id}")
    public ResponseEntity<String> deleteDraft(@PathVariable Integer id, Authentication authentication) {
        log.info("Deleting draft with ID: {}", id);
        validateAuthentication(authentication);
        validateId(id);
        emailService.deleteDraft(id);
        return ResponseEntity.ok("Draft deleted successfully.");
    }

    @PutMapping("/drafts/update/{id}")
    public ResponseEntity<Email> updateDraft(@PathVariable Integer id, @RequestBody Email updatedDraft, Authentication authentication) {
        log.info("Updating draft with ID: {}", id);
        validateAuthentication(authentication);
        validateId(id);
        updatedDraft.setId(id);
        Email savedDraft = emailService.saveDraft(updatedDraft);
        return ResponseEntity.ok(savedDraft);
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

    private void validateId(Integer id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Invalid email ID");
        }
        if (emailService.findById(id) == null) {
            throw new NotFoundException("Email not found with ID: " + id);
        }
    }

    private void validateNewEmail(Email email) {
        if (email == null) {
            throw new IllegalArgumentException("Email cannot be null");
        }
        if(email.getEmailDirection() == null) {
            throw new IllegalArgumentException("Email direction cannot be null");
        }
        if(email.getBody() == null) {
            throw new IllegalArgumentException("Email body cannot be null");
        }
        if(email.getSubject() == null) {
            throw new IllegalArgumentException("Email subject cannot be null");
        }
    }

    private void validateFolderUpdate(String folder, Integer id) {
        validateId(id);

        Set<String> validFolders = new HashSet<>(Arrays.asList(
                "starred", "read", "spam", "trash", "archive", "open"
        ));

        if (!validFolders.contains(folder.toLowerCase())) {
            throw new IllegalArgumentException("Invalid folder: " + folder);
        }
    }
}