package com.mail.back.CleanTrash;

import com.mail.back.DAO.EmailRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.transaction.Transactional;

import java.time.LocalDateTime;

@Service
public class TrashCleanupService {

    @Autowired
    private EmailRepository emailRepository;

    // Runs daily at midnight
    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional
    public void cleanUpOldTrashEmails() {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        int deletedCount = emailRepository.deleteOldTrashEmails(thirtyDaysAgo);
        System.out.println(deletedCount + " emails removed from TRASH folder.");
    }
}

