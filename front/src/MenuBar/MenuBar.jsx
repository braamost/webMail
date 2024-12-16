import "./MenuBar.css" 
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import NewMail from "../NewMail/NewMail";
function MenuBar({user}) {
    const [isNewMail ,setIsNewMail] = useState(false);
    const navigate = useNavigate();
    /*{username}*/
    const newMail= ()=>{
        setIsNewMail(!isNewMail);
    }
    return (
        <div className="menu"  style={isNewMail?{}:{zIndex:"5"}}>
            <ul>
                <li className="profile">
                <Link className="Link" to="/Home/UserFolder">
                    <div className="img-box">
                        <img src="man.jpg" alt="profile" />
                    </div>
                    <h2>{user.userName}</h2>
                </Link> 
                </li>
                <li>
                    <button className="newmail"onClick={()=> newMail()}>NEW Mail</button>
                </li>
                <li>
                    <Link className="active" to ="/InboxFolder">
                        <button type="button">InboxFolder</button>
                    </Link>  
                </li>
                <li>
                    <Link className="Link" to="/Trash" content="">
                        <button type="button">Trash</button>
                    </Link>  
                </li>
                <li>
                    <Link className="Link" to="/Draft">
                        <button type="button">Draft</button>
                    </Link> 
                </li>
                <li>
                    <Link className="Link" to="/SentMails">
                        <button type="button">Sent mails</button>
                    </Link> 
                </li>
                <li>
                    <Link className="Link" to="/Filter">
                        <button type="button">Filter</button>
                    </Link>
                </li>
                <li className="logOut">
                    <button className="logbutton" type="button" onClick={()=>{
                        sessionStorage.removeItem("user");
                        navigate("/");
                    }}>Log Out</button>
                </li>
            </ul>
            {(isNewMail)&&<NewMail user={user} setIsNewMail={setIsNewMail}/>} 
            
        </div>
    )
}
export default MenuBar