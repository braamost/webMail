import "../style.css";
import { Login } from "./signUpRequest";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegisterClick = () => {
    navigate("/Register"); // Navigate to the Register page
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Attempting login with:", { username, password });

    const response = await Login(username, password, setError);
    if (response != null) {
      console.log(response);
      navigate("/Home");
    }
  };

  return (
    <>
      <div className="form-box">
        <form onSubmit={handleLogin}>
          <h2>Login</h2>
          {error && <p className="error-message">{error}</p>}
          <div className="inputbox">
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label htmlFor="username">Username</label>
          </div>
          <div className="inputbox">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="password">Password</label>
          </div>
          <div className="forget">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <label>
              <a href="#">Forgot password?</a>
            </label>
          </div>
          <button type="submit">Log in</button>
          <div className="register">
            <p>
              Don't have an account?
              <button type="button" onClick={handleRegisterClick}>
                Register
              </button>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}
