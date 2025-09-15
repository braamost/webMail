
import { Login } from "./LoginRequest";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setUserForTab } from "../SessionManager";
import Toast from "../components/Toast";
import Loading from "../components/Loading"; 

export default function LoginPage({ setUser }) {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

  const handleRegisterClick = () => {
    navigate("/Register");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const response = await Login(userName, password, setError);
      console.log("login response: ", response);

      if (response != null) {
        const userData = {
          id: response.id,
          username: response.username,
          email: response.email,
          token: response.token,
          profileUrl: response.profileUrl,
          phoneNumber: response.phoneNumber,
        };

        setUserForTab(userData);
        setUser(userData);
        setToast({
          isVisible: true,
          message: 'Login successful! Welcome back.',
          type: 'success'
        });
        setTimeout(() => navigate("/InboxFolder"), 1000);
      } else {
        setToast({
          isVisible: true,
          message: 'Login failed. Please check your credentials.',
          type: 'error'
        });
      }
    } catch (err) {
      setToast({
        isVisible: true,
        message: 'An error occurred during login. Please try again.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/img.jpg')] bg-cover bg-center">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-blue-700 mb-2">Welcome Back</h2>
            <p className="text-blue-500">Sign in to your account</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-blue-700 mb-2">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-blue-900"
                  placeholder="Enter your username"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-blue-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-blue-900"
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-300 rounded" />
                <span className="ml-2 text-sm text-blue-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                Forgot password?
              </a>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors duration-200 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loading size="sm" text="" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign in</span>
              )}
            </button>
            <div className="text-center">
              <p className="text-sm text-blue-600">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={handleRegisterClick}
                  className="text-blue-700 hover:text-blue-500 font-medium"
                >
                  Register here
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  );
}
