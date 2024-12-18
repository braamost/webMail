import React from "react";
import {
  FaPaperclip,
  FaFileAlt,
  FaFileImage,
  FaFilePdf,
  FaDownload,
} from "react-icons/fa";
import "./AttachmentCard.css";

const getFileIcon = (fileType) => {
  if (fileType.includes("pdf"))
    return <FaFilePdf className="attachment-icon-pdf" />;
  if (fileType.includes("image"))
    return <FaFileImage className="attachment-icon-image" />;
  return <FaFileAlt className="attachment-icon-generic" />; // Generic fallback for unknown files
};

//const size = 1024 * 1024; // 1 MB

const formatFileSize = (size) => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
};

const AttachmentCard = ({ attachments = [] }) => {
  return (
    <div className="attachment-container">
      {attachments.length > 0 ? (
        attachments.map((file, index) => {
          const isValidFile = file instanceof Blob || file instanceof File;
          return (
            <div className="attachment-card" key={index}>
              {getFileIcon(file.type || "generic")}
              <div className="attachment-details">
                <span
                  className="attachment-name"
                  title={file.name || "Unknown File"}
                >
                  {file.name || "Unnamed File"}
                </span>
                <span className="attachment-size">
                  {file.size ? formatFileSize(file.size) : "Unknown Size"}
                </span>
              </div>
              {isValidFile ? (
                <a
                  href={URL.createObjectURL(file)} // Generate a temporary download link
                  download={file.name}
                  className="attachment-download"
                  title="Download File"
                >
                  <FaDownload className="download-icon" />
                </a>
              ) : (
                <span className="attachment-error">Invalid File</span>
              )}
            </div>
          );
        })
      ) : (
        <div className="no-attachments">
          <FaPaperclip className="no-attachments-icon" />
          <span className="no-attachments-text">No Attachments</span>
        </div>
      )}
    </div>
  );
};

export default AttachmentCard;
