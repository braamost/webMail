import axios from "axios";

export async function Register(username, password, email, phoneNumber) {
  const userData = {
    "userName": "moazz",
    "password": "123",
    "email": "moaz@",
    "phoneNumber": "164894984"
};
  console.log(jsonData);
  //const jsonData = JSON.stringify(userData);
  console.log(jsonData);
  try {
    const apiUrl = `http://localhost:8080/api/users`;
    console.log(apiUrl);  // Logs the API URL for debugging

    const response = await axios.post(apiUrl, jsonData, { // Concise headers
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
      console.log(response); // Logs the entire response object
    } else {
      console.error('Registration failed:', response.statusText); // More informative error message
      return false;
    }
  } catch (error) {
    console.error('Error during registration:', error);
    return false;
  }
}