
const retrieveAttachment = (attachment) => {
  // Decode the base64 encoded file content
  const byteCharacters = atob(attachment.fileContent);
  
  // Convert the decoded characters to byte numbers
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  
  // Create a Uint8Array from the byte numbers
  const byteArray = new Uint8Array(byteNumbers);
  
  // Create a Blob with the correct MIME type
  const blob = new Blob([byteArray], { type: attachment.fileType });
  
  // Create and return a File object
  return new File([blob], attachment.fileName, { 
    type: attachment.fileType,
    lastModified: new Date().getTime()
  });
};

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