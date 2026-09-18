package com.mail.back.Service.ContactService;

import com.mail.back.DTO.ContactRequest;
import com.mail.back.DTO.ContactResponse;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface ContactService {
    ContactResponse addContact(ContactRequest contact, Authentication authentication);

    void deleteContact(int contactId, Authentication authentication);

    ContactResponse getContactById(int contactId, Authentication authentication);

    List<ContactResponse> getContactsByUserId(int userId, Authentication authentication);
}
