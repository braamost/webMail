
import { BrowserRouter, Routes,Route } from 'react-router-dom'
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
  const emails = [
    {
      id: 1,
      sender: "john@example.com",
      subject: "Meeting Reminder",
      timestamp: "2024-12-12 10:00 AM",
    },
    {
      id: 2,
      sender: "jane@example.com",
      subject: "Project Update",
      timestamp: "2024-12-11 03:00 PM",
    },
    {
        id: 3,
        sender: "hhghj@example.com",
        subject: "Project Update",
        timestamp: "2024-12-11 03:00 PM",
      },
  ];

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignUp />} /> 
        <Route path='/Register' element={<Register/>} /> 
        <Route path="/Home" element={ <HomePage emails={emails}/>} />
        <Route path="/Home/Draft" element={ <Draft emails={emails}/>} />
        <Route path="/Home/Filter" element={ <Filter emails={emails}/>} />
        <Route path="/Home/SentMails" element={ <SentMails emails={emails}/>} />
        <Route path="/Home/Trash" element={ <Trash emails={emails}/>} />
        <Route path="/Home/InboxFolder" element={ <InboxFolder emails={emails}/>} />
        <Route path="/Home/UserFolder" element={ <UserFolder emails={emails}/>} />
      </Routes>
      </BrowserRouter>
          
    </>
  )
}

export default App
