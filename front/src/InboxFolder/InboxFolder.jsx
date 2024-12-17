import { Link } from "react-router-dom";
import { getEmails } from "../getEmails/getEmails.jsx";
import { useEffect, useState } from "react";
import HomePage from "../homePage/homePage";
function InboxFolder({ user }) {
  const [emails, setEmails] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const fetchedEmails = await getEmails("INBOX");
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
      <HomePage emails={emails} user={user} error={error} />
    </>
  );
}
export default InboxFolder;
