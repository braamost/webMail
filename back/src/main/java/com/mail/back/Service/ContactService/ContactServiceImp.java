package com.mail.back.Service.ContactService;

import com.mail.back.DAO.ContactRepository;
import com.mail.back.DTO.ContactRequest;
import com.mail.back.DTO.ContactResponse;
import com.mail.back.DTO.EntityMapper;
import com.mail.back.Service.UserService.UserService;
import com.mail.back.Service.Validation.ValidationService;
import com.mail.back.entity.Contact;
import com.mail.back.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContactServiceImp implements ContactService {

    private final ContactRepository contactRepository;
    private final UserService userService;
    private final ValidationService validationService;
    private final EntityMapper entityMapper;

    @Autowired
    public ContactServiceImp(
            ContactRepository contactRepository,
            UserService userService,
            ValidationService validationService,
            EntityMapper entityMapper) {
        this.contactRepository = contactRepository;
        this.userService = userService;
        this.validationService = validationService;
        this.entityMapper = entityMapper;
    }

    @Override
    public ContactResponse addContact(ContactRequest request, Authentication authentication) {
        User authenticated = validationService.requireAuthenticatedUser(authentication);
        validationService.validateContactBusinessRules(request);
        validationService.requireOwnership(
                authenticated,
                request.getUser().getId(),
                "You are not authorized to add contacts for this user");

        int ownerId = request.getUser().getId();
        Contact existingContact =
                contactRepository.findByUserIdAndContactEmail(ownerId, request.getContactEmail());
        if (existingContact == null) {
            User owner = userService.findById(ownerId);
            Contact contact = new Contact(owner, request.getContactName(), request.getContactEmail());
            return entityMapper.toContactResponse(contactRepository.save(contact));
        }

        existingContact.setContactName(request.getContactName());
        return entityMapper.toContactResponse(contactRepository.save(existingContact));
    }

    @Override
    public void deleteContact(int contactId, Authentication authentication) {
        User authenticated = validationService.requireAuthenticatedUser(authentication);
        validationService.requireOwnedContact(authenticated, contactId);
        contactRepository.deleteById(contactId);
    }

    @Override
    public ContactResponse getContactById(int contactId, Authentication authentication) {
        User authenticated = validationService.requireAuthenticatedUser(authentication);
        return entityMapper.toContactResponse(
                validationService.requireOwnedContact(authenticated, contactId));
    }

    @Override
    public List<ContactResponse> getContactsByUserId(int userId, Authentication authentication) {
        User authenticated = validationService.requireAuthenticatedUser(authentication);
        validationService.requireOwnership(authenticated, userId, "Invalid user ID: " + userId);
        return entityMapper.toContactResponses(contactRepository.findByUserId(userId));
    }
}
