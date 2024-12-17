import axios from "axios";

export const getEmails = async (folder)=>{
      console.log(folder);
    try {
      const response = await axios.get(`http://localhost:8080/api/emails`, {
        params: {
            folder: folder  // folder is "TRASH"
        },
        headers: {
            "Content-Type": "application/json",
        }
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
