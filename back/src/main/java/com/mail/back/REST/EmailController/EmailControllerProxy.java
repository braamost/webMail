package com.mail.back.REST.EmailController;

import com.mail.back.GlobalHandle.NotFoundException;
import com.mail.back.Service.EmailService.EmailService;
import com.mail.back.entity.Email;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/emails")
public class EmailControllerProxy implements IEmailController {
    private final IEmailController realController;
    private final EmailService emailService;
    private final Logger logger = LoggerFactory.getLogger(EmailControllerProxy.class);

    public EmailControllerProxy(EmailRestController realController, EmailService emailService) {
        this.realController = realController;
        this.emailService = emailService;
    }

    @Override
    @GetMapping
    public List<Email> findAll() {
        logger.info("Proxy: Retrieving all emails");
        try {
            return realController.findAll();
        } catch (Exception e) {
            logger.error("Error retrieving all emails", e);
            throw e;
        }
    }

    @Override
    @GetMapping("/{id}")
    public Email getById(@PathVariable Integer id) {
        logger.info("Proxy: Retrieving email with ID: {}", id);
        try {
            validateId(id);
            return realController.getById(id);
        } catch (Exception e) {
            logger.error("Error retrieving email with ID: " + id, e);
            throw e;
        }
    }

    @Override
    @PostMapping("/add")
    public Email addEmail(@RequestBody Email email) {
        logger.info("Proxy: Adding new email");
        try {
            validateNewEmail(email);
            return realController.addEmail(email);
        } catch (Exception e) {
            logger.error("Error adding new email", e);
            throw e;
        }
    }

    @Override
    @PutMapping("/{folder}/{id}")
    public Email updateFolder(@PathVariable String folder, @PathVariable Integer id) {
        logger.info("Proxy: Updating email {} for folder: {}", id, folder);
        try {
            validateFolderUpdate(folder, id);
            return realController.updateFolder(folder, id);
        } catch (Exception e) {
            logger.error("Error updating email folder status", e);
            throw e;
        }
    }

    @Override
    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable Integer id) {
        logger.info("Proxy: Deleting email with ID: {}", id);
        try {
            validateId(id);
            realController.deleteById(id);
        } catch (Exception e) {
            logger.error("Error deleting email with ID: " + id, e);
            throw e;
        }
    }

    // Private validation methods
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
                "starred", "read", "spam", "trash", "archive"
        ));

        if (!validFolders.contains(folder.toLowerCase())) {
            throw new IllegalArgumentException("Invalid folder: " + folder);
        }
    }
}
