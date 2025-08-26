package com.mail.back.entity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Table(name = "contacts")
public class Contact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Setter
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Setter
    @Column(name = "contact_name", nullable = false, length = 255)
    private String contactName;

    @Setter
    @Column(name = "contact_email", nullable = false, length = 320)
    private String contactEmail;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Contact(User user, String contactName, String contactEmail) {
        this.user = user;
        this.contactName = contactName;
        this.contactEmail = contactEmail;
    }

    @PrePersist
    public void prePersist() {
        if(createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }
    public Contact() {}
}
