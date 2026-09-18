package com.mail.back.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserEmailResponse {
    private Integer senderId;
    private Integer receiverId;
    private Integer emailId;
    private UserResponse sender;
    private UserResponse receiver;
    private EmailResponse email;
}
