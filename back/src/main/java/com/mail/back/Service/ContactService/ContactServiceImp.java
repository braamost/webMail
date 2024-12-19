package com.mail.back.Service.ContactService;

import com.mail.back.DAO.ContactRepository;
import com.mail.back.entity.Contact;
import com.mail.back.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContactServiceImp implements ContactService {

    @Autowired
    private ContactRepository contactRepository;

    // Get all contacts for a user


    // Add a new contact
    public Contact addContact(Contact contact) {
        return contactRepository.save(contact);
    }

    // Delete a contact
    public void deleteContact(int contactId) {
        contactRepository.deleteById(contactId);
    }

    // Get a contact by ID
    public Contact getContactById(int contactId) {
        return contactRepository.findById(contactId).orElse(null);
    }

    public List<Contact> getContactsByUserId(int userId) {
        return contactRepository.findByUserId(userId);
    }

    @Override
    public Contact findByContactEmail(String contactEmail) {
        return contactRepository.findByContactEmail(contactEmail);
    }
}