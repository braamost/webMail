package com.mail.back.Storage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

public abstract class ObjectStorage {
    @Value("${storage.max-file-size-mb:10}")
    private long maxFileSizeMb;

    @Value("${storage.allowed-extensions:jpg,jpeg,png,gif,pdf,docx,txt}")
    private String allowedExtensions;

    @Value("${storage.allowed-mime-types:image/jpeg,image/png,image/gif,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,application/octet-stream}")
    private String allowedMimeTypes;

    public abstract String save(MultipartFile file, String subDirectory) throws IOException;

    public abstract void delete(String storedPathOrKey) throws IOException;

    protected void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("A non-empty file is required");
        }
        if (file.getSize() > maxFileSizeMb * 1024 * 1024) {
            throw new IllegalArgumentException("File size exceeds maximum limit of " + maxFileSizeMb + "MB");
        }

        String extension = getExtension(file.getOriginalFilename());
        Set<String> allowed = Arrays.stream(allowedExtensions.split(","))
                .map(value -> value.trim().toLowerCase(Locale.ROOT))
                .filter(value -> !value.isEmpty())
                .collect(Collectors.toSet());
        if (!allowed.contains(extension)) {
            throw new IllegalArgumentException("File extension is not allowed");
        }

        String contentType = file.getContentType();
        Set<String> allowedMimeTypes = Arrays.stream(this.allowedMimeTypes.split(","))
                .map(value -> value.trim().toLowerCase(Locale.ROOT))
                .filter(value -> !value.isEmpty())
                .collect(Collectors.toSet());
        if (contentType != null && !contentType.isBlank()
                && !allowedMimeTypes.contains(contentType.toLowerCase(Locale.ROOT))) {
            throw new IllegalArgumentException("File MIME type is not allowed");
        }
    }

    protected String generateSafeFilename(MultipartFile file) {
        String extension = getExtension(file.getOriginalFilename());
        return UUID.randomUUID() + (extension.isEmpty() ? "" : "." + extension);
    }

    private String getExtension(String originalFilename) {
        if (originalFilename == null) {
            return "";
        }
        String filename = originalFilename.replace('\\', '/');
        filename = filename.substring(filename.lastIndexOf('/') + 1);
        int lastDot = filename.lastIndexOf('.');
        if (lastDot < 1 || lastDot == filename.length() - 1) {
            return "";
        }
        return filename.substring(lastDot + 1).toLowerCase(Locale.ROOT);
    }
}
