import { useState } from 'react'
import { BrowserRouter, Routes,Route , Link } from 'react-router-dom'
import SignUp from './signUp/signUp.jsx'
import HomePage from './homePage/homePage.jsx'
import Draft from './Draft/Draft.jsx'
import Filter from './Filter/Filter.jsx'
import Trash from './Trash/Trash.jsx'
import InboxFolder from './InboxFolder/InboxFolder.jsx'
import SentMails from './SentMails/SentMails.jsx'
import UserFolder from './UserFolder/UserFolder.jsx'
import Register from './Register/RegisterPage.jsx'
function App() {

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignUp/>} /> 
        <Route path='/Register' element={<Register/>} /> 
        <Route path="/Home" element={ <HomePage/>} />
        <Route path="/Home/Draft" element={ <Draft/>} />
        <Route path="/Home/Filter" element={ <Filter/>} />
        <Route path="/Home/SentMails" element={ <SentMails/>} />
        <Route path="/Home/Trash" element={ <Trash/>} />
        <Route path="/Home/InboxFolder" element={ <InboxFolder/>} />
        <Route path="/Home/UserFolder" element={ <UserFolder/>} />
      </Routes>
      </BrowserRouter>
          
    </>
  )
}

export default App
