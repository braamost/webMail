package com.mail.back.entity;

import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;


@Embeddable
public class UserEmailID implements Serializable {
    private Integer senderId;
    private Integer receiverId;
    private Integer emailId;

    public UserEmailID() {}

    public UserEmailID(Integer senderId, Integer receiverId, Integer emailId) {
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.emailId = emailId;
    }

    public Integer getSenderId() {
        return senderId;
    }

    public void setSenderId(Integer senderId) {
        this.senderId = senderId;
    }

    public Integer getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(Integer receiverId) {
        this.receiverId = receiverId;
    }

    public Integer getEmailId() {
        return emailId;
    }

    public void setEmailId(Integer emailId) {
        this.emailId = emailId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserEmailID that = (UserEmailID) o;
        return Objects.equals(senderId, that.senderId) && Objects.equals(receiverId, that.receiverId) && Objects.equals(emailId, that.emailId);
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
