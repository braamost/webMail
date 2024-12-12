import axios from "axios";

export async function Register(username, password, email, phoneNumber, setError) {
  const userData = {
    "userName": username, 
    "password": password, 
    "email": email,
    "phoneNumber": phoneNumber 
  };
  const jsonData = JSON.stringify(userData);
  console.log(jsonData);
  try {
    const apiUrl = `http://localhost:8080/api/users`;

    const response = await axios.post(apiUrl, userData, {
      headers: { "Content-Type": "application/json" },
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 409) {
        setError(data); // Backend will return specific conflict error (username or email exists)
      } else {
        setError(`Unexpected error: ${data}`);
      }
    } else {
      setError("Network error or server unreachable.");
    }
    return null;
  }
}