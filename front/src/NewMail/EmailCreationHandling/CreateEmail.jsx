import apiClient from "../../utils/apiUtils";

export async function createEmail(subject, body, folder,emailDirection) {
  const processedBody = body.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const emailData = {
    subject: subject,
    body: processedBody,
    folder: folder,
    emailDirection: emailDirection,
  };
  // Save the email and get its ID back
  const emailResponse = await apiClient.post(
    "/api/emails/add",
    emailData
  );
  return emailResponse.data.id;
}
