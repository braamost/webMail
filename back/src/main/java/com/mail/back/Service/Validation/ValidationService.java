package com.mail.back.Service.Validation;

import com.mail.back.DAO.AttachmentRepository;
import com.mail.back.DAO.ContactRepository;
import com.mail.back.DAO.EmailRepository;
import com.mail.back.DAO.UserEmailRepository;
import com.mail.back.DAO.UserRepository;
import com.mail.back.DTO.ContactRequest;
import com.mail.back.DTO.UserEmailRequest;
import com.mail.back.GlobalHandle.NotFoundException;
import com.mail.back.GlobalHandle.UnauthorizedException;
import com.mail.back.entity.Attachment;
import com.mail.back.entity.Contact;
import com.mail.back.entity.User;
import com.mail.back.entity.UserEmailID;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Service
public class ValidationService {

    private static final long MAX_FILE_SIZE_BYTES = 10L * 1024 * 1024;

    private static final Set<String> EMAIL_FOLDER_ACTIONS = new HashSet<>(Arrays.asList(
            "starred", "read", "spam", "trash", "archive", "open"
    ));

    private static final Set<String> MAILBOX_FOLDERS = new HashSet<>(Arrays.asList(
            "INBOX", "SENT", "STARRED", "SPAM", "TRASH", "ARCHIVE", "DRAFT"
    ));

    private final UserRepository userRepository;
    private final EmailRepository emailRepository;
    private final AttachmentRepository attachmentRepository;
    private final UserEmailRepository userEmailRepository;
    private final ContactRepository contactRepository;
    private final PasswordEncoder passwordEncoder;

    public ValidationService(
            UserRepository userRepository,
            EmailRepository emailRepository,
            AttachmentRepository attachmentRepository,
            UserEmailRepository userEmailRepository,
            ContactRepository contactRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.emailRepository = emailRepository;
        this.attachmentRepository = attachmentRepository;
        this.userEmailRepository = userEmailRepository;
        this.contactRepository = contactRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User requireAuthenticatedUser(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            throw new UnauthorizedException("Authentication required");
        }
        String username = (String) authentication.getPrincipal();
        User user = userRepository.findByUserName(username);
        if (user == null) {
            throw new UnauthorizedException("Invalid user");
        }
        return user;
    }

    public void requireOwnership(User authenticatedUser, Integer resourceOwnerId, String message) {
        if (!Objects.equals(authenticatedUser.getId(), resourceOwnerId)) {
            throw new UnauthorizedException(message);
        }
    }

    public void validatePositiveId(Integer id, String fieldName) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Invalid " + fieldName);
        }
    }

    public User requireExistingUsername(String username) {
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("Username cannot be empty");
        }
        User user = userRepository.findByUserName(username);
        if (user == null) {
            throw new NotFoundException("User not found");
        }
        return user;
    }

    public User requireExistingEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be empty");
        }
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new NotFoundException("User not found");
        }
        return user;
    }

    public User requireExistingUserId(Integer id) {
        validatePositiveId(id, "user ID");
        return userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User with ID " + id + " not found."));
    }

    public void validateOldPassword(User user, String oldPassword) {
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new UnauthorizedException("Invalid oldPassword");
        }
    }

    public void requireExistingEmailId(Integer id) {
        validatePositiveId(id, "email ID");
        if (!emailRepository.existsById(id)) {
            throw new NotFoundException("Email not found with ID: " + id);
        }
    }

    /**
     * Allows access when the user is a sender/receiver, or when the email is still
     * being composed (no UserEmail links yet).
     */
    public void requireEmailAccess(User user, Integer emailId) {
        requireExistingEmailId(emailId);
        if (userEmailRepository.isParticipant(emailId, user.getId())) {
            return;
        }
        if (!userEmailRepository.existsByEmail_Id(emailId)) {
            return;
        }
        throw new UnauthorizedException("You are not authorized to access this email");
    }

    public void requireEmailParticipant(User user, Integer emailId) {
        requireExistingEmailId(emailId);
        if (!userEmailRepository.isParticipant(emailId, user.getId())) {
            throw new UnauthorizedException("You are not authorized to access this email");
        }
    }

    public void requireAttachmentAccess(User user, Integer attachmentId) {
        Attachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new NotFoundException("Attachment not found with ID: " + attachmentId));
        requireEmailAccess(user, attachment.getEmail().getId());
    }

    public void validateFolderAction(String folder, Integer id) {
        requireExistingEmailId(id);
        if (folder == null || !EMAIL_FOLDER_ACTIONS.contains(folder.toLowerCase())) {
            throw new IllegalArgumentException("Invalid folder: " + folder);
        }
    }

    public void validateUploadRequest(MultipartFile[] files, Integer emailId) {
        if (files == null || files.length == 0) {
            throw new IllegalArgumentException("No files provided for upload");
        }
        requireExistingEmailId(emailId);
        for (MultipartFile file : files) {
            validateFile(file);
        }
    }

    public void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }
        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new IllegalArgumentException("File size exceeds maximum limit of 10MB");
        }
    }

    public void requireExistingAttachmentId(Integer id) {
        validatePositiveId(id, "attachment ID");
        if (!attachmentRepository.existsById(id)) {
            throw new NotFoundException("Attachment not found with ID: " + id);
        }
    }

    public void validateContactBusinessRules(ContactRequest contact) {
        if (userRepository.findByEmail(contact.getContactEmail()) == null) {
            throw new NotFoundException("no user available with this email");
        }
    }

    public Contact requireOwnedContact(User authenticated, int contactId) {
        validatePositiveId(contactId, "contact ID");
        Contact contact = contactRepository.findById(contactId)
                .orElseThrow(() -> new NotFoundException("Contact not found with ID: " + contactId));
        requireOwnership(
                authenticated,
                contact.getUser().getId(),
                "You are not authorized to access this contact");
        return contact;
    }

    public void validateUserEmailIds(Integer senderId, Integer receiverId, Integer emailId) {
        validatePositiveId(senderId, "sender ID");
        validatePositiveId(receiverId, "receiver ID");
        validatePositiveId(emailId, "email ID");
        requireExistingUserId(senderId);
        requireExistingUserId(receiverId);
        requireExistingEmailId(emailId);
    }

    public void validateNewUserEmail(User authenticated, UserEmailRequest request) {
        UserEmailRequest.UserEmailIdDto id = request.getUserEmailID();
        validateUserEmailIds(id.getSenderId(), id.getReceiverId(), id.getEmailId());
        if (!Objects.equals(authenticated.getId(), id.getSenderId())
                && !Objects.equals(authenticated.getId(), id.getReceiverId())) {
            throw new UnauthorizedException("You are not authorized to create this user-email link");
        }
    }

    public void requireExistingUserEmail(Integer senderId, Integer receiverId, Integer emailId) {
        UserEmailID userEmailID = new UserEmailID(senderId, receiverId, emailId);
        if (!userEmailRepository.existsById(userEmailID)) {
            throw new NotFoundException(
                    String.format(
                            "UserEmail with senderId %d, receiverId %d and emailId %d not found",
                            senderId, receiverId, emailId));
        }
    }

    public void requireUserEmailAccess(User authenticated, Integer senderId, Integer receiverId) {
        if (!Objects.equals(authenticated.getId(), senderId)
                && !Objects.equals(authenticated.getId(), receiverId)) {
            throw new UnauthorizedException("You are not authorized to access this user-email link");
        }
    }

    public void validateMailboxRequest(User authenticated, String folder, Integer userId) {
        requireExistingUserId(userId);
        requireOwnership(authenticated, userId, "You are not authorized to access this mailbox");
        if (folder == null || !MAILBOX_FOLDERS.contains(folder.toUpperCase())) {
            throw new IllegalArgumentException("Invalid folder: " + folder);
        }
    }
}
