package com.mail.back.REST.ContactControl;

import com.mail.back.GlobalHandle.NotFoundException;
import com.mail.back.GlobalHandle.UnauthorizedException;
import com.mail.back.Service.ContactService.ContactService;
import com.mail.back.Service.UserService.UserService;
import com.mail.back.entity.Contact;
import com.mail.back.entity.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/contacts")
@Slf4j
public class ContactRestController implements IContactController {
    private final UserService userService;
    private final ContactService contactService;

    @Autowired
    public ContactRestController(UserService userService , ContactService contactService) {
        this.userService = userService;
        this.contactService = contactService;
    }

    @Override
    @GetMapping("/user/{userId}")
    public List<Contact> getContactsByUserId(@PathVariable int userId, Authentication authentication) {
        log.info("Checking user ID validity for retrieving contacts...");
        String usernameFromToken = (String) authentication.getPrincipal();
        User user = userService.findByUserName(usernameFromToken);
        if (userId <= 0 || !Objects.equals(user.getId(), userId)) {
            throw new IllegalArgumentException("Invalid user ID: " + userId);
        }
        log.info("adding....");
        return contactService.getContactsByUserId(userId);
    }

    @Override
    @GetMapping("/{contactId}")
    public Contact getContactById(@PathVariable int contactId) {
        log.info(" Checking contact ID validity...");
        if (contactId <= 0) {
            throw new IllegalArgumentException("Invalid contact ID: " + contactId);
        }
        log.info("Contact ID is valid. getting....");
        return contactService.getContactById(contactId);
    }

    @Override
    @PostMapping
    public Contact addContact(@RequestBody Contact contact, Authentication authentication) {
        log.info("Validating contact information before adding...");
        log.info(contact.getUser().toString());

        String usernameFromToken = (String) authentication.getPrincipal();
        User theUser = userService.findByUserName(usernameFromToken);
        if(!Objects.equals(theUser.getId(), contact.getUser().getId()))
            throw new UnauthorizedException("sbh y m3lm");

        // Validate the provided contact data
        if (contact.getContactEmail() == null || contact.getContactName() == null) {
            throw new IllegalArgumentException("Contact email and name must not be null.");
        }

        // Check if a user exists with the contact's email (if applicable)
        User user = userService.findByEmail(contact.getContactEmail());
        if (user == null) {
            throw new NotFoundException("no user available with this email");
        }

        // Check if the contact already exists
        Contact existingContact = contactService.findByContactEmail(contact.getContactEmail());

        if (existingContact == null) {
            log.info("Contact does not exist. Adding new contact...");
            return contactService.addContact(contact);
        } else {
            log.info("Contact already exists. Updating contact...");
            existingContact.setContactName(contact.getContactName());
            return contactService.addContact(existingContact);
        }
    }


    @Override
    @DeleteMapping("/{contactId}")
    public void deleteContact(@PathVariable int contactId) {
        log.info("Proxy: Checking contact validity before deletion...");

        if (contactId <= 0) {
            throw new IllegalArgumentException("Invalid contact for deletion: " + contactId);
        }
        log.info("Proxy: Contact is valid for deletion. Delegating to real controller.");
        contactService.deleteContact(contactId);
    }
}
