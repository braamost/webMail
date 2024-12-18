import axios from "axios";

// Attachment conversion function
import { processEmailAttachments } from "./RetrieveAttachments";

export const getEmails = async (folder, user) => {
  console.log('API Request - folder parameter:', folder);
  
  try {

    console.log(user.id);
    
    const response = await axios.get(`http://localhost:8080/api/userEmails/emails/${user.id}/${folder}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    // Process attachments for all emails in the response
    const processedEmails = response.data.map(processEmailAttachments);
    
    console.log('Processed API Response:', processedEmails);
    console.log('API URL:', response.request.responseURL);
    
    return processedEmails;
  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw error;
  }
};