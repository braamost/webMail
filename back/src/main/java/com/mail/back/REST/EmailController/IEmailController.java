package com.mail.back.REST.EmailController;

import com.mail.back.entity.Email;

import java.util.List;

public interface IEmailController {
    List<Email> findAll();
    Email getById(Integer id);
    Email addEmail(Email email);
    Email updateFolder(String folder, Integer id);
    void deleteById(Integer id);
}