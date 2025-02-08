package com.mail.back.Service.EmailService;
import com.mail.back.entity.*;
import java.util.List;
public interface EmailService {
  
    List<Email> findAll();

    Email findById(Integer id);

    Email save(Email email);

    void deleteById(Integer id);

    List<Attachment> getAttachmentsForEmail(Integer emailId);
    public Email saveDraft(Email email);

    public void deleteDraft(Integer id);

}
