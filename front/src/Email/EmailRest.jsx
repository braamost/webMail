import axios from "axios";
import { UserIsfound } from "./CheckUserExistence";
export async function createEmail(SenderId , reciverEmail , Subject ,body,  isread , folder){
  // check if the reciver is already existing
  try {
    const userId = 1;//await UserIsfound(reciverEmail); 
    console.log(`User found with name: ${reciverEmail}`)
    if(userId){
      const emailData = {
        "subject": Subject,
        "body": body,
        "isRead": isread,
        "folder": folder
      };
      {
        const response = await axios.post("http://localhost:8080/api/emails/add", emailData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log("Email saved:", response.data);
        //! calling the functin that request userEmails rest api
      }
    }
  } catch (error) {
    if (error.message === "notFound") {
      console.log("User not found.");
    } else if (error.message === "Network error or server unreachable.") {
      console.log("Network or server issue.");
    } else {
      console.error("Unexpected error:", error.message);
    }
    return null;
  }
}