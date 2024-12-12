import "../homePage/HomePage.css" 
import { Link } from "react-router-dom";
import { useState } from "react";
import NewMail from "../NewMail/NewMail";
function MenuBar(){
    const [isNewMail ,setIsNewMail] = useState(false);
    
    const newMail= ()=>{
        setIsNewMail(!isNewMail);
    }
    return (
        <>
        {(isNewMail)&&<NewMail/>}    
        <div className="menu-bar">
            <button onClick={()=> newMail()}>NEW Mail</button>
            <Link to ="/Home/InboxFolder">
                <button type="button">InboxFolder</button>
            </Link>
            <Link to="/Home/Trash" content="">
                <button type="button">Trash</button>
            </Link>
            <Link to="/Home/Draft">
                <button type="button">Draft</button>
            </Link>
            <Link to="/Home/SentMails">
                <button type="button">Sent mails</button>
            </Link>
            <Link to="/Home/UserFolder">
            <button type="button">User Folder</button>
        </Link>
            <Link to="/Home/Filter">
        <button type="button">Filter</button>
        </Link> 
        </div>
        </>
    )
}
export default MenuBar