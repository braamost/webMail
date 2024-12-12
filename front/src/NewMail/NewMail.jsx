import { useState } from "react";
import "./newMail.css"
function NewMail(){
    const [toMail, setToMail] = useState("");
    const [fromMail, setFromMail] = useState("");
    const [subject, setSubject] = useState("");
    return(
        <>
        <form className="form-container" >
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
          </div>
          <textarea placeholder="Message..." rows={7} cols= {42}>
          </textarea>
          </form>
          </>
    )
    
}
export default NewMail;