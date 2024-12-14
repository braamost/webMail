import axios from "axios";


export async function uploadAttachments(formData, setError) {
  // Send the data to the backend
  try {
    const response = await axios.post(
      "http://localhost:8080/api/attachments/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log("Files uploaded successfully", response.data);
    return response.data;
  } catch (error) {
    setError("Error uploading files " + error.message);
  }
}
