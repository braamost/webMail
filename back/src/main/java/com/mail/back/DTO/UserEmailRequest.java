package com.mail.back.DTO;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserEmailRequest {

    @NotNull(message = "UserEmailID must be provided")
    @Valid
    private UserEmailIdDto userEmailID;

    @Getter
    @Setter
    public static class UserEmailIdDto {
        @NotNull(message = "Sender ID is required")
        private Integer senderId;

        @NotNull(message = "Receiver ID is required")
        private Integer receiverId;

        @NotNull(message = "Email ID is required")
        private Integer emailId;
    }
}
