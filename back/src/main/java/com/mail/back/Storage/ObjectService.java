package com.mail.back.Storage;

import org.springframework.stereotype.Service;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;

@Service
public class ObjectService {
    private final ObjectStorage objectStorage;

    public ObjectService(ObjectStorage objectStorage) {
        this.objectStorage = objectStorage;
    }

    public String save(MultipartFile file, String subDirectory) {
        try {
            return objectStorage.save(file, subDirectory);
        } catch (IOException exception) {
            throw new IllegalStateException("Unable to save uploaded file", exception);
        }
    }

    public void delete(String storedRef) {
        try {
            objectStorage.delete(storedRef);
        } catch (IOException exception) {
            throw new IllegalStateException("Unable to delete stored file", exception);
        }
    }

    public StoredObject open(String storedRef) {
        if (storedRef == null || storedRef.isBlank()) {
            throw new IllegalArgumentException("A stored reference is required");
        }
        if (!(objectStorage instanceof LocalObjectStorage localStorage)) {
            return new StoredObject(null, URI.create(storedRef), null);
        }
        try {
            Path path = localStorage.resolveStoredPath(storedRef);
            String contentType = Files.probeContentType(path);
            @SuppressWarnings("null")
            Resource resource = new org.springframework.core.io.UrlResource(path.toUri());
            return new StoredObject(resource, null, contentType);
        } catch (IOException exception) {
            throw new IllegalStateException("Unable to read stored file", exception);
        }
    }

    public record StoredObject(Resource resource, URI redirect, String contentType) {
        public boolean isRedirect() {
            return redirect != null;
        }
    }
}
