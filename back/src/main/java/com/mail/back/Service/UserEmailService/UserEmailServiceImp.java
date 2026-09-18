package com.mail.back.Service.UserEmailService;

import com.mail.back.DAO.UserEmailRepository;
import com.mail.back.DTO.EmailResponse;
import com.mail.back.DTO.EntityMapper;
import com.mail.back.DTO.UserEmailRequest;
import com.mail.back.DTO.UserEmailResponse;
import com.mail.back.GlobalHandle.NotFoundException;
import com.mail.back.Service.EmailService.EmailService;
import com.mail.back.Service.UserService.UserService;
import com.mail.back.Service.Validation.ValidationService;
import com.mail.back.entity.Email;
import com.mail.back.entity.User;
import com.mail.back.entity.UserEmail;
import com.mail.back.entity.UserEmailID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static com.mail.back.entity.Email.Folder.DRAFT;

@Service
public class UserEmailServiceImp implements UserEmailService {

    private final UserEmailRepository userEmailRepository;
    private final UserService userService;
    private final EmailService emailService;
    private final ValidationService validationService;
    private final EntityMapper entityMapper;

    @Autowired
    public UserEmailServiceImp(
            UserEmailRepository userEmailRepository,
            UserService userService,
            @Lazy EmailService emailService,
            ValidationService validationService,
            EntityMapper entityMapper) {
        this.userEmailRepository = userEmailRepository;
        this.userService = userService;
        this.emailService = emailService;
        this.validationService = validationService;
        this.entityMapper = entityMapper;
    }

    @Override
    public List<UserEmailResponse> findAll(Authentication authentication) {
        User user = validationService.requireAuthenticatedUser(authentication);
        return entityMapper.toUserEmailResponses(
                userEmailRepository.findAllByParticipant(user.getId()));
    }

    @Override
    public UserEmailResponse findById(
            Integer senderId,
            Integer receiverId,
            Integer emailId,
            Authentication authentication) {
        User authenticated = validationService.requireAuthenticatedUser(authentication);
        validationService.validateUserEmailIds(senderId, receiverId, emailId);
        validationService.requireUserEmailAccess(authenticated, senderId, receiverId);
        return entityMapper.toUserEmailResponse(
                requireById(new UserEmailID(senderId, receiverId, emailId)));
    }

    @Override
    public UserEmailResponse save(UserEmailRequest request, Authentication authentication) {
        User authenticated = validationService.requireAuthenticatedUser(authentication);
        validationService.validateNewUserEmail(authenticated, request);

        UserEmailRequest.UserEmailIdDto idDto = request.getUserEmailID();
        UserEmailID id = new UserEmailID(idDto.getSenderId(), idDto.getReceiverId(), idDto.getEmailId());

        UserEmail userEmail = new UserEmail();
        userEmail.setUserEmailID(id);
        userEmail.setEmail(emailService.findById(id.getEmailId()));
        userEmail.setReceiver(userService.findById(id.getReceiverId()));
        userEmail.setSender(userService.findById(id.getSenderId()));

        return entityMapper.toUserEmailResponse(userEmailRepository.save(userEmail));
    }

    @Override
    public void deleteById(
            Integer senderId,
            Integer receiverId,
            Integer emailId,
            Authentication authentication) {
        User authenticated = validationService.requireAuthenticatedUser(authentication);
        validationService.validateUserEmailIds(senderId, receiverId, emailId);
        validationService.requireUserEmailAccess(authenticated, senderId, receiverId);
        validationService.requireExistingUserEmail(senderId, receiverId, emailId);
        userEmailRepository.deleteById(new UserEmailID(senderId, receiverId, emailId));
    }

    @Override
    public List<EmailResponse> getEmails(String folder, Integer userId, Authentication authentication) {
        User authenticated = validationService.requireAuthenticatedUser(authentication);
        validationService.validateMailboxRequest(authenticated, folder, userId);

        List<Email> emails;
        switch (folder.toUpperCase()) {
            case "INBOX":
                emails = getEmailsByReceiverAndFolder(userId, Email.Folder.GENERAL);
                break;
            case "SENT":
                emails = getEmailsBySenderAndFolder(userId, Email.Folder.GENERAL);
                break;
            case "STARRED":
                emails = getEmailsByStarred(userId);
                break;
            case "DRAFT":
                emails = getEmailsBySenderAndFolder(userId, DRAFT);
                break;
            default:
                Email.Folder theFolder = Email.Folder.valueOf(folder.toUpperCase());
                emails = getEmailsByReceiverAndFolder(userId, theFolder);
                emails.addAll(getEmailsBySenderAndFolder(userId, theFolder));
        }

        for (Email email : emails) {
            email.setAttachments(emailService.getAttachmentsForEmail(email.getId()));
        }
        return entityMapper.toEmailResponses(emails);
    }

    private UserEmail requireById(UserEmailID theId) {
        Optional<UserEmail> result = userEmailRepository.findById(theId);
        if (result.isPresent()) {
            return result.get();
        }
        throw new NotFoundException("Did not find UserEmail id - " + theId);
    }

    private List<Email> getEmailsByReceiverAndFolder(Integer receiverId, Email.Folder folder) {
        return mapToEmails(userEmailRepository.findByReceiverIdAndFolder(receiverId, folder));
    }

    private List<Email> getEmailsBySenderAndFolder(Integer senderId, Email.Folder folder) {
        return mapToEmails(userEmailRepository.findBySenderIdAndFolder(senderId, folder));
    }

    private List<Email> getEmailsByStarred(Integer userId) {
        return mapToEmails(userEmailRepository.findByStarred(userId));
    }

    private List<Email> mapToEmails(List<UserEmail> userEmails) {
        List<Email> emails = new ArrayList<>();
        for (UserEmail userEmail : userEmails) {
            Email email = userEmail.getEmail();
            email.setEmailOfReceiver(userEmail.getReceiver().getEmail());
            email.setUserNameOfReceiver(userEmail.getReceiver().getUserName());
            email.setEmailOfSender(userEmail.getSender().getEmail());
            email.setUserNameOfSender(userEmail.getSender().getUserName());
            emails.add(email);
        }
        return emails;
    }
}
