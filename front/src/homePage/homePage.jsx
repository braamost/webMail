import "./HomePage.css";

import MenuBar from "../MenuBar/MenuBar";
import SearchBar from "../SearchAndSort/SearchBar";
import EmailTable from "../EmailTable/EmailTable.jsx";
import { MocData } from "../MocData.jsx";
import { useState } from "react";
import EmailPage from "../EmailPage/EmailPage.jsx";

function HomePage({ emails, user, error }) {
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
            <SearchBar />
            <EmailTable
              emails={emails}
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
