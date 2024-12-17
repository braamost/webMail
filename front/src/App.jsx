
import { BrowserRouter, Routes,Route } from 'react-router-dom'
import Draft from './Draft/Draft.jsx'
import Filter from './Filter/Filter.jsx'
import Trash from './Trash/Trash.jsx'
import InboxFolder from './InboxFolder/InboxFolder.jsx'
import SentMails from './SentMails/SentMails.jsx'
import UserFolder from './UserFolder/UserFolder.jsx'
import Register from './RegisterHandling/RegisterPage.jsx'
import { useEffect, useState } from 'react'
import LoginPage from './LoginHandling/Login.jsx'                       
import { MocData } from './MocData.jsx'




function App() {
  const [user , setUser] = useState("")
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [])

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage setUser={setUser}/>} /> 
        <Route path='/Register' element={<Register />} /> 
        <Route path="/Draft" element={ <Draft  user={user}/>} />
        <Route path="/Filter" element={ <Filter  user={user}/>} />
        <Route path="/SentMails" element={ <SentMails  user={user}/>} />
        <Route path="/Trash" element={ <Trash  user={user}/>} />
        <Route path="/InboxFolder" element={ <InboxFolder  user={user}/>} />
        <Route path="/UserFolder" element={ <UserFolder  user={user} />} />
      </Routes>
      </BrowserRouter>
          
    </>
  )
}

export default App
