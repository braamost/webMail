package com.mail.back.Service.AttachmentService;

import com.mail.back.entity.Attachment;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface AttachmentService {
    public Attachment saveAttachment(MultipartFile file, Integer emailId) throws IOException;
    public Attachment getAttachmentById(Integer id);
}
