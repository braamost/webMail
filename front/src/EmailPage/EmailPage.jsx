import React from "react";
import { IoArrowBack, IoTrash, IoStar, IoArchive, IoWarning } from "react-icons/io5";
import AttachmentCard from "./AttachmentCard.jsx";
import { handleIconClick, MovetoFolder } from "../EmailTable/TableHandlers.jsx";
import { useState } from "react";
import Toast from "../components/Toast";

const EmailPage = ({ email, callback, setEmails, setError }) => {
  const { emailOfSender, sentAt, subject, body } = email;
  const [starred, setStarred] = useState(email.isStarred);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

  const onBackClick = () => {
    callback(false);
  };

  const handleAction = async (action, email) => {
    try {
      await handleIconClick(action, email, setError, setEmails);
      setToast({
        isVisible: true,
        message: `Email ${action} successfully`,
        type: 'success'
      });
      if (action === 'starred') {
        setStarred(!starred);
      }
    } catch (error) {
      setToast({
        isVisible: true,
        message: `Failed to ${action} email`,
        type: 'error'
      });
    }
  };

  return (
    <div className="w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen py-8 px-2">
      <div className="w-full max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={onBackClick}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <IoArrowBack className="w-5 h-5" />
            <span>Back to Inbox</span>
          </button>
          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleAction("starred", email)}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                starred 
                  ? "text-yellow-500 hover:bg-yellow-50" 
                  : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-50"
              }`}
              title={starred ? "Remove from favorites" : "Add to favorites"}
            >
              <IoStar className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleAction("archive", email)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              title="Archive"
            >
              <IoArchive className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleAction("spam", email)}
              className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors duration-200"
              title="Mark as spam"
            >
              <IoWarning className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                handleAction("trash", email);
                callback(false);
              }}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
              title="Delete"
            >
              <IoTrash className="w-5 h-5" />
            </button>
          </div>
        </div>
        {/* Email Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8">
          {/* Email Header */}
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{subject || "No Subject"}</h1>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div>
                <span className="font-medium">From: </span>
                <span>{emailOfSender}</span>
              </div>
              <div>
                <span className="font-medium">Date: </span>
                <span>{new Date(sentAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
          {/* Email Body */}
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
              {body || "No content"}
            </div>
          </div>
          {/* Attachments */}
          {email.processedAttachments && email.processedAttachments.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <AttachmentCard attachments={email.processedAttachments} />
            </div>
          )}
        </div>
        {/* Toast Notifications */}
        <Toast
          isVisible={toast.isVisible}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, isVisible: false })}
        />
      </div>
    </div>
  );
};

export default EmailPage;
