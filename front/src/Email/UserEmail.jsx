import axios from "axios";
export async function UserEmail(SenderId, ReciverId , EmailId) {
  try{
  const data = {
    "sender_id": SenderId,
    "reciver_id": ReciverId,
    "email_id": EmailId
  };
  const url = `http://localhost:8080/api/userEmails`

  const response = await axios.post(url, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(response.data);
  return response.data;
}catch (error) {
  throw new Error();
}
}