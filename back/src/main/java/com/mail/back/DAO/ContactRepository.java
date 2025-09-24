package com.mail.back.DAO;

import com.mail.back.entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ContactRepository extends JpaRepository<Contact, Integer> {
    List<Contact> findByUserId(int userId);
    Contact findByContactEmail(String contactEmail);
}
