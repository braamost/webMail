import "./HomePage.css" 
import { Link } from "react-router-dom";
import Draft from "../Draft/Draft";
import InboxFolder from "../InboxFolder/InboxFolder";
import Trash from "../Trash/Trash";
import SentMails from "../SentMails/SentMails";
import UserFolder from "../UserFolder/UserFolder";
import Filter from "../Filter/Filter";
import SearchSort from "../SearchAndSort/SearchAndSort";
import EmailTable from "../EmailTable/EmailTable";
import MenuBar from "../MenuBar/MenuBar";
function HomePage({emails}){
          
    return (
    <>
        <MenuBar/>
        <div className="space">
            <EmailTable emails={emails} />
        </div>
    </>
    )

}
export default HomePage