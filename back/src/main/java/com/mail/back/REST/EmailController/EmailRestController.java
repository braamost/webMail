package com.mail.back.REST.EmailController;

import com.mail.back.Service.EmailService.EmailService;
import com.mail.back.entity.Email;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class EmailRestController implements IEmailController {
    private final EmailService emailService;

    @Autowired
    public EmailRestController(EmailService emailService) {
        this.emailService = emailService;
    }

    @Override
    public List<Email> findAll() {
        return emailService.findAll();
    }

    @Override
    public Email getById(Integer id) {
        return emailService.findById(id);
    }

    @Override
    public Email addEmail(Email email) {
        email.setId(null);
        return emailService.save(email);
    }

    @Override
    public Email updateFolder(String folder, Integer id) {
        Email email = emailService.findById(id);

        switch (folder.toLowerCase()) {
            case "starred":
                email.setStarred(!email.isStarred());
                break;
            case "read":
                email.setRead(!email.isRead());
                break;
            case "spam":
                email.setFolder(email.getFolder().equals(Email.Folder.SPAM) ?
                        Email.Folder.GENERAL : Email.Folder.SPAM);
                break;
            case "trash":
                email.setFolder(email.getFolder().equals(Email.Folder.TRASH) ?
                        Email.Folder.GENERAL : Email.Folder.TRASH);
                break;
            case "archive":
                email.setFolder(email.getFolder().equals(Email.Folder.ARCHIVE) ?
                        Email.Folder.GENERAL : Email.Folder.ARCHIVE);
                break;
        }

        return emailService.save(email);
    }

    @Override
    public void deleteById(Integer id) {
        emailService.deleteById(id);
    }
}