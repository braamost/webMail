package com.mail.back.REST.EmailController;

import com.mail.back.entity.Email;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface IEmailController {
    List<Email> findAll(Authentication authentication);
    Email getById(Integer id, Authentication authentication);
    ResponseEntity<Email> addEmail(Email email, Authentication authentication);
    Email updateFolder(String folder, Integer id, Authentication authentication);
    void deleteById(Integer id, Authentication authentication);
}