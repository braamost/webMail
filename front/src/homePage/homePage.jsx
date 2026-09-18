
import MenuBar from "../MenuBar/MenuBar";
import EmailTable from "../EmailTable/EmailTable.jsx";
import { useState } from "react";
import EmailPage from "../EmailPage/EmailPage.jsx";

function HomePage({ emails, setEmails, user, error, setError, handleLogout }) {
  const [emailPage, setEmailPage] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState({});
  const [showMenuBar, setShowMenuBar] = useState(false); // for mobile toggle

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/img.jpg')] bg-cover bg-center">
      {/* Desktop sidebar */}
      <div className="hidden lg:block h-screen">
        <MenuBar user={user} handleLogout={handleLogout} />
      </div>
      {/* Mobile menu toggle button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-30 p-2 bg-white rounded-lg shadow-md"
        onClick={() => setShowMenuBar(true)}
        aria-label="Open menu"
      >
        <span className="sr-only">Open menu</span>
        <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {/* Mobile overlay menu */}
      {showMenuBar && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="w-64 bg-white/90 shadow-xl h-full">
            <MenuBar user={user} handleLogout={handleLogout} onLinkClick={() => setShowMenuBar(false)} />
          </div>
          <div className="flex-1 bg-black bg-opacity-30" onClick={() => setShowMenuBar(false)} />
        </div>
      )}
      {/* Main content */}
      <div className="flex-1 flex flex-col p-2 md:p-6 transition-all duration-300">
        <div className="flex flex-col flex-grow rounded-2xl bg-white shadow-lg border border-blue-100 p-2 md:p-6 transition-all duration-300 min-h-0">
          {emailPage ? (
            <EmailPage
              email={selectedEmail}
              callback={setEmailPage}
              setEmails={setEmails}
              setError={setError}
            />
          ) : (
            <EmailTable
              emails={emails}
              setEmails={setEmails}
              setError={setError}
              callback={setEmailPage}
              FuncEmailPage={setSelectedEmail}
              user={user}
            />
          )}
        </div>
      </div>
    </div>
  );
}
export default HomePage;
