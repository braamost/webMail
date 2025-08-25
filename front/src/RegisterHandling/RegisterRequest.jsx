import axios from "axios";

export async function Register(username, password, email, phoneNumber, photo, setError) {

  const formData = new FormData();

  // Add JSON as a Blob with the right type
  formData.append(
    "user",
    new Blob([JSON.stringify({
      username: username,
      email: email,
      password: password,
      phoneNumber: phoneNumber
    })], { type: "application/json" })
  );

  // Add file (optional)
  if (photo) {
    formData.append("photo", photo);
  }

  try {
    const apiUrl = `http://localhost:8080/api/users/register`;

    const response = await axios.post(apiUrl, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log("Response from server: ", response);
    return response;
  } catch (error) {
    if (error.response) {
      const { status, message } = error.response.data;
      if (status === 409) {
        setError(message); // Backend will return specific conflict error (username or email exists)
      } else {
        setError(`Unexpected error: ${error.response.statusText}`);
      }
    } else {
      setError("Network error or server unreachable.");
    }
    return null;
  }
}