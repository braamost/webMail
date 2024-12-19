package com.mail.back.REST.ContactControl;

import com.mail.back.entity.Contact;

import java.util.List;

public interface IContactControl {
    List<Contact> getContactsByUserId(int userId);
    Contact getContactById(int contactId);
    Contact addContact(Contact contact);
    void deleteContact(Contact contact);
}
