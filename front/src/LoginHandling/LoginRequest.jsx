import axios from "axios";

export async function Login(username, password, setError) {
  try {
    const apiUrl = `http://localhost:8080/api/users/username/${username}/${password}`;

    const response = await axios.get(apiUrl, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(response.data);
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
