import React, { useState } from 'react';
import './AttachmentDisplay.css'; 

const AttachmentDisplay = ({ attachments, onDeleteAttachment }) => {
    console.log("AttachmentDisplaly")
  // Convert attachments FormData to an array of files
  

  return (
    <div className="attachment-container">
      {attachments.map((file, index) => (
        <div 
          key={index} 
          className="attachment-icon"
        >
          {/* File type icon or default */}
          <div className="attachment-file-type">
            {file.name.split('.').pop().toUpperCase()}
          </div>
          
          {/* Delete button */}
          <button 
            onClick={() => onDeleteAttachment(index)}
            className="attachment-delete-btn"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export default AttachmentDisplay;