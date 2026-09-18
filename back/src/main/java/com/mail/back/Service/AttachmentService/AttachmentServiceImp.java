package com.mail.back.Service.AttachmentService;

import com.mail.back.DAO.AttachmentRepository;
import com.mail.back.DAO.EmailRepository;
import com.mail.back.DTO.AttachmentResponse;
import com.mail.back.DTO.EntityMapper;
import com.mail.back.GlobalHandle.NotFoundException;
import com.mail.back.Service.Validation.ValidationService;
import com.mail.back.Storage.ObjectService;
import com.mail.back.entity.Attachment;
import com.mail.back.entity.Email;
import com.mail.back.entity.User;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
public class AttachmentServiceImp implements AttachmentService {

    private final AttachmentRepository attachmentRepository;
    private final EmailRepository emailRepository;
    private final ObjectService objectService;
    private final ValidationService validationService;
    private final EntityMapper entityMapper;

    public AttachmentServiceImp(
            AttachmentRepository attachmentRepository,
            EmailRepository emailRepository,
            ObjectService objectService,
            ValidationService validationService,
            EntityMapper entityMapper) {
        this.attachmentRepository = attachmentRepository;
        this.emailRepository = emailRepository;
        this.objectService = objectService;
        this.validationService = validationService;
        this.entityMapper = entityMapper;
    }

    @Override
    public List<AttachmentResponse> uploadAttachments(
            MultipartFile[] files, Integer emailId, Authentication authentication) {
        User user = validationService.requireAuthenticatedUser(authentication);
        validationService.validateUploadRequest(files, emailId);
        validationService.requireEmailAccess(user, emailId);

        List<Attachment> attachments = new ArrayList<>();
        try {
            for (MultipartFile file : files) {
                attachments.add(saveAttachment(file, emailId));
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload attachments", e);
        }
        return entityMapper.toAttachmentResponses(attachments);
    }

    private Attachment saveAttachment(MultipartFile file, Integer emailId) {
        Email email = emailRepository.findById(emailId)
                .orElseThrow(() -> new NotFoundException("Email not found"));

        Attachment attachment = new Attachment();
        attachment.setFileType(file.getContentType());
        String storedPath = objectService.save(file, "attachments");
        attachment.setFilePath(storedPath);
        attachment.setFileName(storedPath.substring(storedPath.lastIndexOf('/') + 1));
        attachment.setEmail(email);
        return attachmentRepository.save(attachment);
    }

    @Override
    public AttachmentResponse getAttachment(Integer id, Authentication authentication) {
        User user = validationService.requireAuthenticatedUser(authentication);
        validationService.requireAttachmentAccess(user, id);
        return entityMapper.toAttachmentResponse(getAttachmentById(id));
    }

    @Override
    public Attachment getAttachmentById(Integer id) {
        return attachmentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Attachment not found"));
    }

    @Override
    public AttachmentDownload prepareDownload(Integer id, Authentication authentication) {
        User user = validationService.requireAuthenticatedUser(authentication);
        validationService.requireAttachmentAccess(user, id);
        Attachment attachment = getAttachmentById(id);
        return new AttachmentDownload(
                attachment.getFileName(),
                attachment.getFileType(),
                objectService.open(attachment.getFilePath()));
    }
}
