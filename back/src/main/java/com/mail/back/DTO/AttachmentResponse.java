package com.mail.back.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AttachmentResponse {
    private Integer id;
    private String fileName;
    private String fileType;
}
