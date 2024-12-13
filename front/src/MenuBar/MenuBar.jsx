import "./MenuBar.css" 
import "./man.jpg";
import { Link } from "react-router-dom";
import { useState } from "react";
import NewMail from "../NewMail/NewMail";
function MenuBar({user}){
    const [isNewMail ,setIsNewMail] = useState(false);
    /*{username}*/
    const newMail= ()=>{
        setIsNewMail(!isNewMail);
    }
    return (
        <div className="menu">
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
                    <Link className="active" to ="/Home/InboxFolder">
                        <button type="button">InboxFolder</button>
                    </Link>  
                </li>
                <li>
                    <Link className="Link" to="/Home/Trash" content="">
                        <button type="button">Trash</button>
                    </Link>  
                </li>
                <li>
                    <Link className="Link" to="/Home/Draft">
                        <button type="button">Draft</button>
                    </Link> 
                </li>
                <li>
                    <Link className="Link" to="/Home/SentMails">
                        <button type="button">Sent mails</button>
                    </Link> 
                </li>
                <li>
                    <Link className="Link" to="/Home/Filter">
                        <button type="button">Filter</button>
                    </Link>
                </li>
                <li className="logOut">
                    <Link className="Link" to="/">
                        <button className="logbutton" type="button">Log Out</button>
                    </Link>
                </li>
            </ul>
            {(isNewMail)&&<NewMail user={user}/>} 
        </div>
    )
}
export default MenuBar