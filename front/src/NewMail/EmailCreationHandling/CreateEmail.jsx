import axios from "axios";

export async function createEmail(subject, body, folder,emailDirection) {
  const processedBody = body.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const emailData = {
    subject: subject,
    body: processedBody,
    folder: folder,
    emailDirection: emailDirection,
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
