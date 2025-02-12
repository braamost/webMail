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

        // Extract the Email data from UserEmail entries
        return getTheEmails(userEmails);
    }

    @Override
    public List<Email> getEmailsBySenderAndFolder(Integer senderId, Email.Folder folder) {
        // Fetch UserEmails by senderId and folder
        List<UserEmail> userEmails = userEmailRepository.findBySenderIdAndFolder(senderId, folder);
        System.out.println(userEmails);
        // Extract the Email data from UserEmail entries
        return getTheEmails(userEmails);
    }

    @Override
    public List<Email> getEmailsByStarred(Integer userId) {
        // Fetch UserEmails by senderId and folder
        List<UserEmail> userEmails = userEmailRepository.findByStarred(userId);

        // Extract the Email data from UserEmail entries
        return getTheEmails(userEmails);
    }

    private List<Email> getTheEmails(List<UserEmail> userEmails){
        List<Email> emails = new ArrayList<>();
        for (UserEmail userEmail : userEmails) {
            Email email = userEmail.getEmail();
            email.setEmailOfReceiver(userEmail.getReceiver().getEmail());
            email.setUserNameOfReceiver(userEmail.getReceiver().getUserName());
            email.setEmailOfSender(userEmail.getSender().getEmail());
            email.setUserNameOfSender(userEmail.getSender().getUserName());
            emails.add(email);  // Add associated Email entity, including attachments
        }
        return emails;
    }
}
