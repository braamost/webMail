import "./HomePage.css";

import MenuBar from "../MenuBar/MenuBar";
import EmailTable from "../EmailTable/EmailTable.jsx";
import { MocData } from "../MocData.jsx";
import { useState } from "react";
import EmailPage from "../EmailPage/EmailPage.jsx";

function HomePage({ emails, user, error, setError }) {
  const [emailPage, setEmailPage] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState({});

  const StoringEmailSelected = (email) => {
    setSelectedEmail(email);
  };
  return (
    <>
      <div className="pagecontent">
        {emailPage ? (
          <EmailPage email={selectedEmail} callback={setEmailPage} />
        ) : (
          <>
            <EmailTable
              emails={emails}
              setError={setError}
              callback={setEmailPage}
              FuncEmailPage={StoringEmailSelected}
            />
          </>
        )}
        <MenuBar user={user} />
      </div>
    </>
  );
}
export default HomePage;
