package com.mail.back.Service.EmailService;

import com.mail.back.DAO.EmailRepository;
import com.mail.back.GlobalHandle.NotFoundException;
import com.mail.back.entity.*;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImp implements EmailService{
  private final EmailRepository emailRepository;
  
  @Autowired
  public EmailServiceImp(EmailRepository emailRepository){
    this.emailRepository = emailRepository;
  }

   @Override
    public List<Email> findAll() {
        return emailRepository.findAll();
    }

    @Override
    public Email findById(Integer theId) {
        Optional<Email> result = emailRepository.findById(theId);

        Email theEmail = null;

        if (result.isPresent()) {
            theEmail = result.get();
        }
        else {
            // we didn't find the Email
            throw new NotFoundException("Email with id " + theId + " not found.");
        }

        return theEmail;
    }

    @Override
    public Email save(Email email) {
        return emailRepository.save(email);
    }

    @Override
    public void deleteById(Integer theId) {
        emailRepository.deleteById(theId);
    }

    public List<Attachment> getAttachmentsForEmail(Integer emailId) {
        return emailRepository.findAttachmentsByEmailId(emailId);
    }

    public Email saveDraft(Email email) {
      email.setFolder(Email.Folder.DRAFT);
      email.setEmailDirection(Email.EmailDirection.SENT);
      return emailRepository.save(email);
    }


    public void deleteDraft(Integer id) {
        emailRepository.deleteById(id);
    }
}
