import "./HomePage.css" 
import { Link } from "react-router-dom";
import Draft from "../Draft/Draft";
import InboxFolder from "../InboxFolder/InboxFolder";
import Trash from "../Trash/Trash";
import SentMails from "../SentMails/SentMails";
import UserFolder from "../UserFolder/UserFolder";
import Filter from "../Filter/Filter";
import SearchSort from "../SearchAndSort/SearchAndSort";
//import EmailTable from "../EmailTable/EmailTable";
import MenuBar from "../MenuBar/MenuBar";
import SearchBar from "../SearchAndSort/SearchBar";
import EmailTable from "../IsTable/EmailTable";
import {MocData} from "../MocData.jsx"
import { useState } from "react";
import EmailPage from "../EmailPage/EmailPage.jsx";

function HomePage({emails , user}){
    const [emailPage ,setEmailPage] = useState(false);
    const [selectedEmail, setSelectedEmail] = useState({});


      const StoringEmailSelected = (email) => {
        setSelectedEmail(email);
      }
    return (
        <>
        <div className="pagecontent">
          {emailPage ? (
            <EmailPage email={selectedEmail} callback={setEmailPage} />
          ) : (
            <>
              <SearchBar />
              <EmailTable emails={MocData} callback={setEmailPage} FuncEmailPage={StoringEmailSelected}/>
            </>
          )}
          <MenuBar user={user} />
        </div>
      </>
    )

}
export default HomePage