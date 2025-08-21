package com.mail.back.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@Entity
@NoArgsConstructor
@Table(name = "attachments")
public class Attachment {

    // Getters and setters
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "email_id", nullable = false)
    @JsonBackReference
    private Email email; // Associated email

    private String fileName; // The file's name
    private String fileType; // The MIME type of the file

    @Lob
    @Column(nullable = false)
    private byte[] fileContent; // BLOB to store the file content

    public Attachment(Email email, String fileName, String fileType, byte[] fileContent) {
        this.email = email;
        this.fileName = fileName;
        this.fileType = fileType;
        this.fileContent = fileContent;
    }
}