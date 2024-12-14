import axios from "axios";
export async function UserEmail(SenderId, ReceiverId , EmailId) {
  try{
  const data = {
    "sender_id": SenderId,
    "receiver_id": ReceiverId,
    "email_id": EmailId
  };
  const url = `http://localhost:8080/api/userEmails`

  const response = await axios.post(url, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
}catch (error) {
  throw new Error();
}
}