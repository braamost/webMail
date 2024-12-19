package com.mail.back.Service.ContactService;

import com.mail.back.entity.Contact;
import com.mail.back.entity.User;

import java.util.List;

public interface ContactService {
    public Contact addContact(Contact contact);
    public void deleteContact(int contactId);
    public Contact getContactById(int contactId);
    public List<Contact> getContactsByUserId(int userId);

    Contact findByContactEmail(String contactEmail);
}
