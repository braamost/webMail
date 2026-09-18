package com.mail.back.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.mail.back.entity.Email;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class EmailResponse {
    private Integer id;
    private String subject;
    private String body;
    private LocalDateTime sentAt;

    @JsonProperty("isRead")
    private boolean isRead;

    @JsonProperty("isStarred")
    private boolean isStarred;

    private Email.Folder folder;

    @JsonProperty("emailDirection")
    private Email.EmailDirection emailDirection;

    private List<AttachmentResponse> attachments;

    private String emailOfSender;
    private String userNameOfSender;
    private String emailOfReceiver;
    private String userNameOfReceiver;
}
