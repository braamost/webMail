package com.mail.back.REST;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.bind.annotation.RestController;

import com.mail.back.Service.EmailService.EmailService;
import com.mail.back.entity.Email;
import com.mail.back.entity.User;

@RestController
@RequestMapping("/api")
public class EmailRestController {

    private EmailService emailService;
    @Autowired
    public EmailRestController(EmailService emailService) {
        this.emailService = emailService;
    }
    
    @GetMapping("/emails")
  public List<Email> findAll() {
    return emailService.findAll();
  }

  @GetMapping("/emails/{id}")
  public Email get(@PathVariable int id) {
    return emailService.findById(id);
  }


  @PostMapping("/emails")
  public Email postMethodName(@RequestBody Email email) {
    email.setId((long)0);
      Email entity = emailService.save(email);
      return entity;
  }
  
  @PutMapping("/emails")
  public Email putMethodName(@PathVariable Email email) {
      Email entity = emailService.save(email);
      return entity;
  }
  
  @DeleteMapping("/email/{id}")
  public void delete(@PathVariable int id) {
    emailService.deleteById(id);
  }
}
