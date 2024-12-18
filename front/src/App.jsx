
import { BrowserRouter, Routes,Route } from 'react-router-dom'
import UserFolder from './UserFolder/UserFolder.jsx'
import EmailFolderComponent from './EmailTypeComponent/EmailFolderComponent.jsx'
import Register from './RegisterHandling/RegisterPage.jsx'
import { useEffect, useState } from 'react'
import LoginPage from './LoginHandling/Login.jsx'                       
import { MocData } from './MocData.jsx'




function App() {
  const [user , setUser] = useState("")
  const [emails, setEmails] = useState([]);
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage setUser={setUser} />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/InboxFolder" element={<EmailFolderComponent user={user} emails={emails} setEmails={setEmails} folderName="INBOX"/>}/>
        <Route path="/Draft" element={<EmailFolderComponent user={user} emails={emails} setEmails={setEmails} folderName="DRAFT"/>}/>
        <Route path="/Trash" element={<EmailFolderComponent user={user} emails={emails} setEmails={setEmails} folderName="TRASH"/>}/>
        <Route path="/SentMails" element={<EmailFolderComponent user={user} emails={emails} setEmails={setEmails} folderName="SENT"/>}/>
        <Route path="/Starred" element={<EmailFolderComponent user={user} emails={emails} setEmails={setEmails} folderName="STARRED"/>}/>
        <Route path="/Archive" element={<EmailFolderComponent user={user} emails={emails} setEmails={setEmails} folderName="ARCHIVE"/>}/>
        <Route path="/Spam" element={<EmailFolderComponent user={user} emails={emails} setEmails={setEmails} folderName="SPAM"/>}/>
        <Route path="/UserFolder" element={<UserFolder user={user}/>}/>
        {/* Similar pattern for other routes */}
      </Routes>
    </BrowserRouter>
  );
}

export default App
