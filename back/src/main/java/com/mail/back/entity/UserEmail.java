package com.mail.back.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "user_emails")

public class UserEmail {
    @EmbeddedId
    private UserEmailID userEmailID;

    @ManyToOne
    @MapsId("senderId")
    @JoinColumn(name = "sender_id", referencedColumnName = "id")
    private User sender;

    @ManyToOne
    @MapsId("receiverId")
    @JoinColumn(name = "receiver_id", referencedColumnName = "id")
    private User receiver;

    @ManyToOne
    @MapsId("emailId")
    @JoinColumn(name = "email_id", referencedColumnName = "id")
    private Email email;

    public UserEmail() {}

    public UserEmail(UserEmailID userEmailID, User sender, User receiver, Email email) {
        this.userEmailID = userEmailID;
        this.sender = sender;
        this.receiver = receiver;
        this.email = email;
    }

    public UserEmailID getUserEmailID() {
        return userEmailID;
    }

    public void setUserEmailID(UserEmailID userEmailID) {
        this.userEmailID = userEmailID;
    }

    public User getSender() {
        return sender;
    }

    public void setSender(User sender) {
        this.sender = sender;
    }

    public User getReceiver() {
        return receiver;
    }

    public void setReceiver(User receiver) {
        this.receiver = receiver;
    }

    public Email getEmail() {
        return email;
    }

    public void setEmail(Email email) {
        this.email = email;
    }
}
