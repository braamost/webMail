
const retrieveAttachment = (attachment) => ({
  id: attachment.id,
  name: attachment.fileName,
  type: attachment.fileType,
  downloadUrl: `http://localhost:8080/api/attachments/${attachment.id}/download`,
});

// Process attachments for a single email
export const processEmailAttachments = (email) => {
  // If there are attachments, convert them
  if (email.attachments && email.attachments.length > 0) {
    // Convert attachments to processed file objects
    email.processedAttachments = email.attachments.map(attachment => 
      retrieveAttachment(attachment)
    );
  }
  return email;
};
