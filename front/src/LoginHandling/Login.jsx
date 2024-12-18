import "../style.css";
import { Login } from "./LoginRequest";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage({setUser}) {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegisterClick = () => {
    navigate("/Register"); // Navigate to the Register page
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await Login(userName, password, setError);
    if(response!=null){
      setUserName(userName);
      setUser(response);
      navigate("/InboxFolder");
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
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
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
