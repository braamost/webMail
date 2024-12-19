import React, { useEffect, useState } from "react";
import HomePage from "../homePage/homePage";
import { getEmails } from "../getEmails/getEmails";
import { getUserForTab, getTabId } from "../SessionManager";
const EmailFolderComponent = ({ user: propUser, folderName, handleLogout }) => {
  const [error, setError] = useState("");
  const [emails, setEmails] = useState(() => {
    // Initialize from sessionStorage if available
    const savedEmails = sessionStorage.getItem(`emails_${getTabId()}`);
    return savedEmails ? JSON.parse(savedEmails) : [];
  });
  
  const user = propUser || getUserForTab();

  useEffect(() => {
    let mounted = true;

    if (user?.id) {
      const fetchEmails = async () => {
        try {
          if (mounted) {
            const fetchedEmails = await getEmails(folderName, user);
            setEmails(fetchedEmails);
            // Store emails with tab ID to keep them separate
            sessionStorage.setItem(`emails_${getTabId()}`, JSON.stringify(fetchedEmails));
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
  }, [folderName, user]);  // Remove setEmails from dependencies

  return (
    <HomePage
      emails={emails}
      setEmails={setEmails}
      user={user}
      error={error}
      setError={setError}
      handleLogout={handleLogout}
    />
  );
};

export default EmailFolderComponent;
