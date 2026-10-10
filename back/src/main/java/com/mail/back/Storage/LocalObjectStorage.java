package com.mail.back.Storage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;

@Component
@Primary
@ConditionalOnProperty(name = "storage.type", havingValue = "local", matchIfMissing = true)
public class LocalObjectStorage extends ObjectStorage {
    private final Path basePath;

    public LocalObjectStorage(@Value("${storage.local.base-path:./uploads}") String basePath) {
        try {
            Path path = Path.of(basePath).toAbsolutePath().normalize();
            Files.createDirectories(path);
            this.basePath = path.toRealPath();
        } catch (IOException exception) {
            throw new IllegalStateException("Unable to initialize local storage directory", exception);
        }
    }

    @Override
    public String save(MultipartFile file, String subDirectory) throws IOException {
        validateFile(file);
        Path directory = resolveWithinBase(subDirectory);
        Files.createDirectories(directory);

        String filename = generateSafeFilename(file);
        Path target = resolveWithinBase(basePath.relativize(directory).resolve(filename).toString());
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        return basePath.relativize(target).toString().replace('\\', '/');
    }

    @Override
    public void delete(String storedPathOrKey) throws IOException {
        Files.deleteIfExists(resolveStoredPath(storedPathOrKey));
    }

    public Path resolveStoredPath(String storedPath) throws IOException {
        Path path = resolveWithinBase(storedPath);
        if (!Files.isRegularFile(path)) {
            throw new IOException("Stored file does not exist");
        }
        return path;
    }

    private Path resolveWithinBase(String relativePath) throws IOException {
        if (relativePath == null || relativePath.isBlank()) {
            throw new IOException("A storage path is required");
        }
        Path candidate = basePath.resolve(relativePath).normalize();
        if (!candidate.startsWith(basePath)) {
            throw new IOException("Storage path escapes the configured base directory");
        }
        if (Files.exists(candidate) && !candidate.toRealPath().startsWith(basePath.toRealPath())) {
            throw new IOException("Storage path escapes the configured base directory");
        }
        return candidate;
    }
}
