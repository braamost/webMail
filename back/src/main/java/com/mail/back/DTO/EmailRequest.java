package com.mail.back.DTO;

import com.mail.back.entity.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmailRequest {

    @NotBlank(message = "Email subject cannot be null")
    private String subject;

    @NotBlank(message = "Email body cannot be null")
    private String body;

    private Email.Folder folder;

    @NotNull(message = "Email direction cannot be null")
    private Email.EmailDirection emailDirection;

    private Boolean isRead;
    private Boolean isStarred;
}
