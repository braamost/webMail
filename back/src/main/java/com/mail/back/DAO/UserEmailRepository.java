package com.mail.back.DAO;

import com.mail.back.entity.Email;
import com.mail.back.entity.UserEmail;
import com.mail.back.entity.UserEmailID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserEmailRepository extends JpaRepository<UserEmail, UserEmailID>{
    // In the repository, ensure the folder is handled as an enum
    @Query("SELECT ue FROM UserEmail ue WHERE ue.receiver.id = :receiverId AND ue.email.folder = :folder AND ue.email.emailDirection = 'RECEIVED'")
    List<UserEmail> findByReceiverIdAndFolder(@Param("receiverId") Integer receiverId, @Param("folder") Email.Folder folder);

    @Query("SELECT ue FROM UserEmail ue WHERE ue.sender.id = :senderId AND ue.email.folder = :folder AND ue.email.emailDirection = 'SENT' OR ue.email.emailDirection = 'DRAFT'")
    List<UserEmail> findBySenderIdAndFolder(@Param("senderId") Integer senderId, @Param("folder") Email.Folder folder);

    @Query("SELECT ue FROM UserEmail ue WHERE   ((ue.sender.id = :userId AND ue.email.emailDirection = 'SENT')" +
                                                "OR (ue.receiver.id = :userId AND ue.email.emailDirection = 'RECEIVED')) " +
                                                "AND ue.email.isStarred = true")
    List<UserEmail> findByStarred(@Param("userId") Integer userId);

}
