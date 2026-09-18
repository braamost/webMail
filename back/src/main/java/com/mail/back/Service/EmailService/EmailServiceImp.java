package com.mail.back.Service.EmailService;

import com.mail.back.DAO.EmailRepository;
import com.mail.back.DAO.UserEmailRepository;
import com.mail.back.DTO.EmailRequest;
import com.mail.back.DTO.EmailResponse;
import com.mail.back.DTO.EntityMapper;
import com.mail.back.GlobalHandle.NotFoundException;
import com.mail.back.Service.Validation.ValidationService;
import com.mail.back.entity.Attachment;
import com.mail.back.entity.Email;
import com.mail.back.entity.User;
import com.mail.back.entity.UserEmail;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EmailServiceImp implements EmailService {
    private final EmailRepository emailRepository;
    private final UserEmailRepository userEmailRepository;
    private final ValidationService validationService;
    private final EntityMapper entityMapper;

    @Autowired
    public EmailServiceImp(
            EmailRepository emailRepository,
            UserEmailRepository userEmailRepository,
            ValidationService validationService,
            EntityMapper entityMapper) {
        this.emailRepository = emailRepository;
        this.userEmailRepository = userEmailRepository;
        this.validationService = validationService;
        this.entityMapper = entityMapper;
    }

    @SuppressWarnings("null")
    @Override
    public List<EmailResponse> findAll(Authentication authentication) {
        User user = validationService.requireAuthenticatedUser(authentication);
        List<Email> emails = userEmailRepository.findAllByParticipant(user.getId()).stream()
                .map(UserEmail::getEmail)
                .distinct()
                .collect(Collectors.toList());
        return entityMapper.toEmailResponses(emails);
    }

    @Override
    public EmailResponse getById(Integer id, Authentication authentication) {
        User user = validationService.requireAuthenticatedUser(authentication);
        validationService.requireEmailAccess(user, id);
        return entityMapper.toEmailResponse(findById(id));
    }

    @Override
    public Email findById(Integer theId) {
        Optional<Email> result = emailRepository.findById(theId);
        if (result.isPresent()) {
            return result.get();
        }
        throw new NotFoundException("Email with id " + theId + " not found.");
    }

    @Override
    public EmailResponse create(EmailRequest request, Authentication authentication) {
        validationService.requireAuthenticatedUser(authentication);
        Email email = entityMapper.toEmail(request);
        email.setId(null);
        return entityMapper.toEmailResponse(emailRepository.save(email));
    }

    @Override
    public EmailResponse updateFolder(String folder, Integer id, Authentication authentication) {
        User user = validationService.requireAuthenticatedUser(authentication);
        validationService.validateFolderAction(folder, id);
        validationService.requireEmailParticipant(user, id);
        Email email = findById(id);

        switch (folder.toLowerCase()) {
            case "starred":
                email.setStarred(!email.isStarred());
                break;
            case "read":
                email.setRead(!email.isRead());
                break;
            case "open":
                email.setRead(true);
                break;
            case "spam":
                email.setFolder(email.getFolder().equals(Email.Folder.SPAM)
                        ? Email.Folder.GENERAL
                        : Email.Folder.SPAM);
                break;
            case "trash":
                email.setFolder(email.getFolder().equals(Email.Folder.TRASH)
                        ? Email.Folder.GENERAL
                        : Email.Folder.TRASH);
                break;
            case "archive":
                email.setFolder(email.getFolder().equals(Email.Folder.ARCHIVE)
                        ? Email.Folder.GENERAL
                        : Email.Folder.ARCHIVE);
                break;
            default:
                throw new IllegalArgumentException("Invalid folder: " + folder);
        }

        return entityMapper.toEmailResponse(emailRepository.save(email));
    }

    @Override
    public void deleteById(Integer theId, Authentication authentication) {
        User user = validationService.requireAuthenticatedUser(authentication);
        validationService.requireEmailAccess(user, theId);
        emailRepository.deleteById(theId);
    }

    @Override
    public List<Attachment> getAttachmentsForEmail(Integer emailId) {
        return emailRepository.findAttachmentsByEmailId(emailId);
    }

    @Override
    public EmailResponse saveDraft(EmailRequest request, Authentication authentication) {
        validationService.requireAuthenticatedUser(authentication);
        Email email = entityMapper.toEmail(request);
        email.setFolder(Email.Folder.DRAFT);
        email.setEmailDirection(Email.EmailDirection.DRAFT);
        return entityMapper.toEmailResponse(emailRepository.save(email));
    }

    @Override
    public EmailResponse updateDraft(Integer id, EmailRequest request, Authentication authentication) {
        User user = validationService.requireAuthenticatedUser(authentication);
        validationService.requireEmailAccess(user, id);
        Email email = entityMapper.toEmail(request);
        email.setId(id);
        email.setFolder(Email.Folder.DRAFT);
        email.setEmailDirection(Email.EmailDirection.SENT);
        return entityMapper.toEmailResponse(emailRepository.save(email));
    }

    @Override
    public void deleteDraft(Integer id, Authentication authentication) {
        User user = validationService.requireAuthenticatedUser(authentication);
        validationService.requireEmailAccess(user, id);
        emailRepository.deleteById(id);
    }
}
