import axios from "axios";
import { UserIsFound } from "./CheckUserExistence";
export async function createEmail(SenderId , receiverEmail , Subject ,body,  isRead , folder){
  try {
    const userId = await UserIsFound(receiverEmail); 
    console.log(`User found with name: ${receiverEmail}`)
    if(userId){
      const emailData = {
        "subject": Subject,
        "body": body,
        "isRead": isRead,
        "folder": folder
      };
      {
        const response = await axios.post("http://localhost:8080/api/emails", emailData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log("Email saved:", response.data);
      }
    }
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 404) {
        setError("User not found.");
      }else {
        setError(`Unexpected error: ${data}`);
      }
    } else {
      setError("Network error or server unreachable.");
    }
    return null;
  }
}