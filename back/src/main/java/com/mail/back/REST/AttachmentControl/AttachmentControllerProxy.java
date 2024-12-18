package com.mail.back.REST.AttachmentControl;

import com.mail.back.GlobalHandle.NotFoundException;
import com.mail.back.Service.AttachmentService.AttachmentService;
import com.mail.back.Service.EmailService.EmailService;
import com.mail.back.entity.Attachment;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/attachments")
public class AttachmentControllerProxy implements IAttachmentController {
    private final IAttachmentController realController;
    private final AttachmentService attachmentService;
    private final EmailService emailService;
    private final Logger logger = LoggerFactory.getLogger(AttachmentControllerProxy.class);

    public AttachmentControllerProxy(AttachmentRestController realController, AttachmentService attachmentService, EmailService emailService) {
        this.realController = realController;
        this.attachmentService = attachmentService;
        this.emailService = emailService;
    }

    @Override
    @PostMapping("/upload")
    public ResponseEntity<List<Attachment>> uploadAttachments(
            @RequestParam("files") MultipartFile[] files,
            @RequestParam("emailId") Integer emailId) {
        logger.info("Proxy: Uploading {} attachments for email ID: {}", files.length, emailId);

        try {
            validateUploadRequest(files, emailId);
            return realController.uploadAttachments(files, emailId);
        } catch (Exception e) {
            logger.error("Error uploading attachments for email ID: " + emailId, e);
            throw e;
        }
    }

    @Override
    @GetMapping("/{id}")
    public ResponseEntity<Attachment> getAttachment(@PathVariable Integer id) {
        logger.info("Proxy: Retrieving attachment with ID: {}", id);
        try {
            validateAttachmentId(id);
            return realController.getAttachment(id);
        } catch (Exception e) {
            logger.error("Error retrieving attachment with ID: " + id, e);
            throw e;
        }
    }

    // Private validation methods
    private void validateUploadRequest(MultipartFile[] files, Integer emailId) {
        if (files == null || files.length == 0) {
            throw new IllegalArgumentException("No files provided for upload");
        }

        if (emailId == null || emailId <= 0) {
            throw new IllegalArgumentException("Invalid email ID");
        }

        if (emailService.findById(emailId) == null) {
            throw new NotFoundException("Email not found with ID: " + emailId);
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