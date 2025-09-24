import apiClient from "../utils/apiUtils";

// Attachment conversion function
import { processEmailAttachments } from "./RetrieveAttachments";

export const getEmails = async (folder, user) => {
  try {
    const response = await apiClient.get(
      `/api/userEmails/emails/${user.id}/${folder}`
    );
    console.log("fetched emails: ", response.data);
    // Process the response data and ensure newlines are preserved
    const emails = response.data.map((email) => ({
      ...email,
      body: email.body ? email.body.replace(/\\n/g, "\n") : email.body,
    }));

    return emails.map(processEmailAttachments);
  } catch (error) {
    console.error("Error details:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw error;
  }
};
