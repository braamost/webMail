import "./style.css";
import { Login } from "../REST/UserRest";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Register } from "../REST/RegisterRequest";

export default function SignUp({setIsLogin , setError, error}) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegisterClick = () => {
    setIsLogin(false); // Update the login state
    navigate('/Register'); // Navigate to the Register page
  };
  const handleLogin = async (e) => {
    e.preventDefault();

      console.log('Attempting login with:', { username, password });
      
      const response = await Login(username, password);
      console.log(response+"444");
      if (response && response != "passError") {
        navigate('/Home');
      } else {
        if(response == "passError"){
          setError("Incorrect password");
        }else{
        setError('Not found User name');
      }
    }
  };
  
  return (
    <>
      <div className="form-box">
        <div className="form-value">
          { (
            <form onSubmit={handleLogin}>
              <h2>Login</h2>
              {error && (
                <div style={{
                  color: 'red', 
                  marginBottom: '10px', 
                  padding: '10px', 
                  backgroundColor: '#ffeeee',
                  border: '1px solid red',
                  borderRadius: '5px'
                }}>
                  {error}
                </div>
              )}
              <div className="inputbox">
                <ion-icon name="mail-outline"></ion-icon>
                <input 
                  type="text" 
                  required 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                />
                <label htmlFor="username">Username</label>
              </div>
              <div className="inputbox">
                <ion-icon name="lock-closed-outline"></ion-icon>
                <input 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
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
              <Link to="/Home">
                <button type="button">Go to Home Page</button>
              </Link>
            </form>
          )}
        </div>
      </div>
    </>
  );
}