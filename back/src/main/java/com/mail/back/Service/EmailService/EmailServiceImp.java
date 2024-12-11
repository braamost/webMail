package com.mail.back.Service.EmailService;
import com.mail.back.DAO.EmailRepository;
import com.mail.back.entity.*;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
public class EmailServiceImp implements EmailService{
  private EmailRepository emailRepository;
  
  @Autowired
  public EmailServiceImp(EmailRepository emailRepository){
    this.emailRepository = emailRepository;
  }

   @Override
    public List<Email> findAll() {
        return emailRepository.findAll();
    }

    @Override
    public Email findById(int theId) {
        Optional<Email> result = emailRepository.findById(theId);

        Email theEmail = null;

        if (result.isPresent()) {
            theEmail = result.get();
        }
        else {
            // we didn't find the Email
            throw new RuntimeException("Did not find Email id - " + theId);
        }

        return theEmail;
    }

    @Override
    public Email save(Email theEmail) {
        return emailRepository.save(theEmail);
    }

    @Override
    public void deleteById(int theId) {
        emailRepository.deleteById(theId);
    }

}
