import "../style.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Register } from "./RegisterRequest";

export default function RegisterPage({setUser}) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const navigate = useNavigate();

  const CreateAccount = async (e) => {
    e.preventDefault();

    const response = await Register(
      username,
      password,
      email,
      phoneNumber,
      setError
    );

    if (response !== null) {
      console.log(response);
      window.alert("Account created successfully!");
      navigate("/");
    }
  };

  const handleLoginClick = () => {
    navigate("/");
  };

  return (
    <div className="form-box">
      <form onSubmit={CreateAccount}>
        <h2>Register</h2>
        {error && <p className="error-message">{error}</p>}
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
        </div>

        <div className="inputbox">
          <ion-icon name="lock-closed-outline"></ion-icon>
          <input
            type="password" // Password input should have type="password" for security
            required
            minLength={5}
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
      </form>
    </div>
  );
}
