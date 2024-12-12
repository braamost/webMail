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

  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');

  return (
    <>
      {/* <SignUp/> */}
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignUp setIsLogin={setIsLogin} setError={setError} error={error}/>} /> 
        <Route path='/Register' element={<Register setIsLogin={setIsLogin} setError={setError}/>} /> //2
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
