package com.mail.back.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
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

    @Column(name = "body" ,columnDefinition = "TEXT")
    private String body;

    @Column(name = "sent_at", updatable = false)
    private LocalDateTime sentAt;

    @Column(name = "is_read")
    @JsonProperty("isRead")
    private boolean isRead;

    @Column(name = "is_starred")
    @JsonProperty("isStarred")
    private boolean isStarred;

    // Enum for folders
    public enum Folder {
        GENERAL,
        SPAM,
        TRASH,
        ARCHIVE,
        DRAFT
    }

    public enum EmailDirection {
        SENT,
        RECEIVED
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "folder")
    private Folder folder;

    @Enumerated(EnumType.STRING)
    @Column(name = "email_direction")
    @JsonProperty("emailDirection")
    private EmailDirection emailDirection;

    @OneToMany(mappedBy = "email", fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Attachment> attachments;

    @Transient
    private String EmailOfSender ;
    @Transient
    private String UserNameOfSender ;
    @Transient
    private String EmailOfReceiver ;
    @Transient
    private String UserNameOfReceiver ;

    public Email() {}

    public Email(String subject, String body, boolean isRead, boolean isStarred, Folder folder, EmailDirection emailDirection) {
        this.subject = subject;
        this.body = body;
        this.isRead = isRead;
        this.isStarred = isStarred;
        this.folder = folder;
        this.emailDirection = emailDirection;
    }

    @PrePersist
    public void prePersist() {
        if (folder == Folder.DRAFT) {
            this.sentAt = null;  // Don't set sent time for drafts
        } else if (sentAt == null) {
            this.sentAt = LocalDateTime.now();
        }
    }

    // Getters and Setters
    public Integer getId() {
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

    // Getter and Setter for attachments
    public List<Attachment> getAttachments() {
        return attachments;
    }

    public void setAttachments(List<Attachment> attachments) {
        this.attachments = attachments;
    }

    public String getEmailOfReceiver() {
        return EmailOfReceiver;
    }

    public void setEmailOfReceiver(String emailOfReceiver) {
        EmailOfReceiver = emailOfReceiver;
    }

    public String getUserNameOfReceiver() {
        return UserNameOfReceiver;
    }

    public void setUserNameOfReceiver(String userNameOfReceiver) {
        UserNameOfReceiver = userNameOfReceiver;
    }

    public EmailDirection getEmailDirection() {
        return emailDirection;
    }

    public void setEmailDirection(EmailDirection emailDirection) {
        this.emailDirection = emailDirection;
    }

    public boolean isStarred() {
        return isStarred;
    }

    public void setStarred(boolean starred) {
        isStarred = starred;
    }

    @Override
    public String toString() {
        return "Email{" +
                "id=" + id +
                ", subject='" + subject + '\'' +
                ", body='" + body + '\'' +
                ", sentAt=" + sentAt +
                ", isRead=" + isRead +
                ", folder=" + folder +
                ", emailDirection=" + emailDirection +
                ", attachments=" + attachments +
                ", EmailOfSender='" + EmailOfSender + '\'' +
                ", UserNameOfSender='" + UserNameOfSender + '\'' +
                ", EmailOfReceiver='" + EmailOfReceiver + '\'' +
                ", UserNameOfReceiver='" + UserNameOfReceiver + '\'' +
                '}';
    }
}