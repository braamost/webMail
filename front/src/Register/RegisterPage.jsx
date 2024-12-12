import "./style.css";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Register } from "../REST/RegisterRequest";
import { Login } from "../REST/UserRest";
export default function RegisterPage({ setIsLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error , setError] = useState("");
  const navigate = useNavigate();

  const CreateAccount = async (e) => {
    e.preventDefault();

    // Call the Register function with the user inputs
    const response2 = await Login(username, "0");
    console.log(response2)
    if(response2){
      setError("Username already exists");
   
    }else{
      const response = await Register(username, password, email, phoneNumber);
      navigate("/Home");
    }
   
    // Handle response (e.g., show success, error messages, etc.)
  };

  const handleLoginClick = () => {
    setIsLogin(true);
    navigate("/");
  };

  return (
    <form onSubmit={CreateAccount}>
      <h2>Register</h2>
      
      <div className="inputbox">
        <ion-icon name="mail-outline"></ion-icon>
        <input
          type="email"
          required
          value={email} // Bind the input to the email state
          onChange={(e) => setEmail(e.target.value)} // Update email state on change
        />
        <label htmlFor="email">Email</label>
      </div>

      <div className="inputbox">
        <ion-icon name="lock-closed-outline"></ion-icon>
        <input
          type="text"
          required
          value={username} // Bind the input to the username state
          onChange={(e) => setUsername(e.target.value)} // Update username state on change
        />
        <label htmlFor="text">Username</label>
        {error}
      </div>

      <div className="inputbox">
        <ion-icon name="lock-closed-outline"></ion-icon>
        <input
          type="password" // Password input should have type="password" for security
          required
          value={password} // Bind the input to the password state
          onChange={(e) => setPassword(e.target.value)} // Update password state on change
        />
        <label htmlFor="password">Password</label>
      </div>

      <div className="inputbox">
        <ion-icon name="call-outline"></ion-icon>
        <input
          type="text"
          inputMode="numeric"
          pattern="^[0-9]{10,15}$"
          maxLength="19"
          required
          value={phoneNumber} // Bind the input to the phoneNumber state
          onChange={(e) => setPhoneNumber(e.target.value)} // Update phoneNumber state on change
        />
        <label htmlFor="phone">Telephone</label>
      </div>

      <button type="submit">Create new account</button>

      <div className="register">
        <p>
          Have an account?{" "}
          <button type="button" onClick={handleLoginClick}>
            Login
          </button>
        </p>
      </div>

      <div className="home">
        <Link to="/Home">
          <button>Go to Home Page</button>
        </Link>
      </div>
    </form>
  );
}
