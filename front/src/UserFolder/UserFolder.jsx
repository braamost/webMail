import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import MenuBar from "../MenuBar/MenuBar";
import UploadPhotoForm from "./Photo";
import apiClient from "../utils/apiUtils";
import { FaUser, FaEnvelope, FaPhone, FaKey, FaTrash, FaArrowLeft } from "react-icons/fa";
import Toast from "../components/Toast";
import Loading from "../components/Loading";
function UserFolder({ handleLogout, user, setUser }) {
  const [changePass, setChangePass] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });
  const navigate = useNavigate();
  const handleChangePassword = () => {
    setChangePass(true);
  };
  const deleteUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await apiClient.delete(`/api/users/${user.id}`);

      if (response.status >= 200 && response.status < 300) {
        setToast({
          isVisible: true,
          message: 'Account deleted successfully',
          type: 'success'
        });
        setTimeout(() => handleLogout(), 1500);
      }
    } catch (error) {
      console.error("Delete error:", error.response);
      setToast({
        isVisible: true,
        message: `Failed to delete account: ${error.message}`,
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleDeleteUser = async (e) => {
    e.preventDefault();
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (confirmed) {
      await deleteUser(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(newPassword !== confirmNewPassword){
      setError("Passwords do not match");
      return;
    }
    setIsLoading(true);
    try {
      const response = await apiClient.put(`/api/users/update-password/${user.id}/${oldPassword}/${newPassword}`);
      if (response.status >= 200 && response.status < 300) {
        setToast({
          isVisible: true,
          message: 'Password changed successfully',
          type: 'success'
        });
        setChangePass(false);
        setTimeout(() => navigate("/"), 1500);
      }
    } catch (error) {
      console.error("Password change error:", error.message);
      setError(error.message);
      setToast({
        isVisible: true,
        message: `Failed to change password: ${error.message}`,
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const [showMenuBar, setShowMenuBar] = React.useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:block fixed top-0 left-0 h-full w-64">
        <MenuBar user={user} handleLogout={handleLogout} />
      </div>
      {/* Mobile menu toggle button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-30 p-2 bg-white rounded-lg shadow-md"
        onClick={() => setShowMenuBar(true)}
        aria-label="Open menu"
      >
        <span className="sr-only">Open menu</span>
        <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {/* Mobile overlay menu */}
      {showMenuBar && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="w-64 bg-white/90 shadow-xl h-full">
            <MenuBar user={user} handleLogout={handleLogout} onLinkClick={() => setShowMenuBar(false)} />
          </div>
          <div className="flex-1 bg-black bg-opacity-30" onClick={() => setShowMenuBar(false)} />
        </div>
      )}

      {/* Main content */}
      {!changePass && (
        <div className="min-h-screen flex items-center justify-center bg-[url('/img.jpg')] bg-cover bg-center">
          <div className="w-full max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-blue-700 mb-8 text-center">Profile Settings</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Profile Information */}
              <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
                <h2 className="text-xl font-semibold text-blue-700 mb-6 flex items-center">
                  <FaUser className="w-5 h-5 mr-2" />
                  General Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <FaUser className="w-4 h-4 text-blue-400" />
                    <div>
                      <span className="text-sm font-medium text-blue-500">Username</span>
                      <p className="text-lg text-blue-900">{user.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaEnvelope className="w-4 h-4 text-blue-400" />
                    <div>
                      <span className="text-sm font-medium text-blue-500">Email</span>
                      <p className="text-lg text-blue-900">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaPhone className="w-4 h-4 text-blue-400" />
                    <div>
                      <span className="text-sm font-medium text-blue-500">Phone Number</span>
                      <p className="text-lg text-blue-900">{user.phoneNumber || "Not provided"}</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Profile Photo */}
              <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
                <h2 className="text-xl font-semibold text-blue-700 mb-6">Profile Photo</h2>
                <UploadPhotoForm user={user} setUser={setUser} />
              </div>
            </div>
            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleChangePassword}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2 font-semibold"
              >
                <FaKey className="w-4 h-4" />
                <span>Change Password</span>
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-700 transition-colors duration-200 flex items-center justify-center space-x-2 font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loading size="sm" text="" />
                ) : (
                  <FaTrash className="w-4 h-4" />
                )}
                <span>Delete Account</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {changePass && (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center py-8 px-2">
          <div className="w-full max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8">
              <div className="flex items-center mb-6">
                <button
                  onClick={() => setChangePass(false)}
                  className="mr-4 p-2 text-blue-400 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                >
                  <FaArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-2xl font-bold text-blue-700">Update Password</h1>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                    placeholder="Enter current password"
                    className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-blue-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="Enter new password"
                    className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-blue-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                    placeholder="Confirm new password"
                    className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-blue-900"
                  />
                </div>
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loading size="sm" text="" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <span>Update Password</span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </>
  );
}
export default UserFolder;
