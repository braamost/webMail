package com.mail.back.REST.ContactControl;

import com.mail.back.entity.Contact;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface IContactController {
    List<Contact> getContactsByUserId(int userId, Authentication authentication);
    Contact getContactById(int contactId);
    Contact addContact(Contact contact, Authentication authentication);
    void deleteContact(int contactId);
}
