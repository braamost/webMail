package com.mail.back.DAO;



import com.mail.back.entity.Contact;
import com.mail.back.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Integer> {
    List<Contact> findByUserId(int userId);
    Contact findByContactEmail(String contactEmail);
}
