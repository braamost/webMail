import axios from "axios";
export async function UserIsfound(username){
  try {
    const apiUrl = `http://localhost:8080/api/users/username/${username}/`;

    const response = await axios.get(apiUrl, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(response.data);
    return response.data.id;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 404) {
        throw new Error("notFound");
      }
    } else {
      throw new Error("Network error or server unreachable.");
    }
    return null;
  }
}