import { Link } from "react-router-dom";
import HomePage from "../homePage/homePage";
import { useState, useEffect } from "react";
import { getEmails } from "../getEmails/getEmails";
function SentMails({ user }) {
  const [emails, setEmails] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const fetchedEmails = await getEmails("SENT");
        setEmails(fetchedEmails);
      } catch (err) {
        setError(err.message);
        console.error(err);
      }
    };

    fetchEmails();
  }, []);
  return (
    <>
      <HomePage emails={emails} user={user} error={error}/>
    </>
  );
}
export default SentMails;
