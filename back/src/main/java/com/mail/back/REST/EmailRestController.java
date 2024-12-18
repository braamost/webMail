package com.mail.back.REST;

import com.mail.back.GlobalHandle.NotFoundException;
import com.mail.back.Service.EmailService.EmailService;
import com.mail.back.entity.Email;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/emails")
public class EmailRestController {

    private final EmailService emailService;

    @Autowired
    public EmailRestController(EmailService emailService) {
        this.emailService = emailService;
    }

    // Fetch all emails
    @GetMapping
    public List<Email> findAll() {
        return emailService.findAll();
    }

    // Fetch email by ID
    @GetMapping("/{id}")
    public Email getById(@PathVariable Integer id) {
        return emailService.findById(id);
    }

    // Add a new email
    @PostMapping("/add")
    public Email addEmail(@RequestBody Email email) {
        System.out.println(email);
        email.setId(null); // Ensure the ID is 0 for creating a new entity
        return emailService.save(email);
    }

    // Update the starred status of an email
    @PutMapping("/{folder}/{id}")
    public Email updateStarred(@PathVariable String folder, @PathVariable Integer id) {
        Email email = emailService.findById(id);
        if (email == null) {
            throw new NotFoundException("Email with id " + id + " not found.");
        }
        Email.Folder activeFolder = email.getFolder();
        switch (folder) {
            case "starred":
                email.setStarred(!email.isStarred());
                break;
            case "read":
                email.setRead(!email.isRead());
                break;
            case "spam":
                if(activeFolder.equals(Email.Folder.SPAM)) email.setFolder(Email.Folder.GENERAL);
                else email.setFolder(Email.Folder.SPAM);
                break;
            case "trash":
                if(activeFolder.equals(Email.Folder.TRASH)) email.setFolder(Email.Folder.GENERAL);
                else email.setFolder(Email.Folder.TRASH);
                break;
            case "archive":
                if(activeFolder.equals(Email.Folder.ARCHIVE)) email.setFolder(Email.Folder.GENERAL);
                else email.setFolder(Email.Folder.ARCHIVE);
                break;
            default:
                throw new IllegalArgumentException("Invalid folder: " + folder);
        }

        return emailService.save(email);
    }

    // Delete an email by ID
    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable Integer id) {
        Email existingEmail = emailService.findById(id);
        if (existingEmail == null) {
            throw new NotFoundException("Email with id " + id + " not found.");
        }
        emailService.deleteById(id);
    }
}