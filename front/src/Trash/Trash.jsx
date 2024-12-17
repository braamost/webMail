import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getEmails } from "../getEmails/getEmails";
import "../homePage/HomePage.css";
import HomePage from "../homePage/homePage";
function Trash({ user }) {
  const [emails, setEmails] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const fetchedEmails = await getEmails("TRASH");
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
      <div className="menu-bar"></div>
    </>
  );
}
export default Trash;
