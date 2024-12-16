package com.mail.back.Service.UserEmailService;

import com.mail.back.GlobalHandle.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mail.back.entity.*;
import com.mail.back.DAO.UserEmailRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
@Service
public class UserEmailServiceImp implements UserEmailService{

    private final UserEmailRepository userEmailRepository;
    @Autowired
    public UserEmailServiceImp(UserEmailRepository userEmailRepository) {
        this.userEmailRepository = userEmailRepository;
    }

    @Override
    public List<UserEmail> findAll() {
        return userEmailRepository.findAll();
    }

    @Override
    public UserEmail findById(UserEmailID theId) {
        Optional<UserEmail> result = userEmailRepository.findById(theId);

        UserEmail theUserEmail = null;

        if (result.isPresent()) {
            theUserEmail = result.get();
        }
        else {
            // we didn't find the UserEmail
            throw new NotFoundException("Did not find UserEmail id - " + theId);
        }

        return theUserEmail;
    }

    @Override
    public UserEmail save(UserEmail theUserEmail) {
        return userEmailRepository.save(theUserEmail);
    }

    @Override
    public void deleteById(UserEmailID theId) {
        userEmailRepository.deleteById(theId);
    }

    @Override
    public List<Email> getEmailsByReceiverAndFolder(Integer receiverId,Email.Folder folder) {
        // Fetch UserEmails by receiverId and folder
        List<UserEmail> userEmails = userEmailRepository.findByReceiverIdAndFolder(receiverId, folder);

        // Extract the Email data (with ids and attachments) from UserEmail entries
        List<Email> emails = new ArrayList<>();
        for (UserEmail userEmail : userEmails) {
            emails.add(userEmail.getEmail());  // Add associated Email entity, including attachments
        }

        return emails;
    }


}
