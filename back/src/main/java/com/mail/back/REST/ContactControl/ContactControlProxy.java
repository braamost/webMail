package com.mail.back.REST.ContactControl;

import com.mail.back.Service.ContactService.ContactService;
import com.mail.back.Service.UserService.UserService;
import com.mail.back.entity.Contact;
import com.mail.back.entity.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequestMapping("/api/contacts")
public class ContactControlProxy implements IContactController {
    private final IContactController realController;
    private final UserService userService;
    private final ContactService contactService;
    private final Logger logger = LoggerFactory.getLogger(ContactControlProxy.class);

    @Autowired
    public ContactControlProxy(ContactRestController realController , UserService userService , ContactService contactService) {
        this.realController = realController;
        this.userService = userService;
        this.contactService = contactService;
    }

    @Override
    @GetMapping("/user/{userId}")
    public List<Contact> getContactsByUserId(@PathVariable int userId) {
        logger.info("Proxy: Checking user ID validity for retrieving contacts...");
        if (userId <= 0) {
            throw new IllegalArgumentException("Invalid user ID: " + userId);
        }
        logger.info("Proxy: User ID is valid. Delegating to real controller.");
        return realController.getContactsByUserId(userId);
    }

    @Override
    @GetMapping("/{contactId}")
    public Contact getContactById(@PathVariable int contactId) {
        logger.info("Proxy: Checking contact ID validity...");
        if (contactId <= 0) {
            throw new IllegalArgumentException("Invalid contact ID: " + contactId);
        }
        logger.info("Proxy: Contact ID is valid. Delegating to real controller.");
        return realController.getContactById(contactId);
    }

    @Override
    @PostMapping
    public Contact addContact(@RequestBody Contact contact) {
        logger.info("Proxy: Validating contact information before adding...");

        // Validate the provided contact data
        if (contact.getContactEmail() == null || contact.getContactName() == null) {
            throw new IllegalArgumentException("Contact email and name must not be null.");
        }

        // Check if a user exists with the contact's email (if applicable)
        User user = userService.findByEmail(contact.getContactEmail());
        if (user == null) {
            return null;
        }

        // Check if the contact already exists
        Contact existingContact = contactService.findByContactEmail(contact.getContactEmail());

        if (existingContact == null) {
            logger.info("Contact does not exist. Adding new contact...");
            return contactService.addContact(contact);
        } else {
            logger.info("Contact already exists. Updating contact...");
            existingContact.setContactName(contact.getContactName());
            return contactService.addContact(existingContact);
        }
    }


    @Override
    @DeleteMapping
    public void deleteContact(@RequestBody Contact contact) {
        logger.info("Proxy: Checking contact validity before deletion...");
        if (contact == null || contact.getId() <= 0) {
            throw new IllegalArgumentException("Invalid contact for deletion: " + contact);
        }
        logger.info("Proxy: Contact is valid for deletion. Delegating to real controller.");
        realController.deleteContact(contact);
    }
}
