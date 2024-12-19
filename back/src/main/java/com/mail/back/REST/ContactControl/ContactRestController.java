package com.mail.back.REST.ContactControl;



import com.mail.back.Service.ContactService.ContactService;
import com.mail.back.entity.Contact;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Component
public class ContactRestController implements IContactController {

    private final ContactService contactService;

    @Autowired
    public ContactRestController(ContactService contactService) {
        this.contactService = contactService;
    }

    @Override
    public List<Contact> getContactsByUserId(int userId) {
        return contactService.getContactsByUserId((int) userId);
    }

    @Override
    public Contact getContactById(int contactId) {
        return contactService.getContactById((int) contactId);
    }

    @Override
    public Contact addContact(Contact contact) {
        return contactService.addContact(contact);
    }

    @Override
    public void deleteContact(Contact contact) {
        contactService.deleteContact(contact.getId());
    }
}

