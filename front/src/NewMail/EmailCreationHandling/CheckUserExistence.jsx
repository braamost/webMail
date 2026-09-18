import apiClient from "../../utils/apiUtils";

export async function UserIsFound(receiverEmail) {
  const encodedEmail = encodeURIComponent(receiverEmail); // Properly encode the email
  const apiUrl = `/api/users/email/${encodedEmail}`;

  const response = await apiClient.get(apiUrl);

  return response.data.id;
}
