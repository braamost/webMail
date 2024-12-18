import axios from "axios";

export async function MovetoFolder(folder,id,setError) {
  try {
    console.log("folder and id ",folder,id);
    const response = await axios.put(
      `http://localhost:8080/api/emails/${folder}/${id}`,
    )
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 404) {
        setError(data.message || data);
      } else {
        setError(`Server error: ${data.message || data}`);
      }
    } else if (error.request) {
      setError("No response from server. Please check your connection.");
    } else {
      setError(`Error: ${error.message}`);
    }
    throw error;
  }
}
