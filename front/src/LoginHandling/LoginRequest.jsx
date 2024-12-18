import axios from "axios";

export async function Login(username, password, setError) {
  try {
    const apiUrl = `http://localhost:8080/api/users/login`;

    const userData = {
      userName: username,
      password: password,
    };

    const response = await axios.post(apiUrl, userData, {
      withCredentials: true, // Important for session cookies
      headers: {
        "Content-Type": "application/json",
      },
      
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 404) {
        setError("User not found.");
      } else if (status === 401) {
        setError("Wrong password.");
      } else {
        setError(`Unexpected error: ${data}`);
      }
    } else {
      setError("Network error or server unreachable.");
    }
    return null;
  }
}
