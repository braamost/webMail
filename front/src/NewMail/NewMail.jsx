import { useEafect, useRef, useState } from "react";
import "./newMail.css";
import { emailCreation } from "./EmailCreationHandling/EmailCreation";
import { saveDraft, updateDraft, deleteDraft } from "../Draft/REST.jsx"; // New functions
import { useNavigate } from "react-router-dom";
import { handleFileSelection } from "./AttachmentHandling/HandleFileSelection";
import { uploadAttachments } from "./AttachmentHandling/upload";
import AttachmentDisplay from './AttachmentDisplay/AttachmentDisplay.jsx'; 
function NewMail({ 
  user, 
  setIsNewMail, 
  toMail: propToMail = "", 
  subject: propSubject = "", 
  message: propMessage = "", 
  draftId : propDraft = ""
}) {
  const [toMail, setToMail] = useState(propToMail);
  const [subject, setSubject] = useState(propSubject);
  const [message, setMessage] = useState(propMessage);
  const [draftId, setDraftId] = useState(null);
  const [error, setError] = useState("");
  const attachments = useRef(null);
  const navigate = useNavigate();
  const [attachedFiles, setAttachedFiles] = useState([]);

  const handleDeleteAttachment = (indexToRemove) => {
    setAttachedFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));

    if (attachments.current) {
      const files = Array.from(attachments.current.getAll('files'));
      files.splice(indexToRemove, 1);

      const newFormData = new FormData();
      files.forEach(file => newFormData.append('files', file));

      attachments.current = newFormData;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailID1 = await emailCreation(user.id, toMail, subject, message, "GENERAL", "SENT", setError);
    const emailID2 = await emailCreation(user.id, toMail, subject, message, "GENERAL", "RECEIVED", setError);
    
    let attachmentResponse = null;
    let withAttachment = false;

    if (attachments.current != null) {
      attachments.current.append('emailId', emailID1);
      attachmentResponse = await uploadAttachments(attachments.current, setError);
      attachments.current.set('emailId', emailID2);
      attachmentResponse = await uploadAttachments(attachments.current, setError);
      withAttachment = true;
    }

    if (emailID2 != null && (!withAttachment || attachmentResponse != null)) {
      setError("");
      setIsNewMail(false);
      window.alert("Email sent successfully!");
      navigate("/InboxFolder");
      if (draftId) {
        await deleteDraft(draftId);
      }
    }
  };

  const saveOrUpdateDraft = async () => {
    const isEmpty = !toMail && !subject && !message && attachedFiles.length === 0;
    if (isEmpty) {
      return;
    } 
      const newDraftId = await saveDraft(toMail, subject, message, attachedFiles, user);    
  };

  return (
    <>
      <div className="form-container">
        <button className="exitButton" onClick={() => { 
          saveOrUpdateDraft(); 
          setIsNewMail(false); 
        }}>✕</button>

        <div>
          <label>From:</label>
          <input type="email" value={user.email} readOnly style={{ color: "gray" }} />
        </div>
        <div>
          <label>To:</label>
          <input type="email" value={toMail} onChange={(e) => setToMail(e.target.value)} placeholder="TO: " />
        </div>
        <div>
          <label>Subject:</label>
          <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject: " />
          <label>Body:</label>
          <textarea placeholder="Message..." rows={8} cols={48} value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
          <AttachmentDisplay attachments={attachedFiles} onDeleteAttachment={handleDeleteAttachment} />
          <button onClick={(e) => handleFileSelection(e, attachments, setAttachedFiles)} className="newMailButton">Upload Files</button>
          <button onClick={handleSubmit} type="submit" className="newMailButton">Send</button>
          {error && <div className="error-message">{error}</div>}
        </div>
      </div>
    </>
  );
}

export default NewMail;
