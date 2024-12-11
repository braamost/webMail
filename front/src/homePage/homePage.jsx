import "./HomePage.css" 
import Draft from "../Draft/Draft";
import InboxFolder from "../InboxFolder/InboxFolder";
import Trash from "../Trash/Trash";
import SentMails from "../SentMails/SentMails";
import UserFolder from "../UserFolder/UserFolder";
import Filter from "../Filter/Filter";
import SearchSort from "../SearchAndSort/SearchAndSort";
function HomePage(){
    return (
    <>
        <div className="menu-bar">
            <InboxFolder />
            <Trash /> 
            <Draft />
            <SentMails />
            <UserFolder />
            <Filter  />
            <SearchSort />   
        </div>
        <div className="space">


        </div>
    </>
    )

}
export default HomePage