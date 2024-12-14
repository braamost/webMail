import axios from "axios";
export async function UserIsFound(receiverEmail) {
  try {
    const encodedEmail = encodeURIComponent(receiverEmail); // Properly encode the email
    const apiUrl = `http://localhost:8080/api/users/username/${encodedEmail}`;
    
    const response = await axios.get(apiUrl, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      }
    });
    
    return response.data.id;
  } catch (error) {
    console.error('Error in UserIsFound:', error.response || error);
    throw error; // Propagate the error to be handled by the calling function
  }
}