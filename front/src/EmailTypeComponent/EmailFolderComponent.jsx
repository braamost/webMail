import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import HomePage from '../homePage/homePage';
import { getEmails } from '../getEmails/getEmails';

const EmailFolderComponent = ({ user, emails, setEmails, folderName }) => {
  const [error, setError] = useState("");
  const location = useLocation();

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const fetchedEmails = await getEmails(folderName);
        setEmails(fetchedEmails);
      } catch (err) {
        setError(err.message);
        console.error(err);
      }
    };

    fetchEmails();
  }, [folderName, location.pathname]); // Re-fetch when folder or route changes

  return (
    <>
      <HomePage emails={emails} setEmails={setEmails} user={user} error={error} setError={setError}/>
    </>
  );
};

export default EmailFolderComponent;