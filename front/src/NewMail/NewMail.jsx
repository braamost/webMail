import { useRef, useState } from "react";
import "./newMail.css";
import { emailCreation } from "./EmailCreationHandling/EmailCreation";
import { useNavigate } from "react-router-dom";
import { handleFileSelection } from "./AttachmentHandling/HandleFileSelection";
import { uploadAttachments } from "./AttachmentHandling/upload";
function NewMail({ user, setIsNewMail }) {
  const [toMail, setToMail] = useState("");
  const [fromMail, setFromMail] = useState("");
  const [subject, setSubject] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const attachments = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailID1 = await emailCreation(
      user.id,
      toMail,
      subject,
      message,
      "GENERAL",
      "SENT",
      setError
    );
    const emailID2 = await emailCreation(
      user.id,
      toMail,
      subject,
      message,
      "GENERAL",
      "RECEIVED",
      setError
    );
    let attachmentResponse = null;
    let withAttachment = false;
    if(attachments.current != null){
      attachments.current.append('emailId', emailID1);
      attachmentResponse = await uploadAttachments(attachments.current, setError);
      attachments.current.set('emailId', emailID2);
      attachmentResponse = await uploadAttachments(attachments.current,setError);
      withAttachment = true;
    }
    
    if (emailID2 != null && (!withAttachment || attachmentResponse != null)) {
      setError("");
      setIsNewMail(false);
      window.alert("Email sent successfully!");
      navigate("/InboxFolder");
    }
  };

  return (
    <>
      <div className="form-container">
        <div>
          <ion-icon name="mail-outline"></ion-icon>
          <label htmlFor="FromMail">From:</label>
          <input
            type="email"
            required
            value={user.email}
            onChange={(e) => setFromMail(e.target.value)}
            placeholder={user.email}
            style={{ color: "gray"}}
            readOnly
          />
        </div>
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
          <label htmlFor="subject">subject:</label>
          <input
            type="text"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="subject: "
          />
          <label htmlFor="body">body:</label>
          <textarea
            placeholder="Message..."
            rows={8}
            cols={48}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          <button onClick={(e) => handleFileSelection(e, { attachments })} className="newMailButton">Upload Files</button>
          <button onClick={handleSubmit} type="submit" className="newMailButton">Send</button>
          {error && <div className="error-message">{error}</div>}
        </div>
      </div>
    </>
  );
}
export default NewMail;
