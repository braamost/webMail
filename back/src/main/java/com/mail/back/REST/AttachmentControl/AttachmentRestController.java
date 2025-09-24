package com.mail.back.REST.AttachmentControl;

import com.mail.back.GlobalHandle.NotFoundException;
import com.mail.back.GlobalHandle.UnauthorizedException;
import com.mail.back.entity.Attachment;
import com.mail.back.entity.User;
import com.mail.back.Service.AttachmentService.AttachmentService;
import com.mail.back.Service.UserService.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequestMapping("/api/attachments")
@Slf4j
public class AttachmentRestController implements IAttachmentController {

    private final AttachmentService attachmentService;
    private final UserService userService;

    @Autowired
    public AttachmentRestController(AttachmentService attachmentService, UserService userService) {
        this.attachmentService = attachmentService;
        this.userService = userService;
    }

    @Override
    @PostMapping("/upload")
    public ResponseEntity<List<Attachment>> uploadAttachments(@RequestParam("files") MultipartFile[] files, @RequestParam("emailId") Integer emailId, Authentication authentication) {
        log.info("Uploading {} attachments for email ID: {}", files.length, emailId);
        validateAuthentication(authentication);
        validateUploadRequest(files, emailId);
        
        List<Attachment> attachments = new ArrayList<>();
        try {
            for (MultipartFile file : files) {
                Attachment attachment = attachmentService.saveAttachment(file, emailId);
                attachments.add(attachment);
            }
            return new ResponseEntity<>(attachments, HttpStatus.CREATED);
        } catch (Exception e) {
            log.error("Failed to upload attachments for email ID: " + emailId, e);
            throw new RuntimeException("Failed to upload attachments", e);
        }
    }

    @Override
    @GetMapping("/{id}")
    public ResponseEntity<Attachment> getAttachment(@PathVariable Integer id, Authentication authentication) {
        log.info("Retrieving attachment with ID: {}", id);
        validateAuthentication(authentication);
        validateAttachmentId(id);
        Attachment attachment = attachmentService.getAttachmentById(id);
        return new ResponseEntity<>(attachment, HttpStatus.OK);
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

    private void validateUploadRequest(MultipartFile[] files, Integer emailId) {
        if (files == null || files.length == 0) {
            throw new IllegalArgumentException("No files provided for upload");
        }

        if (emailId == null || emailId <= 0) {
            throw new IllegalArgumentException("Invalid email ID");
        }

        // Validate each file
        for (MultipartFile file : files) {
            validateFile(file);
        }
    }

    private void validateFile(MultipartFile file) {
        // Validate file size (example: 10MB limit)
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new IllegalArgumentException("File size exceeds maximum limit of 10MB");
        }
    }

    private void validateAttachmentId(Integer id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Invalid attachment ID");
        }
        if(attachmentService.getAttachmentById(id) == null) {
            throw new NotFoundException("Attachment not found with ID: " + id);
        }
    }
}