import axios from "axios";
export async function UserIsFound(receiverEmail) {
  const encodedEmail = encodeURIComponent(receiverEmail); // Properly encode the email
  const apiUrl = `http://localhost:8080/api/users/email/${encodedEmail}`;

  const response = await axios.get(apiUrl, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data.id;
}
