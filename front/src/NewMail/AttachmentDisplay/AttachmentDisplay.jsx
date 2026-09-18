

import { FaFileAlt, FaFileImage, FaFilePdf, FaTrash } from "react-icons/fa";

const getFileIcon = (fileName) => {
  const ext = fileName.split('.').pop().toLowerCase();
  if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext))
    return <FaFileImage className="text-blue-400 text-xl" />;
  if (["pdf"].includes(ext))
    return <FaFilePdf className="text-blue-600 text-xl" />;
  return <FaFileAlt className="text-blue-300 text-xl" />;
};

const AttachmentDisplay = ({ attachments, onDeleteAttachment }) => {
  return (
    <div className="flex flex-wrap gap-3 p-2 bg-white rounded-lg border border-blue-100 shadow-sm">
      {attachments.map((file, index) => (
        <div
          key={index}
          className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 transition-colors rounded-lg px-3 py-1 shadow border border-blue-200 min-w-[120px] max-w-xs w-fit"
        >
          {getFileIcon(file.name)}
          <span className="truncate font-medium text-blue-900 text-xs max-w-[80px]" title={file.name}>
            {file.name}
          </span>
          <button
            onClick={() => onDeleteAttachment(index)}
            className="ml-1 p-1 rounded-full bg-blue-200 hover:bg-blue-400 transition-colors text-blue-800"
            title="Remove attachment"
          >
            <FaTrash className="text-xs" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default AttachmentDisplay;