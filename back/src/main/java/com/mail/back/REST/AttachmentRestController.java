package com.mail.back.REST;

import com.mail.back.entity.Attachment;
import com.mail.back.Service.AttachmentService.AttachmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/attachments")
public class AttachmentRestController {

    @Autowired
    private AttachmentService attachmentService;

    // Endpoint to upload multiple attachments
    @PostMapping("/upload")
    public ResponseEntity<List<Attachment>> uploadAttachments(@RequestParam("files") MultipartFile[] files,
                                                              @RequestParam("emailId") Integer emailId) {
        List<Attachment> attachments = new ArrayList<>();

        try {
            for (MultipartFile file : files) {
                // Save each attachment and add it to the list
                Attachment attachment = attachmentService.saveAttachment(file, emailId);
                attachments.add(attachment);
            }

            // Return the list of saved attachments
            return new ResponseEntity<>(attachments, HttpStatus.CREATED);
        } catch (IOException e) {
            // Handle errors during file upload
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Endpoint to retrieve an attachment by ID
    @GetMapping("/{id}")
    public ResponseEntity<Attachment> getAttachment(@PathVariable Integer id) {
        try {
            Attachment attachment = attachmentService.getAttachmentById(id);
            return new ResponseEntity<>(attachment, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }
}
