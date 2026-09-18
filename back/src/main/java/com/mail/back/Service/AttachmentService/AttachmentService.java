package com.mail.back.Service.AttachmentService;

import com.mail.back.DTO.AttachmentResponse;
import com.mail.back.Storage.ObjectService.StoredObject;
import com.mail.back.entity.Attachment;
import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface AttachmentService {
    List<AttachmentResponse> uploadAttachments(
            MultipartFile[] files, Integer emailId, Authentication authentication);

    AttachmentResponse getAttachment(Integer id, Authentication authentication);

    Attachment getAttachmentById(Integer id);

    AttachmentDownload prepareDownload(Integer id, Authentication authentication);

    record AttachmentDownload(String fileName, String fileType, StoredObject storedObject) {}
}
