import axios from "axios";

export async function Login(username, password) {
  try {
    const apiUrl = `http://localhost:8080/api/users/username/${username}`;
    console.log(apiUrl);
    
    const response = await axios.get(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const user = response.data; // Axios stores the response data in 'data'
    console.log(user);
    if (user.password !== password) {
      return"passError";
    } else {
      console.log(user);
    }

    return user;
  } catch (error) {

    console.error(error.message);
    
  }
}
