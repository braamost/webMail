package com.mail.back.REST.AttachmentControl;

import com.mail.back.entity.Attachment;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IAttachmentController {
    ResponseEntity<List<Attachment>> uploadAttachments(MultipartFile[] files, Integer emailId);
    ResponseEntity<Attachment> getAttachment(Integer id);
}