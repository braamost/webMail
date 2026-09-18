package com.mail.back.DTO;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ContactResponse {
    private Integer id;
    private String contactName;
    private String contactEmail;
    private LocalDateTime createdAt;
    private Integer userId;
}
