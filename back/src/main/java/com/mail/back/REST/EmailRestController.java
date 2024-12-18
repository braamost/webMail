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
    @PutMapping("/starred/{id}")
    public Email updateStarred(@PathVariable Integer id) {
        Email email = emailService.findById(id);
        if (email == null) {
            throw new NotFoundException("Email with id " + id + " not found.");
        }
        email.setStarred(!email.isStarred());
        return emailService.save(email);
    }

    // Move an email to the trash
    @PutMapping("/trash/{id}")
    public Email moveToTrash(@PathVariable Integer id) {
        Email email = emailService.findById(id);
        if (email == null) {
            throw new NotFoundException("Email with id " + id + " not found.");
        }
        email.setFolder(Email.Folder.TRASH);
        return emailService.save(email);
    }

    // Move an email to the archive
    @PutMapping("/archive/{id}")
    public Email moveToArchive(@PathVariable Integer id) {
        Email email = emailService.findById(id);
        if (email == null) {
            throw new NotFoundException("Email with id " + id + " not found.");
        }
        email.setFolder(Email.Folder.ARCHIVE);
        return emailService.save(email);
    }

    // Move an email to the spam
    @PutMapping("/spam/{id}")
    public Email moveToSpam(@PathVariable Integer id) {
        Email email = emailService.findById(id);
        if (email == null) {
            throw new NotFoundException("Email with id " + id + " not found.");
        }
        email.setFolder(Email.Folder.SPAM);
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