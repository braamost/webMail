import axios from "axios";
import { UserIsfound } from "./CheckUserExistence";
export async function createEmail(SenderUserName , reciverUserName , Subject ,body,  isread , folder){
  // check if the reciver is already existing
  try {
    const userId = await UserIsfound(reciverUserName);
    console.log(`User found with name: ${reciverUserName}`)
    if(userId){
      const emailData = { // just for testing purposes
        "subject": "Hello World",
        "body": "This is a test email.",
        "isRead": false,
        "folder": "INBOX" // Must match the `Folder` enum values
      };
      try {
        const response = await axios.post("http://localhost:8080/api/emails", emailData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log("Email saved:", response.data);
        //! calling the functin that request userEmails rest api 
      } catch (error) {
        console.error("Error saving email:", error);
      }
        return null ;
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