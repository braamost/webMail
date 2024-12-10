package com.mail.back.entity;

import jakarta.persistence.Embeddable;

import java.io.Serializable;


@Embeddable
public class EmbeddedID implements Serializable {
    private int senderId;
    private int receiverId;
    private int emailId;

    public EmbeddedID() {}

    
}
