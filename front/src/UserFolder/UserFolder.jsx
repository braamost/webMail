import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./userFolder.css";
import MenuBar from "../MenuBar/MenuBar";
import UploadPhotoForm from "./Photo";
import axios from "axios";
function UserFolder({ handleLogout, user, setUser }) {
  const [changePass, setChangePass] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleChangePassword = () => {
    setChangePass(true);
  };
  const deleteUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.delete(`http://localhost:8080/api/users/${user.id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (response.status >= 200 && response.status < 300) {
        alert("User deleted successfully");
        handleLogout();
      }
    } catch (error) {
      console.error("Delete error:", error.response);
      alert(
        `Failed to delete user: ${
           error.message
        }`
      );
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
    try {
      const response = await axios.put(`http://localhost:8080/api/users/update-password/${user.id}/${oldPassword}/${newPassword}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      });
    if (response.status >= 200 && response.status < 300) {
        alert("Password changed successfully");
        setChangePass(false);
        navigate("/");
      }
    } catch (error) {
      console.error("Password change error:", error.message);
      setError(error.message);
      alert(
        `Failed to change password: ${
         error.message
        }`
      );
    }
  };

  return (
    <>
      {!changePass && (
        <div className="userFolder">
          <h1>GENERAL INFORMATION</h1>
          <div className="infophoto">
            <div style={{ marginTop: "20px" }}>
              <div className="info">
                <strong>Username:</strong>
                <strong>{user.username}</strong>
              </div>
              <div className="info">
                <strong>Email:</strong>
                <strong>{user.email}</strong>
              </div>
              <div className="info">
                <strong>Phone Number:</strong>
                <strong>{user.phoneNumber}</strong>
              </div>
            </div>
            <UploadPhotoForm user={user} setUser={setUser}/>
          </div>
          <button className="changePass" onClick={handleChangePassword}>
            Change Password
          </button>
          <button className="delAcc" onClick={handleDeleteUser}>
            Delete Account
          </button>
        </div>
      )}

      {changePass && (
        <div className="userFolder">
          <form className="theForm">
            <h1>Update Password</h1>
            <div className="setPass" style={{ marginTop: "20px" }}>
              <label htmlFor="toMail">
                <strong>Old Password:</strong>
              </label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                placeholder="Old Password: "
              />
            </div>
            <div className="setPass">
              <label htmlFor="toMail">
                <strong>New Password:</strong>
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="New Password: "
              />
            </div>
            <div className="setPass">
              <label htmlFor="Password">
                <strong>confirm New Password:</strong>
              </label>
              <input
                type="password"
                className="re"
                required
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="ReWrite New Password: "
              />
            </div>
            <button
              className="changePass"
              type="submit"
              onClick={(e) => handleSubmit(e)}
            >
              Update Password
            </button>
            {error && <p className="error-message">{error}</p>}
          </form>
          <button className="return" onClick={() => setChangePass(false)}>
            return
          </button>
        </div>
      )}
      <MenuBar user= {user} handleLogout={handleLogout} />
    </>
  );
}
export default UserFolder;
