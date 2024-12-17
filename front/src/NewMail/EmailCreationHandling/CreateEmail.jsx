import axios from "axios";

export async function createEmail(subject, body, isRead, folder,emailDirection) {
  const emailData = {
    subject: subject,
    body: body,
    isRead: isRead,
    folder: folder,
    emailDirection: emailDirection
  };
  // Save the email and get its ID back
  const emailResponse = await axios.post(
    "http://localhost:8080/api/emails/add",
    emailData,
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return emailResponse.data.id;
}
