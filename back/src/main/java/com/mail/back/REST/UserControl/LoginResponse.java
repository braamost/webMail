package com.mail.back.REST.UserControl;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class LoginResponse {
    private String token;
    private int id;
    private String username;
    private String profileUrl;
    private String email;
    private String phoneNumber;
}
