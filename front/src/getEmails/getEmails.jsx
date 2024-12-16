import axios from "axios";

export const getEmails = async (folder)=>{
  
    try {
      const receiverId = 1;  // Example receiverId
      const response = await axios.get("http://localhost:8080/api/emails", {
        params: {
          receiverId: receiverId,  // Pass receiverId as query parameter
          folder: folder,           // Pass folder as query parameter
        },
      });
      
      console.log(response.data); // Debugging: logs the fetched emails
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const { status, data } = error.response;
          if (status === 404) {
            throw new Error(data.message || "No emails found");
          } else {
            throw new Error(`Server error: ${data.message || data}`);
          }
        } else if (error.request) {
          throw new Error("No response from server. Please check your connection.");
        } else {
          throw new Error(`Error: ${error.message}`);
        }
      } else {
        throw new Error("An unexpected error occurred");
      }
    }
}
