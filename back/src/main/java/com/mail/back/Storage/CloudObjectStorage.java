package com.mail.back.Storage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.net.URI;

@Component
@ConditionalOnProperty(name = "storage.type", havingValue = "cloud")
public class CloudObjectStorage extends ObjectStorage {
    private final S3Client s3Client;
    private final String bucket;
    private final String region;

    public CloudObjectStorage(@Value("${storage.cloud.bucket:}") String bucket,
                              @Value("${storage.cloud.region:}") String region) {
        if (bucket.isBlank() || region.isBlank()) {
            throw new IllegalStateException("storage.cloud.bucket and storage.cloud.region are required for cloud storage");
        }
        this.bucket = bucket;
        this.region = region;
        this.s3Client = S3Client.builder().region(Region.of(region)).build();
    }

    @Override
    public String save(MultipartFile file, String subDirectory) throws IOException {
        validateFile(file);
        String key = normalizeSubDirectory(subDirectory) + "/" + generateSafeFilename(file);
        try {
            PutObjectRequest request = PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(key)
                    .contentType(file.getContentType())
                    .build();
            s3Client.putObject(request, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
            return objectUrl(key);
        } catch (RuntimeException exception) {
            throw new IOException("Unable to upload object to cloud storage", exception);
        }
    }

    @Override
    public void delete(String storedPathOrKey) throws IOException {
        try {
            s3Client.deleteObject(DeleteObjectRequest.builder()
                    .bucket(bucket)
                    .key(extractKey(storedPathOrKey))
                    .build());
        } catch (RuntimeException exception) {
            throw new IOException("Unable to delete object from cloud storage", exception);
        }
    }

    private String normalizeSubDirectory(String subDirectory) throws IOException {
        if (subDirectory == null || subDirectory.isBlank() || subDirectory.startsWith("/")
                || subDirectory.contains("..") || subDirectory.contains("\\")) {
            throw new IOException("Invalid cloud storage subdirectory");
        }
        return subDirectory.replaceAll("/+", "/");
    }

    private String objectUrl(String key) {
        return "https://" + bucket + ".s3." + region + ".amazonaws.com/" + key;
    }

    private String extractKey(String storedReference) {
        if (!storedReference.startsWith("http://") && !storedReference.startsWith("https://")) {
            return storedReference;
        }
        String path = URI.create(storedReference).getPath();
        return path.startsWith("/") ? path.substring(1) : path;
    }
}
