import { Link } from "react-router-dom"
import { useEffect } from "react";
import HomePage from "../homePage/homePage"
function InboxFolder ({emails, user}){
  // Fetch emails when component mounts

  /*useEffect(() => {
    emails=getEmails("INBOX");
  }, []);*/
    
    return (
    <>
        <HomePage emails={emails} user={user}/>
    </>
    )
}
export default InboxFolder