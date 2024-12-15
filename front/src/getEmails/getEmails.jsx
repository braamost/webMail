import axios from "axios";
import { useState } from "react";

export async function getEmails({folder}){
    const Email ={
    id,
    senderId,
    receiverEmail,
    subject,
    body,
    isRead,
    folder,
  }
    const [emails, setEmails] = useState([]);
    const [error, setError] = useState("");
      try {
        const response = await axios.get(`/api/emails/${folder}`, {
          params: {
            folder: `${folder}`
          }
        });
        setEmails(response.data);
        return emails ;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response) {
            const { status, data } = error.response;
            if (status === 404) {
              setError(data.message || "No emails found");
            } else {
              setError(`Server error: ${data.message || data}`);
            }
          } else if (error.request) {
            setError("No response from server. Please check your connection.");
          } else {
            setError(`Error: ${error.message}`);
          }
        } else {
          setError("An unexpected error occurred");
        }
      }
    }