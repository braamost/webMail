
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Register } from "./RegisterRequest";

export default function RegisterPage({ setUser }) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [photo, setPhoto] = useState(null);

  const navigate = useNavigate();

  const CreateAccount = async (e) => {
    e.preventDefault();
    const response = await Register(
      username,
      password,
      email,
      phoneNumber,
      photo,
      setError
    );
    if (response.status >= 200 && response.status < 300) {
      window.alert("Account created successfully!");
      navigate("/");
    }
  };

  const handleLoginClick = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/img.jpg')] bg-cover bg-center">
      <form
        onSubmit={CreateAccount}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-blue-100"
      >
        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Register</h2>
        {error && (
          <p className="mb-4 text-red-500 text-center font-medium bg-red-50 rounded-lg py-2 px-3 border border-red-200">
            {error}
          </p>
        )}
        <div className="mb-4">
          <label htmlFor="email" className="block text-blue-700 font-semibold mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-blue-900"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="username" className="block text-blue-700 font-semibold mb-1">
            Username
          </label>
          <input
            type="text"
            id="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-blue-900"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-blue-700 font-semibold mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            required
            minLength={5}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-blue-900"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="phone" className="block text-blue-700 font-semibold mb-1">
            Telephone
          </label>
          <input
            type="text"
            id="phone"
            inputMode="numeric"
            pattern="^[0-9]{10,15}$"
            maxLength="19"
            required
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-blue-900"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="photo" className="block text-blue-700 font-semibold mb-1">
            Profile Photo (optional)
          </label>
          <input
            type="file"
            id="photo"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
            className="w-full px-4 py-2 border border-blue-200 rounded-lg bg-blue-50 text-blue-900"
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors duration-200 font-semibold text-lg mb-3"
        >
          Create new account
        </button>
        <div className="text-center mt-2">
          <span className="text-blue-700">Have an account?</span>
          <button
            type="button"
            onClick={handleLoginClick}
            className="ml-2 px-4 py-2 bg-white text-blue-700 border border-blue-500 rounded-lg shadow hover:bg-blue-100 transition-colors duration-200"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
