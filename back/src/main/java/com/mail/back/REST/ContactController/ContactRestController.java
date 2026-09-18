package com.mail.back.REST.ContactController;

import com.mail.back.DTO.ContactRequest;
import com.mail.back.DTO.ContactResponse;
import com.mail.back.Service.ContactService.ContactService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/contacts")
@Slf4j
public class ContactRestController {
    private final ContactService contactService;

    @Autowired
    public ContactRestController(ContactService contactService) {
        this.contactService = contactService;
    }

    @GetMapping("/user/{userId}")
    public List<ContactResponse> getContactsByUserId(
            @PathVariable int userId, Authentication authentication) {
        log.info("Retrieving contacts for user {}", userId);
        return contactService.getContactsByUserId(userId, authentication);
    }

    @GetMapping("/{contactId}")
    public ContactResponse getContactById(
            @PathVariable int contactId, Authentication authentication) {
        log.info("Retrieving contact {}", contactId);
        return contactService.getContactById(contactId, authentication);
    }

    @PostMapping
    public ContactResponse addContact(
            @Valid @RequestBody ContactRequest contact, Authentication authentication) {
        log.info("Adding contact {}", contact.getContactEmail());
        return contactService.addContact(contact, authentication);
    }

    @DeleteMapping("/{contactId}")
    public void deleteContact(@PathVariable int contactId, Authentication authentication) {
        log.info("Deleting contact {}", contactId);
        contactService.deleteContact(contactId, authentication);
    }
}
