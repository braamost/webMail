package com.mail.back.REST.UserControl;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDto {
    private String username;
    private String email;
    private String password;
    private String phoneNumber;
}

