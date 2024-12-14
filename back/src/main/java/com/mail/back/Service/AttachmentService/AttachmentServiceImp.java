package com.mail.back.Service.AttachmentService;



import com.mail.back.entity.Attachment;
import com.mail.back.entity.Email;
import com.mail.back.DAO.AttachmentRepository;
import com.mail.back.DAO.EmailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class AttachmentServiceImp implements AttachmentService{

    @Autowired
    private AttachmentRepository attachmentRepository;

    @Autowired
    private EmailRepository emailRepository;

    // Method to save an attachment
    public Attachment saveAttachment(MultipartFile file, Integer emailId) throws IOException {
        // Find the associated Email by emailId
        Email email = emailRepository.findById(emailId)
                .orElseThrow(() -> new RuntimeException("Email not found"));

        // Create a new Attachment and set its properties
        Attachment attachment = new Attachment();
        attachment.setFileName(file.getOriginalFilename());
        attachment.setFileType(file.getContentType());
        attachment.setFileContent(file.getBytes());

        // Set the associated email to the attachment
        attachment.setEmail(email);

        // Save the attachment to the database
        return attachmentRepository.save(attachment);
    }

    // Method to retrieve an attachment by its ID
    public Attachment getAttachmentById(Integer id) {
        return attachmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attachment not found"));
    }
}
