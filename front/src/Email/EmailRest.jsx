import axios from "axios";
import { UserIsFound } from "./CheckUserExistence";
export async function createEmail(senderId, receiverEmail, subject, body, isRead, folder, setError) {
  try {
    // First verify receiver exists and get their ID
    const receiverId = await UserIsFound(receiverEmail);
    
    // Create email first
    const emailData = {
      subject: subject,
      body: body,
      isRead: isRead,
      folder: folder
    };

    // Save the email and get its ID back
    const emailResponse = await axios.post(
      "http://localhost:8080/api/emails/add", 
      emailData,
      {
        headers: { "Content-Type": "application/json" }
      }
    );
    const emailId = emailResponse.data.id;
    console.log(senderId, receiverId, emailId);

    // Create the user-email relationship
    const userEmailData = {
      userEmailID: {
        senderId: senderId,
        receiverId: receiverId,
        emailId: emailId
      }
    };

    // Save the user-email relationship
    await axios.post(
      "http://localhost:8080/api/userEmails",
      userEmailData,
      {
        headers: { "Content-Type": "application/json" }
      }
    );

    return emailResponse.data;

  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 404) {
        console.log(data);
        setError(data.message || data);
      } else {
        setError(`Server error: ${data.message || data}`);
      }
    } else if (error.request) {
      setError("No response from server. Please check your connection.");
    } else {
      setError(`Error: ${error.message}`);
    }
    return null; 
  }
}