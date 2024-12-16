import axios from "axios";

export async function LogOut(navigate) {
    try {
        const response = await axios.post("http://localhost:8080/api/users/logout");
        window.alert(response.data);
        navigate("/");
        return response.data;
    } catch (error) {
        console.error("Error logging out:", error);
    }
}