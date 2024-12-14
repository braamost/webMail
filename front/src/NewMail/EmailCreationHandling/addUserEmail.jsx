import axios from "axios";
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
  return await axios.post("http://localhost:8080/api/userEmails", userEmailData, {
    headers: { "Content-Type": "application/json" },
  });
}
