import axios from "axios";
export async function UserIsFound(receiverEmail){
  
    const apiUrl = `http://localhost:8080/api/users/username/${receiverEmail}/`;

    const response = await axios.get(apiUrl, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(response.data);
    return response.data.id;
  }