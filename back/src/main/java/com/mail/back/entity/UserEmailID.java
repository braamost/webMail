package com.mail.back.entity;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;
import java.util.Objects;


@Setter
@Getter
@ToString
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

}
