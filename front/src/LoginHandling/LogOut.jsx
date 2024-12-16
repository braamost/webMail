import axios from "axios";
import { useNavigate } from "react-router-dom";

export async function LogOut(setError) {
    const navigate = useNavigate();
    try {
        const response = await axios.post("http://localhost:8080/api/users/logout");
        window.alert(response.data);
        navigate("/");
        return response.data;
    } catch (error) {
        setError("Error logging out: " + error.message);
        console.error("Error logging out:", error);
    }
}