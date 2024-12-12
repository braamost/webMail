package com.mail.back.GlobalHandle;

public class WrongPasswordException extends RuntimeException {
    public WrongPasswordException(String message) {
        super(message);
    }
    public WrongPasswordException(String message, Throwable cause) {
        super(message, cause);
    }
    public WrongPasswordException(Throwable cause) {
        super(cause);
    }
}
