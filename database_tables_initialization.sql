CREATE DATABASE IF NOT EXISTS web_mail;
USE web_mail;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS user_emails;
DROP TABLE IF EXISTS attachments;
DROP TABLE IF EXISTS emails;
DROP TABLE IF EXISTS contacts;
DROP TABLE IF EXISTS users;

-- Create the users table
CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_name VARCHAR(50) COLLATE utf8mb4_bin DEFAULT NULL, -- Case-sensitive collation
  password VARCHAR(255) COLLATE utf8mb4_bin DEFAULT NULL, -- Case-sensitive collation
  email VARCHAR(320) COLLATE utf8mb4_bin DEFAULT NULL,
  phone_number VARCHAR(20) DEFAULT NULL,
  photo LONGBLOB DEFAULT NULL, -- Added photo column
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

-- Create the emails table
CREATE TABLE emails (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  subject VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  sent_at DATETIME DEFAULT CURRENT_TIMESTAMP default NULL,
  is_read BOOLEAN DEFAULT FALSE, -- Tracks whether the email has been read
  is_starred BOOLEAN DEFAULT FALSE, -- Tracks starred
  email_direction ENUM ('SENT', 'RECEIVED' ,'DRAFT') DEFAULT 'RECEIVED', -- Email types 
  folder ENUM ('GENERAL', 'SPAM', 'TRASH', 'DRAFT', 'ARCHIVE') DEFAULT 'GENERAL' -- Organize emails into folders
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

-- Create the user_emails table
CREATE TABLE user_emails (
  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,
  email_id INT NOT NULL,
  PRIMARY KEY (sender_id, receiver_id, email_id),
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (email_id) REFERENCES emails(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create the attachments table (BLOB support)
CREATE TABLE attachments (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  email_id INT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  file_content LONGBLOB NOT NULL, -- BLOB to store file content
  FOREIGN KEY (email_id) REFERENCES emails(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

-- Create the contacts table
CREATE TABLE contacts (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL, -- Foreign key to the users table
  contact_name VARCHAR(255) NOT NULL, -- Contact's name
  contact_email VARCHAR(320) NOT NULL, -- Contact's email
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, -- Timestamp when the contact is added
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE -- Relationship with users
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

-- Indexes for performance
CREATE INDEX idx_users_username ON users (user_name);
CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_user_emails_user_id ON user_emails (sender_id, receiver_id);
CREATE INDEX idx_user_emails_email_id ON user_emails (email_id);
CREATE INDEX idx_attachments_email_id ON attachments (email_id);
CREATE INDEX idx_contacts_user_id ON contacts (user_id);
