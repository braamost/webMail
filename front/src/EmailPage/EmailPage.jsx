import React from "react";
import { IoArrowBack, IoTrash, IoStar } from "react-icons/io5"; // Back, Trash, and Favorite icons
import "./EmailPage.css";
import AttachmentCard from "./AttachmentCard.jsx";
import { handleIconClick, MovetoFolder } from "../EmailTable/TableHandlers.jsx";
import { useState } from "react";

const EmailPage = ({ email, callback, setEmails, setError }) => {
  const { emailOfSender, sentAt, subject, body } = email;
  const [starred, setStarred] = useState(email.isStarred);

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
            className={`icon${starred ? "starred" : ""}`}
            title="Favorite"
            onClick={() => {
              handleIconClick("starred", email, setError, setEmails);
              setStarred(!starred);
            }}
          />
          <IoTrash
            className="icon"
            title="Delete"
            onClick={() => {
              handleIconClick("trash", email, setError, setEmails);
              callback(false);
            }}
          />
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
