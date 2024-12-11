package com.mail.back.REST;

import java.util.List;

import com.mail.back.GlobalHandle.NotFoundException;
import com.mail.back.entity.UserEmailID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.mail.back.Service.UserEmailService.UserEmailService;
import com.mail.back.entity.UserEmail;

@RestController
@RequestMapping("/api/userEmails")
public class UserEmailRestController {
  private final UserEmailService userEmailService ;
  @Autowired
  public UserEmailRestController(UserEmailService userEmailService) {
    this.userEmailService = userEmailService;
  }
  

  @GetMapping
  public List<UserEmail> findAll() {
    return userEmailService.findAll();
  }

  @GetMapping("/{senderId}/{receiverId}/{emailId}")
  public UserEmail findById(@PathVariable int senderId, @PathVariable int receiverId, @PathVariable int emailId) {
      return userEmailService.findById(new UserEmailID(senderId, receiverId, emailId));
  }

  @PostMapping
  public UserEmail addUserEmail(@RequestBody UserEmail userEmail) {   // I'm not sure if this is enough
      return userEmailService.save(userEmail);
  }

  // don't know if we should enable updating...

  @DeleteMapping("/{senderId}/{receiverId}/{emailId}")
  public String deleteById(
          @PathVariable Integer senderId,
          @PathVariable Integer receiverId,
          @PathVariable Integer emailId
  ) {
    UserEmailID userEmailID = new UserEmailID(senderId, receiverId, emailId);
    UserEmail existingUserEmail = userEmailService.findById(userEmailID);

    if (existingUserEmail == null) {
      throw new NotFoundException("UserEmail with senderId " + senderId + ", receiverId " + receiverId + " and emailId " + emailId + " not found.");
    }

    userEmailService.deleteById(userEmailID);
    return "Deleted UserEmail with senderId " + senderId + ", receiverId " + receiverId + " and emailId " + emailId;
  }
  
}
