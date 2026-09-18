import { useEffect, useRef, useState } from "react";
import { emailCreation } from "./EmailCreationHandling/EmailCreation";
import { saveDraft, updateDraft, deleteDraft } from "../Draft/REST.jsx"; // New functions
import { useNavigate } from "react-router-dom";
import { handleFileSelection } from "./AttachmentHandling/HandleFileSelection";
import { uploadAttachments } from "./AttachmentHandling/upload";
import AttachmentDisplay from './AttachmentDisplay/AttachmentDisplay.jsx';
import { FaTimes, FaPaperclip, FaPaperPlane, FaSave } from "react-icons/fa";
import Toast from "../components/Toast";
import Loading from "../components/Loading"; 
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
  const [draftId, setDraftId] = useState(propDraft);
  const [error, setError] = useState("");
  const attachments = useRef(null);
  const navigate = useNavigate();
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });
  
  useEffect(() => {
    setDraftId(propDraft);
  }, [propDraft]);
  
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
    setIsLoading(true);
    setError("");
    
    try {
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
        setToast({
          isVisible: true,
          message: 'Email sent successfully!',
          type: 'success'
        });
        
        if (draftId) {
          await deleteDraft(draftId, user.id);
        }
        
        setTimeout(() => {
          setIsNewMail(false);
          navigate("/InboxFolder");
        }, 1500);
      } else {
        setToast({
          isVisible: true,
          message: 'Failed to send email. Please try again.',
          type: 'error'
        });
      }
    } catch (err) {
      setToast({
        isVisible: true,
        message: 'An error occurred while sending the email.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveOrUpdateDraft = async () => {
    const isEmpty = !toMail && !subject && !message && attachedFiles.length === 0;
    if (isEmpty) {
      return;
    } 
      console.log("Draft ID:", draftId);  
      if (draftId) {
      const newDraftId = await updateDraft(draftId,toMail, subject, message, attachedFiles);    
      } else {
        const newDraftId = await saveDraft(toMail, subject, message, attachedFiles, user);    
      }
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => {
        saveOrUpdateDraft();
        setIsNewMail(false);
      }}></div>
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[url('/img.jpg')] bg-cover bg-center">
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 w-full max-w-3xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-blue-700">Compose Email</h2>
            <button 
              onClick={() => { 
                saveOrUpdateDraft(); 
                setIsNewMail(false); 
              }}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">From</label>
                <input 
                  type="email" 
                  value={user.email} 
                  readOnly 
                  className="w-full px-4 py-2 border border-blue-200 rounded-lg bg-blue-50 text-blue-400 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">To</label>
                <input 
                  type="email" 
                  value={toMail} 
                  onChange={(e) => setToMail(e.target.value)} 
                  placeholder="recipient@example.com" 
                  className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-blue-900"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">Subject</label>
              <input 
                type="text" 
                value={subject} 
                onChange={(e) => setSubject(e.target.value)} 
                placeholder="Enter subject..." 
                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-blue-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">Message</label>
              <textarea 
                placeholder="Type your message here..." 
                rows={8} 
                value={message} 
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-blue-900 resize-none"
              />
            </div>
            {/* Attachments */}
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">Attachments</label>
              <AttachmentDisplay attachments={attachedFiles} onDeleteAttachment={handleDeleteAttachment} />
              <button 
                type="button"
                onClick={(e) => handleFileSelection(e, attachments, setAttachedFiles)} 
                className="mt-2 px-4 py-2 bg-blue-200 text-blue-800 rounded-lg shadow hover:bg-blue-400 transition-colors duration-200 flex items-center space-x-2"
              >
                <FaPaperclip className="w-4 h-4" />
                <span>Add Files</span>
              </button>
            </div>
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
              <button 
                type="button"
                onClick={() => {
                  saveOrUpdateDraft();
                  setIsNewMail(false);
                }}
                className="px-4 py-2 bg-blue-200 text-blue-800 rounded-lg shadow hover:bg-blue-400 transition-colors duration-200 flex items-center space-x-2"
                disabled={isLoading}
              >
                <FaSave className="w-4 h-4" />
                <span>Save Draft</span>
              </button>
              <button 
                type="submit" 
                disabled={isLoading || !toMail.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loading size="sm" text="" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="w-4 h-4" />
                    <span>Send</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Toast Notifications */}
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </>
  );
}

export default NewMail;
