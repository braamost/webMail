package com.mail.back.REST.EmailController;

import com.mail.back.DTO.EmailRequest;
import com.mail.back.DTO.EmailResponse;
import com.mail.back.Service.EmailService.EmailService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequestMapping("/api/emails")
@Slf4j
public class EmailRestController {
    private final EmailService emailService;

    @Autowired
    public EmailRestController(EmailService emailService) {
        this.emailService = emailService;
    }

    @GetMapping
    public List<EmailResponse> findAll(Authentication authentication) {
        log.info("Finding all emails");
        return emailService.findAll(authentication);
    }

    @GetMapping("/{id}")
    public EmailResponse getById(@PathVariable Integer id, Authentication authentication) {
        log.info("Finding email by ID: {}", id);
        return emailService.getById(id, authentication);
    }

    @PostMapping("/add")
    public ResponseEntity<EmailResponse> addEmail(
            @Valid @RequestBody EmailRequest email, Authentication authentication) {
        log.info("Adding new email");
        return ResponseEntity.ok(emailService.create(email, authentication));
    }

    @PutMapping("/{folder}/{id}")
    public EmailResponse updateFolder(
            @PathVariable String folder, @PathVariable Integer id, Authentication authentication) {
        log.info("Updating email {} for folder: {}", id, folder);
        return emailService.updateFolder(folder, id, authentication);
    }

    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable Integer id, Authentication authentication) {
        log.info("Deleting email with ID: {}", id);
        emailService.deleteById(id, authentication);
    }

    @PostMapping("/drafts/save")
    public ResponseEntity<EmailResponse> saveDraft(
            @RequestBody EmailRequest email, Authentication authentication) {
        log.info("Saving draft");
        return ResponseEntity.ok(emailService.saveDraft(email, authentication));
    }

    @DeleteMapping("/drafts/delete/{id}")
    public ResponseEntity<String> deleteDraft(
            @PathVariable Integer id, Authentication authentication) {
        log.info("Deleting draft with ID: {}", id);
        emailService.deleteDraft(id, authentication);
        return ResponseEntity.ok("Draft deleted successfully.");
    }

    @PutMapping("/drafts/update/{id}")
    public ResponseEntity<EmailResponse> updateDraft(
            @PathVariable Integer id,
            @RequestBody EmailRequest updatedDraft,
            Authentication authentication) {
        log.info("Updating draft with ID: {}", id);
        return ResponseEntity.ok(emailService.updateDraft(id, updatedDraft, authentication));
    }
}
