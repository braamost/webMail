CREATE DATABASE  IF NOT EXISTS `web_mail`;
USE `web_mail`;

drop table if exists `users`;

create table `users`(

  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email` varchar(320) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;


drop table if exists `emails`;

create table `emails`(

    `id` int NOT NULL AUTO_INCREMENT primary key,
	`subject` VARCHAR(255) NOT NULL,
    `body` TEXT NOT NULL,
	`sent_at` datetime DEFAULT CURRENT_TIMESTAMP,
    `is_read` BOOLEAN DEFAULT FALSE, -- Tracks whether the email has been read
    `folder` ENUM('INBOX', 'OUTBOX', 'TRASH', 'ARCHIVE', 'starred') DEFAULT 'INBOX' -- Organize emails into folders

)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

drop table if exists `user_emails`;

create table `user_emails`(

	`sender_id` int NOT NULL,
    `receiver_id` int NOT NULL,
    `email_id` int NOT NULL,
	PRIMARY KEY (`sender_id`, `receiver_id`, `email_id`),
    FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON DELETE CASCADE  on update CASCADE ,
    FOREIGN KEY (`receiver_id`) REFERENCES `users`(`id`) ON DELETE CASCADE  on update CASCADE ,
    FOREIGN KEY (`email_id`) REFERENCES `emails`(`id`) ON DELETE CASCADE  on update CASCADE 
    
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX `idx_users_username` ON `users` (`username`);
CREATE INDEX `idx_users_email` ON `users` (`email`);
CREATE INDEX `idx_user_emails_user_id` ON `user_emails` (`sender_id`, `receiver_id`);
CREATE INDEX `idx_user_emails_email_id` ON `user_emails` (`email_id`);
    
    
    