import "./MenuBar.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import NewMail from "../NewMail/NewMail";
function MenuBar({ user, handleLogout }) {
  const [isNewMail, setIsNewMail] = useState(false);

  const newMail = (email = null) => {
    setIsNewMail(!isNewMail);
  };
  return (
    <div className="menu" style={isNewMail ? {} : { zIndex: "5" }}>
      <ul>
        <li className="profile">
          <Link className="Link" to="/UserFolder">
            <div className="img-box">
              <img src={user.photo || "man.jpg"} alt="profile" />
            </div>
            <h2>{user.userName}</h2>
          </Link>
        </li>
        <li>
          <button className="newmail" onClick={() => newMail()}>
            NEW Mail
          </button>
        </li>
        <li>
          <Link className="Link" to="/InboxFolder">
            <button type="button">InboxFolder</button>
          </Link>
        </li>
        <li>
          <Link className="Link" to="/Trash" content="">
            <button type="button">Trash</button>
          </Link>
        </li>
        <li>
          <Link className="Link" to="/SentMails">
            <button type="button">Sent mails</button>
          </Link>
        </li>
        <li>
          <Link className="Link" to="/Starred">
            <button type="button">Starred</button>
          </Link>
        </li>
        <li>
          <Link className="Link" to="/Archive">
            <button type="button">Archive</button>
          </Link>
        </li>
        <li>
          <Link className="Link" to="/Spam">
            <button type="button">Spam</button>
          </Link>
        </li>
        <li>
          <Link className="Link" to="/MyContacts">
            <button type="button">MyContacts</button>
          </Link>
        </li>
        <li>
          <Link className="Link" to="/Draft">
            <button type="button">Draft</button>
          </Link>
        </li>
        <li className="logOut">
          <button
            className="logbutton"
            type="button"
            onClick={() => handleLogout()}
          >
            Log Out
          </button>
        </li>
      </ul>
      {isNewMail && <NewMail user={user} setIsNewMail={setIsNewMail} />}
    </div>
  );
}
export default MenuBar;
