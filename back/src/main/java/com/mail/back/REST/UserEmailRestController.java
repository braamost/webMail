package com.mail.back.REST;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.mail.back.Service.UserEmailService.UserEmailService;
import com.mail.back.entity.UserEmail;
import com.mail.back.Service.EmailService.EmailService;

@RestController
@RequestMapping("/api")
public class UserEmailRestController {
  private UserEmailService userEmailService ;
  @Autowired
  public UserEmailRestController(UserEmailService userEmailService) {
    this.userEmailService = userEmailService;
  }
  

  @GetMapping("/userEmails")
  public List<UserEmail> findAll() {
    return userEmailService.findAll();
  }

  @PostMapping("/userEmails")
  public UserEmail postMethodName(@RequestBody UserEmail email) {
      UserEmail entity = userEmailService.save(email);
      return entity;
  }
  
  @PutMapping("/userEmails")
  public UserEmail putMethodName(@PathVariable UserEmail email) {
      UserEmail entity = userEmailService.save(email);
      return entity;
  }
  
}
