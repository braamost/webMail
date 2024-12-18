import { Link } from "react-router-dom"
import { useState } from "react";
import "./userFolder.css"
import MenuBar from "../MenuBar/MenuBar"
function UserFolder({ user }) {
  const [changePass, setChangePass] = useState(false)
  const handleChangePassword = () => {
    setChangePass(true)
    // alert("Redirecting to change password...");
    // You can navigate to a password reset page here.
  };
  return (
    <>
      {(!changePass) && (
        <div className="userFolder">
          <h1>GENERAL INFORMATION</h1>
          <div style={{ marginTop: "20px" }}>
            <div className="info">
              <strong>Username:</strong>
              <strong>{user.userName}</strong>

            </div>
            <div className="info" >
              <strong>Email:</strong>
              <strong>{user.email}</strong>
            </div>
            <div className="info">
              <strong>Phone Number:</strong>
              <strong>{user.phoneNumber}</strong>
            </div>
          </div>

          <button
            className="changePass"
            onClick={handleChangePassword}
          >
            Change Password
          </button>
        </div>)}

      {(changePass && 
        <div className="userFolder">
          <form className="theForm" >
            <h1>Update Password</h1>
            <div className="setPass" style={{ marginTop: "20px" }}>
              <label htmlFor="toMail"><strong>Old Password:</strong></label>
              <input
                type="password"
                required
                placeholder="Old Password: "
              />
            </div>
            <div className="setPass">

              <label htmlFor="toMail"><strong>New Password:</strong></label>
              <input
                type="password"
                required
                placeholder="New Password: "
              />
            </div>
            <div className="setPass">
              <label htmlFor="Password"><strong>New Password:</strong></label>
              <input
                type="password"
                className="re"
                required
                placeholder="ReWrite New Password: "
              />
            </div>
            <button className="changePass"
              type="submit"
              onClick={() => setChangePass(false)}
            >Update Password</button>
          </form>
          <button className="return"
            onClick={() => setChangePass(false)}
          >return</button>
        </div>
        )}
        <MenuBar user={user} />
    </>
  )
}
export default UserFolder