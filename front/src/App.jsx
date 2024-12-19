import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import UserFolder from "./UserFolder/UserFolder.jsx";
import EmailFolderComponent from "./EmailTypeComponent/EmailFolderComponent.jsx";
import Register from "./RegisterHandling/RegisterPage.jsx";
import { useEffect, useState } from "react";
import LoginPage from "./LoginHandling/Login.jsx";
import MyContacts from "./MyContacts/MyContacts.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import {
  getUserForTab,
  setUserForTab,
  removeUserForTab,
  getTabId,
} from "./SessionManager";

function App() {
  const [user, setUser] = useState(() => getUserForTab());
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "userSessions") {
        // Only update if the current tab's user has changed
        const currentUser = getUserForTab();
        if (JSON.stringify(currentUser) !== JSON.stringify(user)) {
          setUser(currentUser);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [user]); // Add user as dependency

  const handleSetUser = (userData) => {
    setUserForTab(userData);
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    removeUserForTab();
    // Clear tab-specific data
    sessionStorage.removeItem(`emails_${getTabId()}`);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage setUser={handleSetUser} />} />
        <Route path="/Register" element={<Register setUser={setUser} />} />
        <Route
          path="/InboxFolder"
          element={
            <ProtectedRoute user={user}>
              <EmailFolderComponent
                user={user}
                folderName="INBOX"
                handleLogout={handleLogout}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Trash"
          element={
            <ProtectedRoute user={user}>
              <EmailFolderComponent
                user={user}
                folderName="TRASH"
                handleLogout={handleLogout}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/SentMails"
          element={
            <ProtectedRoute user={user}>
              <EmailFolderComponent
                user={user}
                folderName="SENT"
                handleLogout={handleLogout}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Starred"
          element={
            <ProtectedRoute user={user}>
              <EmailFolderComponent
                user={user}
                folderName="STARRED"
                handleLogout={handleLogout}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Archive"
          element={
            <ProtectedRoute user={user}>
              <EmailFolderComponent
                user={user}
                folderName="ARCHIVE"
                handleLogout={handleLogout}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Spam"
          element={
            <ProtectedRoute user={user}>
              <EmailFolderComponent
                user={user}
                folderName="SPAM"
                handleLogout={handleLogout}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/UserFolder"
          element={
            <ProtectedRoute user={user}>
              <UserFolder user={user} setUser={handleSetUser} handleLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/MyContacts"
          element={
            <ProtectedRoute user={user}>
              <MyContacts
                user={user}
                contacts={contacts}
                handleLogout={handleLogout}
              />
            </ProtectedRoute>
          }
        />
        {/* Similar pattern for other routes */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
