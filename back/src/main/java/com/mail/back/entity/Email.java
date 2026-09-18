package com.mail.back.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.List;

@Setter
@Getter
@ToString
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
        RECEIVED,
        DRAFT
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "folder")
    private Folder folder;

    @Enumerated(EnumType.STRING)
    @Column(name = "email_direction")
    @JsonProperty("emailDirection")
    private EmailDirection emailDirection;

    // Getter and Setter for attachments
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

}