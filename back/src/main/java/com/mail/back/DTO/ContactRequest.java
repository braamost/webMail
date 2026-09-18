package com.mail.back.DTO;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ContactRequest {

    @NotBlank(message = "Contact name must not be null")
    private String contactName;

    @NotBlank(message = "Contact email must not be null")
    @Email(message = "Invalid contact email format")
    private String contactEmail;

    @NotNull(message = "Contact owner user id must not be null")
    @Valid
    private UserRef user;

    @Getter
    @Setter
    public static class UserRef {
        @NotNull(message = "Contact owner user id must not be null")
        private Integer id;
    }
}
