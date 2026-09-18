package com.mail.back.REST.AttachmentController;

import com.mail.back.DTO.AttachmentResponse;
import com.mail.back.Service.AttachmentService.AttachmentService;
import com.mail.back.Service.AttachmentService.AttachmentService.AttachmentDownload;
import com.mail.back.Storage.ObjectService.StoredObject;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequestMapping("/api/attachments")
@Slf4j
public class AttachmentRestController {

    private final AttachmentService attachmentService;

    public AttachmentRestController(AttachmentService attachmentService) {
        this.attachmentService = attachmentService;
    }

    @PostMapping("/upload")
    public ResponseEntity<List<AttachmentResponse>> uploadAttachments(
            @RequestParam("files") MultipartFile[] files,
            @RequestParam("emailId") Integer emailId,
            Authentication authentication) {
        log.info("Uploading {} attachments for email ID: {}", files.length, emailId);
        List<AttachmentResponse> attachments =
                attachmentService.uploadAttachments(files, emailId, authentication);
        return new ResponseEntity<>(attachments, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AttachmentResponse> getAttachment(
            @PathVariable Integer id, Authentication authentication) {
        log.info("Retrieving attachment with ID: {}", id);
        return new ResponseEntity<>(attachmentService.getAttachment(id, authentication), HttpStatus.OK);
    }

    @SuppressWarnings("null")
    @GetMapping("/{id}/download")
    public ResponseEntity<?> downloadAttachment(
            @PathVariable Integer id, Authentication authentication) {
        AttachmentDownload download = attachmentService.prepareDownload(id, authentication);
        StoredObject storedObject = download.storedObject();
        try {
            if (storedObject.isRedirect()) {
                return ResponseEntity.status(HttpStatus.FOUND).location(storedObject.redirect()).build();
            }
            MediaType mediaType = MediaType.APPLICATION_OCTET_STREAM;
            if (download.fileType() != null && !download.fileType().isBlank()) {
                mediaType = MediaType.parseMediaType(download.fileType());
            } else if (storedObject.contentType() != null) {
                mediaType = MediaType.parseMediaType(storedObject.contentType());
            }
            String safeName = download.fileName() == null ? "attachment" : download.fileName().replace("\"", "");
            return ResponseEntity.ok()
                    .contentType(mediaType)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + safeName + "\"")
                    .body(storedObject.resource());
        } catch (Exception exception) {
            throw new IllegalStateException("Unable to read stored attachment", exception);
        }
    }
}
