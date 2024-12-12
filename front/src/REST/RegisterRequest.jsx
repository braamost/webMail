import axios from "axios";

export async function Register(username, password, email, phoneNumber) {
  const userData = {
    "userName": username, // Typo: Should be `username`
    "password": password, // Typo: Should be `password,
    "email": email,
    "phoneNumber": phoneNumber// Typo: Should be phoneNumber
  };
  console.log(userData);
  const jsonData = JSON.stringify(userData);
  console.log(jsonData);
  try {
    const apiUrl = `http://localhost:8080/api/users`;
    console.log(apiUrl);  // Logs the API URL for debugging

    const response = await axios.post(apiUrl, jsonData, { // Concise headers
      headers: { 'Content-Type': 'application/json' }
    });
    console.log(response);
    if (response) {
      console.log(response); // Logs the entire response object
    } 
  } catch (error) {
    console.error('Error during registration:', error);
    return false;
  }
}