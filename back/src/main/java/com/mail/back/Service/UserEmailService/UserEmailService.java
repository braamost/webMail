package com.mail.back.Service.UserEmailService;
import com.mail.back.entity.UserEmail;
import com.mail.back.entity.UserEmailID;

import java.util.List;
public interface UserEmailService {
  List<UserEmail> findAll();

  UserEmail findById(UserEmailID theId);

  UserEmail save(UserEmail theUserEmail);

  void deleteById(UserEmailID theId);
}
