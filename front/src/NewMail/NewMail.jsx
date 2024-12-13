import { useState } from "react";
import "./newMail.css"
import { createEmail } from "../Email/EmailRest";
function NewMail(){
    const [toMail, setToMail] = useState("");
    const [fromMail, setFromMail] = useState("");
    const [subject, setSubject] = useState("");
    const [error , setError] = useState("");
    const [message, setMessage] = useState("");

    const handleCreateEmail = async (e) => {
        e.preventDefault();
        console.log(message);
        const response = await createEmail(5,toMail,subject,message, true , "INBOX");
        if(response!=null){
          console.log(response);
          navigate("/Home");
        }
      };

    return(
        <>
        <form onSubmit={handleCreateEmail} className="form-container" >
            <div >
                <ion-icon name="mail-outline"></ion-icon>
                <label htmlFor="toMail">TO:</label>
                <input 
                  type="email" 
                  required 
                  value={toMail}
                  onChange={(e) => setToMail(e.target.value)}
                  placeholder="TO: "
                />
                
              </div>
              <div>
              <ion-icon name="mail-outline"></ion-icon>
              <label htmlFor="FromMail">From:</label>
              <input 
                type="email" 
                required 
                value={fromMail}
                onChange={(e) => setFromMail(e.target.value)}
                placeholder="From: "
              />
              
            </div>
            <div>
            <ion-icon name="mail-outline"></ion-icon>
            <label htmlFor="subject">subject:</label>
            <input 
              type="text" 
              required 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="subject: "
            />
          <textarea placeholder="Message..." rows={8} cols= {48} value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
          <button type="submit">Send</button>
          {error}
          </div>
          
          </form>
          </>
    )
    
}
export default NewMail;