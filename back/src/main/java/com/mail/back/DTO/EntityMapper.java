package com.mail.back.DTO;

import com.mail.back.entity.Attachment;
import com.mail.back.entity.Contact;
import com.mail.back.entity.Email;
import com.mail.back.entity.User;
import com.mail.back.entity.UserEmail;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(
        componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface EntityMapper {

    UserResponse toUserResponse(User user);

    @Mapping(source = "username", target = "userName")
    User toUser(RegisterRequest request);

    @Mapping(source = "isRead", target = "read")
    @Mapping(source = "isStarred", target = "starred")
    Email toEmail(EmailRequest request);

    @Mapping(source = "emailOfSender", target = "emailOfSender")
    @Mapping(source = "userNameOfSender", target = "userNameOfSender")
    @Mapping(source = "emailOfReceiver", target = "emailOfReceiver")
    @Mapping(source = "userNameOfReceiver", target = "userNameOfReceiver")
    EmailResponse toEmailResponse(Email email);

    List<EmailResponse> toEmailResponses(List<Email> emails);

    AttachmentResponse toAttachmentResponse(Attachment attachment);

    List<AttachmentResponse> toAttachmentResponses(List<Attachment> attachments);

    @Mapping(source = "user.id", target = "userId")
    ContactResponse toContactResponse(Contact contact);

    List<ContactResponse> toContactResponses(List<Contact> contacts);

    @Mapping(source = "userEmailID.senderId", target = "senderId")
    @Mapping(source = "userEmailID.receiverId", target = "receiverId")
    @Mapping(source = "userEmailID.emailId", target = "emailId")
    UserEmailResponse toUserEmailResponse(UserEmail userEmail);

    List<UserEmailResponse> toUserEmailResponses(List<UserEmail> userEmails);
}
