

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

// Usage example:
export const processEmailAttachments = (email) => {
  // If there are attachments, convert them
  if (email.attachments && email.attachments.length > 0) {
    const processedAttachments = email.attachments.map(attachment => 
      retrieveAttachment(attachment)
    );
    
    return processedAttachments;
  }
  
  return [];
};

// Example of how to use it
const email = [] ;/* your email object */
const attachmentFiles = processEmailAttachments(email);

// If you want to download the file
if (attachmentFiles.length > 0) {
  const file = attachmentFiles[0];
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(file);
  downloadLink.download = file.name;
  downloadLink.click();
}