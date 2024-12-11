package com.mail.back.DAO;
import com.mail.back.entity.UserEmail;
import com.mail.back.entity.UserEmailID;
import org.springframework.data.jpa.repository.JpaRepository;
public interface UserEmailRepository extends JpaRepository<UserEmail, UserEmailID>{

}
