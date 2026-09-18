import React from "react";
import {
  FaPaperclip,
  FaFileAlt,
  FaFileImage,
  FaFilePdf,
  FaDownload,
} from "react-icons/fa";

const getFileIcon = (fileType) => {
  if (fileType.includes("pdf"))
    return <FaFilePdf className="text-blue-600 text-2xl" />;
  if (fileType.includes("image"))
    return <FaFileImage className="text-blue-400 text-2xl" />;
  return <FaFileAlt className="text-blue-300 text-2xl" />; // Generic fallback for unknown files
};

//const size = 1024 * 1024; // 1 MB

const formatFileSize = (size) => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
};

const AttachmentCard = ({ attachments = [] }) => {
  return (
    <div className="flex flex-wrap gap-4 p-4 bg-white rounded-lg shadow-md border border-blue-100">
      {attachments.length > 0 ? (
        attachments.map((file, index) => {
          const isValidFile = file instanceof Blob || file instanceof File;
          return (
            <div
              className="flex items-center gap-3 bg-blue-50 hover:bg-blue-100 transition-colors rounded-lg px-4 py-2 shadow-sm border border-blue-200 min-w-[220px] max-w-xs w-fit"
              key={index}
            >
              {getFileIcon(file.type || "generic")}
              <div className="flex flex-col flex-1 min-w-0">
                <span
                  className="truncate font-medium text-blue-900 text-sm"
                  title={file.name || "Unknown File"}
                >
                  {file.name || "Unnamed File"}
                </span>
                <span className="text-xs text-blue-500">
                  {file.size ? formatFileSize(file.size) : "Unknown Size"}
                </span>
              </div>
              {isValidFile ? (
                <a
                  href={URL.createObjectURL(file)}
                  download={file.name}
                  className="ml-2 p-2 rounded-full bg-blue-200 hover:bg-blue-400 transition-colors text-blue-800"
                  title="Download File"
                >
                  <FaDownload className="text-lg" />
                </a>
              ) : (
                <span className="text-red-500 text-xs font-semibold ml-2">Invalid File</span>
              )}
            </div>
          );
        })
      ) : (
        <div className="flex flex-col items-center justify-center w-full py-8">
          <FaPaperclip className="text-3xl text-blue-300 mb-2" />
          <span className="text-blue-400 font-semibold">No Attachments</span>
        </div>
      )}
    </div>
  );
};

export default AttachmentCard;
