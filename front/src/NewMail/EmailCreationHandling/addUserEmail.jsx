import apiClient from "../../utils/apiUtils";

export async function UserEmailCreation(SenderId, ReceiverId, EmailId) {
  console.log(SenderId, ReceiverId, EmailId);
  const userEmailData = {
    userEmailID: {
      senderId: SenderId,
      receiverId: ReceiverId,
      emailId: EmailId,
    },
  };
  // Save the user-email relationship
  return await apiClient.post("/api/userEmails", userEmailData);
}
