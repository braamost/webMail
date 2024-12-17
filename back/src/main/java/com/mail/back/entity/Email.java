package com.mail.back.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "emails")
public class Email {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "subject")
    private String subject;

    @Column(name = "body")
    private String body;

    @Column(name = "sent_at", updatable = false)
    private LocalDateTime sentAt;

    @Column(name = "is_read")
    private boolean isRead;

    // Enum for folders
    public enum Folder {
        INBOX,
        OUTBOX,
        TRASH,
        ARCHIVE,
        STARRED
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "folder")
    private Folder folder;


    @OneToMany(mappedBy = "email", fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Attachment> attachments;

    // Getter and Setter for attachments
    public List<Attachment> getAttachments() {
        return attachments;
    }

    public void setAttachments(List<Attachment> attachments) {
        this.attachments = attachments;
    }

    @Transient
    private String EmailOfSender ;
    @Transient
    private String UserNameOfSender ;

    public Email() {}

    public Email(String subject, String body, boolean isRead, Folder folder) {
        this.subject = subject;
        this.body = body;
        this.isRead = isRead;
        this.folder = folder;
    }

    @PrePersist
    public void prePersist() {
        if (sentAt == null) {
            this.sentAt = LocalDateTime.now(); // Set the sent time automatically if not provided
        }
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public LocalDateTime getSentAt() {
        return sentAt;
    }

    public void setSentAt(LocalDateTime sentAt) {
        this.sentAt = sentAt;
    }

    public boolean isRead() {
        return isRead;
    }

    public void setRead(boolean isRead) {
        this.isRead = isRead;
    }

    public Folder getFolder() {
        return folder;
    }

    public void setFolder(Folder folder) {
        this.folder = folder;
    }

    public String getEmailOfSender() {
        return EmailOfSender;
    }

    public void setEmailOfSender(String emailOfSender) {
        EmailOfSender = emailOfSender;
    }

    public String getUserNameOfSender() {
        return UserNameOfSender;
    }

    public void setUserNameOfSender(String userNameOfSender) {
        UserNameOfSender = userNameOfSender;
    }
}