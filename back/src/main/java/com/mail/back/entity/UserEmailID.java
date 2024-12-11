package com.mail.back.entity;

import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;


@Embeddable
public class UserEmailID implements Serializable {
    private int senderId;
    private int receiverId;
    private int emailId;

    public UserEmailID() {}

    public UserEmailID(int senderId, int receiverId, int emailId) {
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.emailId = emailId;
    }

    public int getSenderId() {
        return senderId;
    }

    public void setSenderId(int senderId) {
        this.senderId = senderId;
    }

    public int getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(int receiverId) {
        this.receiverId = receiverId;
    }

    public int getEmailId() {
        return emailId;
    }

    public void setEmailId(int emailId) {
        this.emailId = emailId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserEmailID that = (UserEmailID) o;
        return senderId == that.senderId && receiverId == that.receiverId && emailId == that.emailId;
    }

    @Override
    public int hashCode() {
        return Objects.hash(senderId, receiverId, emailId);
    }
    @Override
    public String toString() {
        return "UserEmailID{" +
                "senderId=" + senderId +
                ", receiverId=" + receiverId +
                ", emailId=" + emailId +
                '}';
    }
}
