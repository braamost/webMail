import React from "react";
import { IoArrowBack, IoTrash, IoStar } from "react-icons/io5"; // Back, Trash, and Favorite icons
import "./EmailPage.css";
import AttachmentCard from "./AttachmentCard.jsx";
import { handleIconClick } from "../EmailTable/TableHandlers.jsx";

const EmailPage = ({ email, callback }) => {
  const { emailOfSender, sentAt, subject, body } = email;

  const onBackClick = () => {
    callback(false);
  };

  return (
    <div className="email-container">
      {/* Back Icon */}
      <div className="email-header">
        <button className="back-btn" onClick={onBackClick}>
          <IoArrowBack />
        </button>
      </div>

      {/* Sender Row: Email Sender, SentAt, Trash & Favorite Icons */}
      <div className="email-sender-row">
        <div className="email-sender">{emailOfSender}</div>

        <div className="email-sender-info">
          <span className="send-at">{sentAt}</span>
          <IoStar
            className="icon"
            title="Favorite"
            onClick={() => handleIconClick("starred", email, callback)}
          />
          <IoTrash className="icon" title="Delete" onClick={() => handleIconClick("trash", email, callback)} />
        </div>
      </div>

      {/* Email Content */}
      <div className="email-content">
        <div className="email-subject">
          <h2>{subject}</h2>
        </div>
        <div className="email-body">
          <p>{body}</p>
        </div>
      </div>
      <AttachmentCard attachments={email.processedAttachments} />
    </div>
  );
};

export default EmailPage;
