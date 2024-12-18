package com.mail.back.REST.AttachmentControl;

import com.mail.back.entity.Attachment;
import com.mail.back.Service.AttachmentService.AttachmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Component
public class AttachmentRestController implements IAttachmentController {

    private final AttachmentService attachmentService;

    @Autowired
    public AttachmentRestController(AttachmentService attachmentService) {
        this.attachmentService = attachmentService;
    }

    @Override
    public ResponseEntity<List<Attachment>> uploadAttachments(MultipartFile[] files, Integer emailId) {
        List<Attachment> attachments = new ArrayList<>();

        try {
            for (MultipartFile file : files) {
                Attachment attachment = attachmentService.saveAttachment(file, emailId);
                attachments.add(attachment);
            }
            return new ResponseEntity<>(attachments, HttpStatus.CREATED);
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload attachments", e);
        }
    }

    @Override
    public ResponseEntity<Attachment> getAttachment(Integer id) {
        Attachment attachment = attachmentService.getAttachmentById(id);
        return new ResponseEntity<>(attachment, HttpStatus.OK);
    }
}