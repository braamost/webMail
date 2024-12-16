import { Link } from "react-router-dom"
import { useEffect } from "react";
import HomePage from "../homePage/homePage"
//import { getEmails } from "../getEmails/getEmails";
function InboxFolder ({emails}){
  // Fetch emails when component mounts

  /*useEffect(() => {
    emails=getEmails("INBOX");
  }, []);*/
    
    return (
    <>
        <HomePage emails={emails}/>
    </>
    )
}
export default InboxFolder