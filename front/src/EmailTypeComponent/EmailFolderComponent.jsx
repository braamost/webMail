import React, { useEffect, useState } from "react";
import HomePage from "../homePage/homePage";
import { getEmails } from "../getEmails/getEmails";
import { getUserForTab } from "../SessionManager";
const EmailFolderComponent = ({
  user: propUser,
  folderName,
  handleLogout
}) => {
  const [error, setError] = useState("");
  const user = propUser || getUserForTab();
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    let mounted = true;

    if (user?.id) {
      const fetchEmails = async () => {
        try {
          if (mounted) {
            const fetchedEmails = await getEmails(folderName, user);
            setEmails(fetchedEmails);
            sessionStorage.setItem("emails", JSON.stringify(fetchedEmails));
          }
        } catch (err) {
          if (mounted) {
            setError(err.message);
            console.error(err);
          }
        }
      };

      fetchEmails();
    }

    return () => {
      mounted = false;
    };
  }, [folderName, user, setEmails]);

  return (
    <HomePage
      emails={emails}
      user={user}
      error={error}
      setError={setError}
      handleLogout={handleLogout}
    />
  );
};

export default EmailFolderComponent;
