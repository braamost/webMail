import "./HomePage.css";

import MenuBar from "../MenuBar/MenuBar";
import EmailTable from "../EmailTable/EmailTable.jsx";
import { useState } from "react";
import EmailPage from "../EmailPage/EmailPage.jsx";

function HomePage({ emails, setEmails, user, error, setError, handleLogout }) {
  const [emailPage, setEmailPage] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState({});

  return (
    <>
      <div className="pagecontent">
        {emailPage ? (
          <EmailPage
            email={selectedEmail}
            callback={setEmailPage}
            setEmails={setEmails}
            setError={setError}
          />
        ) : (
          <>
            <EmailTable
              emails={emails}
              setEmails={setEmails}
              setError={setError}
              callback={setEmailPage}
              FuncEmailPage={setSelectedEmail}
            />
          </>
        )}
        <MenuBar user={user} handleLogout={handleLogout} />
      </div>
    </>
  );
}
export default HomePage;
