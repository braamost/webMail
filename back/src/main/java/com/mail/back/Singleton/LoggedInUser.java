package com.mail.back.Singleton;
import com.mail.back.entity.User;
public class LoggedInUser {
    private static LoggedInUser instance;
    private User user;

    // Private constructor to prevent instantiation
    private LoggedInUser() {}

    // Public method to get the single instance
    public static LoggedInUser getInstance() {
        if (instance == null) {
            instance = new LoggedInUser();
        }
        return instance;
    }
    // Getter and setter for user details
    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }


}

