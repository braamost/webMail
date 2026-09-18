import React, { useState, useEffect, useRef } from "react";
import NewMail from "../NewMail/NewMail";
import DataTable from "react-data-table-component";
import {
  FaSearch,
  FaTrash,
  FaStar,
  FaRegStar,
  FaSync,
  FaArchive,
  FaExclamationTriangle,
  FaEnvelope,
  FaEnvelopeOpen,
  FaFilter,
  FaTimes,
} from "react-icons/fa";
import { FaPaperclip } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import {
  handleRefresh,
  formatTimestamp,
  handleIconClick,
  handleSelectedOnClick,
} from "./TableHandlers";
import Loading from "../components/Loading";
import Toast from "../components/Toast";
function EmailTable({ emails, setEmails, setError, callback, FuncEmailPage, user }) {
  const location = useLocation();
  const [inputSearch, setInputSearch] = useState("");
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [hoveredRowId, setHoveredRowId] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchKey, setSearchKey] = useState("sender");
  const [showButtons, setShowButtons] = useState(false);
  const searchBarRef = useRef(null);
  const [isNewMail, setIsNewMail] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [, forceUpdate] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });
  const newMail = (email = null) => {
    setSelectedEmail(email);  
    setIsNewMail(true);
  };
  
  const handleSearchKeyChange = (key) => {
    setSearchKey(key);
    if (searchBarRef.current) {
      searchBarRef.current.focus();
    }
  };
  // Update filteredEmails when emails prop changes
  useEffect(() => {
    if (emails && Array.isArray(emails)) {
      if (inputSearch) {
        if (searchKey === "sender") {
          const filtered = emails.filter((email) =>
            email.emailOfSender
              .toLowerCase()
              .includes(inputSearch.toLowerCase())
          );
          setFilteredEmails(filtered);
        } else if (searchKey === "subject") {
          const filtered = emails.filter((email) =>
            email.subject.toLowerCase().includes(inputSearch.toLowerCase())
          );
          setFilteredEmails(filtered);
        } else if (searchKey === "timestamp") {
          const filtered = emails.filter((email) =>
            email.sentAt.toLowerCase().includes(inputSearch.toLowerCase())
          );
          setFilteredEmails(filtered);
        }
      } else {
        setFilteredEmails(emails);
      }
    } else {
      setFilteredEmails([]);
    }
  }, [emails, inputSearch, searchKey]);

  const columns = [
    {
      name: location.pathname === "/SentMails" ? "Reciever" : "Sender",
      selector: (row) =>
        location.pathname === "/SentMails"
          ? row.emailOfReceiver || "No Reciever"
          : row.emailOfSender || "No Sender",
      sortable: true,
    },
    {
      name: "Subject",
      selector: (row) => row.subject || "No Subject",
      sortable: true,
    },
    {
      name: "Attachments",
      selector: (row) => row.processedAttachments || [],
      cell: (row) => {
        if (!row.processedAttachments || row.processedAttachments.length === 0) {
          return <span>No Attachments</span>;
        }
        return (
          <div className="attachments-cell">
            <span className="attachment-count">
              {row.processedAttachments.length}
              {row.processedAttachments.length === 1 ? " Attachment" : " Attachments"}
            </span>
            <div className="attachment-icons">
              {row.processedAttachments.map((file, index) => (
                <FaPaperclip
                  key={index}
                  className="attachment-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    const downloadLink = document.createElement("a");
                    downloadLink.href = URL.createObjectURL(file);
                    downloadLink.download = file.name;
                    downloadLink.click();
                  }}
                />
              ))}
            </div>
          </div>
        );
      },
      sortable: false,
    },
    {
      name: "Timestamp",
      selector: (row) => row.sentAt,
      sortable: true,
      cell: (row) => (
        <div className="timestamp-cell">
          <span className="timestamp-text">{formatTimestamp(row.sentAt)}</span>
          {hoveredRowId === row.id && (
            <div className="timestamp-icons flex flex-row items-center gap-2">
              {row.isStarred ? (
                <FaStar
                  className="icon-starred"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleIconClick("starred", row, setError, setEmails);
                  }}
                  title="Unstar"
                />
              ) : (
                <FaRegStar
                  className="icon-unstarred"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleIconClick("starred", row, setError, setEmails);
                  }}
                  title="Star"
                />
              )}
              {row.folder === "TRASH" ? (
                <FaTrash
                  className="icon-trash-active"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleIconClick("trash", row, setError, setEmails);
                  }}
                  title="Remove from Trash"
                />
              ) : (
                <FaTrash
                  className="icon-trash"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleIconClick("trash", row, setError, setEmails);
                  }}
                  title="Trash"
                />
              )}
              {row.folder === "SPAM" ? (
                <FaExclamationTriangle
                  className="icon-spam-active"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleIconClick("spam", row, setError, setEmails);
                  }}
                  title="Unmark Spam"
                />
              ) : (
                <FaExclamationTriangle
                  onClick={(e) => {
                    e.stopPropagation();
                    handleIconClick("spam", row, setError, setEmails);
                  }}
                  title="Mark as Spam"
                />
              )}
              {row.folder === "ARCHIVE" ? (
                <FaArchive
                  className="icon-archive-active"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleIconClick("archive", row, setError, setEmails);
                  }}
                  title="Unarchive"
                />
              ) : (
                <FaArchive
                  onClick={(e) => {
                    e.stopPropagation();
                    handleIconClick("archive", row, setError, setEmails);
                  }}
                  title="Archive"
                />
              )}
              {row.isRead ? (
                <FaEnvelopeOpen className="icon-read" title="Read" 
                  onClick={(e) => {
                  e.stopPropagation();
                  handleIconClick("read", row, setError, setEmails);
                  }}/>
              ) : (
                <FaEnvelope className="icon-unread" title="Unread" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleIconClick("read", row, setError, setEmails);
                }}/>
              )}
            </div>
          )}
        </div>
      ),
    },
  ];

  const customStyles = {
    table: {
      style: {
        overflowY: "auto",
        maxHeight: "625px",
      },
    },
    headCells: {
      style: {
        fontFamily: "Georgia, serif",
        backgroundColor: "#d1e0e0",
        fontSize: "18px",
        fontWeight: "bold",
      },
    },
    rows: {
      style: {
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
        minHeight: "50px", // Add minimum height for rows
        padding: "8px 0", // Add some padding
        "&:hover": {
          backgroundColor: "#f0f0f0",
          cursor: "pointer",
        },
      },
    },
    noData: {
      style: {
        padding: "20px",
        textAlign: "center",
        fontSize: "16px",
      },
    },
  };

  const handleOnChange = (value) => {
    setInputSearch(value);
  };

  const handleRowClick = (row, event) => {
    console.log("hey iam clicked the email" , row.folder , "the draft id is : =>>>" , row.id);
   
  if(row.folder == "DRAFT"){
     console.log("this is draft cant be opened");
     setSelectedEmail(row);
     setIsNewMail(false);

     setTimeout(() => {
      setIsNewMail(true);
      forceUpdate({}); // Triggers a re-render
    }, 10);
  }else{
    if (event.target.closest(".timestamp-icons")) {
      return;
    }
    FuncEmailPage(row);
    console.log("Row Data:", row);
    callback(true);
  }
    //handleIconClick("open", row, setError, setEmails);
  };

  const NoDataComponent = () => (
    <div style={{ padding: "24px" }}>No emails found</div>
  );

  const handleSelectedRowsChange = (state) => {
    setSelectedRows(state.selectedRows);
    console.log("Selected Rows:", state.selectedRows);
  };

  return (
  <div className="w-full bg-white/80 rounded-xl shadow-lg p-6 mb-6">
      {/* Header with actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {location.pathname === "/InboxFolder" && "Inbox"}
            {location.pathname === "/SentMails" && "Sent"}
            {location.pathname === "/Starred" && "Starred"}
            {location.pathname === "/Archive" && "Archive"}
            {location.pathname === "/Spam" && "Spam"}
            {location.pathname === "/Trash" && "Trash"}
            {location.pathname === "/Draft" && "Drafts"}
          </h1>
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
            title="Refresh"
          >
            <FaSync className="w-5 h-5" />
          </button>
        </div>

        {/* Bulk Actions */}
        {selectedRows.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {selectedRows.length} selected
            </span>
            <div className="flex space-x-2">
              {location.pathname === "/Starred" ? (
                <button
                  className="btn-secondary text-sm"
                  onClick={() =>
                    handleSelectedOnClick(
                      "starred",
                      selectedRows,
                      setError,
                      setEmails,
                      user.id
                    )
                  }
                >
                  Remove from Favorites
                </button>
              ) : (
                <button
                  className="btn-secondary text-sm"
                  onClick={() =>
                    handleSelectedOnClick(
                      "starred",
                      selectedRows,
                      setError,
                      setEmails,
                      user.id
                    )
                  }
                >
                  Add to Favorites
                </button>
              )}
              
              {location.pathname === "/Trash" ? (
                <>
                  <button
                    className="btn-secondary text-sm"
                    onClick={() =>
                      handleSelectedOnClick(
                        "trash",
                        selectedRows,
                        setError,
                        setEmails,
                        user.id
                      )
                    }
                  >
                    Remove from Trash
                  </button>
                  <button
                    className="btn-danger text-sm"
                    onClick={() => {
                      handleSelectedOnClick(
                        "permanent-delete",
                        selectedRows,
                        setError,
                        setEmails,
                        user.id
                      );
                      setSelectedRows([]);
                    }}
                  >
                    Delete Permanently
                  </button>
                </>
              ) : (
                <button
                  className="btn-secondary text-sm"
                  onClick={() =>
                    handleSelectedOnClick(
                      "trash",
                      selectedRows,
                      setError,
                      setEmails,
                      user.id
                    )
                  }
                >
                  Add to Trash
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            ref={searchBarRef}
            type="text"
            className="input-field pl-10 pr-4"
            placeholder="Search emails..."
            onFocus={() => setShowButtons(true)}
            onBlur={(e) => {
              if (!e.target.value) setShowButtons(false);
            }}
            onChange={(e) => handleOnChange(e.target.value)}
            value={inputSearch}
          />
        </div>

        {/* Search Filters */}
        {showButtons && (
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                searchKey === "sender"
                  ? "bg-primary-100 text-primary-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => handleSearchKeyChange("sender")}
            >
              {location.pathname === "/SentMails" ? "Receiver" : "Sender"}
            </button>
            <button
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                searchKey === "subject"
                  ? "bg-primary-100 text-primary-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => handleSearchKeyChange("subject")}
            >
              Subject
            </button>
            <button
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                searchKey === "timestamp"
                  ? "bg-primary-100 text-primary-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => handleSearchKeyChange("timestamp")}
            >
              Date
            </button>
          </div>
        )}
      </div>

      {/* Email Table */}
      <div className="email-table">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loading size="lg" text="Loading emails..." />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredEmails}
            customStyles={customStyles}
            onRowClicked={handleRowClick}
            onRowMouseEnter={(row) => setHoveredRowId(row.id)}
            onRowMouseLeave={() => setHoveredRowId(null)}
            noDataComponent={<NoDataComponent />}
            fixedHeader
            selectableRows
            onSelectedRowsChange={handleSelectedRowsChange}
            persistTableHead
            responsive
          />
        )}
      </div>

      {/* New Mail Modal */}
      {isNewMail && (
        <NewMail 
          user={user} 
          setIsNewMail={setIsNewMail} 
          toMail={selectedEmail?.emailOfReceiver || ""}  
          subject={selectedEmail?.subject || ""} 
          message={selectedEmail?.body || ""} 
          draftId={selectedEmail?.id || null} 
        />
      )}

      {/* Toast Notifications */}
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  );
}

export default EmailTable;
