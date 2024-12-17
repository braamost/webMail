import axios from "axios";

export const getEmails = async (folder) => {
  console.log('API Request - folder parameter:', folder);
  
  try {
    // Using URLSearchParams to properly encode the enum parameter
    const params = new URLSearchParams();
    params.append('folder', folder);
    
    const response = await axios.get(`http://localhost:8080/api/userEmails/emails?${params.toString()}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    console.log('API Response:', response.data);
    console.log('API URL:', response.request.responseURL);
    return response.data;
  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw error;
  }
};