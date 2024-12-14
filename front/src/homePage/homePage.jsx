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
import SearchBar from "../SearchAndSort/SearchBar";
function HomePage({emails , user}){
          
    return (<>
    <SearchBar />
    <div className="pagecontent">
        <SearchBar />
        <EmailTable emails={emails}  />
        <MenuBar user={user} />
        
    </div>
    </>
    )

}
export default HomePage