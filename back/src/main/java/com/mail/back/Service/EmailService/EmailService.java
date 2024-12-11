package com.mail.back.Service.EmailService;
import com.mail.back.entity.*;
import java.util.List;
public interface EmailService {
  
    List<Email> findAll();

    Email findById(int id);

    Email save(Email employee);

    void deleteById(int id);
}
