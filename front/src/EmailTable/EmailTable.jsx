import React, { useState, useEffect, useRef } from "react";
import "./EmailTable.css";
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
} from "react-icons/fa";
import { FaPaperclip } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import {
  handleRefresh,
  formatTimestamp,
  handleIconClick,
  handleSelectedOnClick,
} from "./TableHandlers";
function EmailTable({ emails, setEmails, setError, callback, FuncEmailPage, user }) {
  const location = useLocation();
  const [inputSearch, setInputSearch] = useState("");
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [hoveredRowId, setHoveredRowId] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchKey, setSearchKey] = useState("sender");
  const [showButtons, setShowButtons] = useState(false);
  const searchBarRef = useRef(null);

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
      width: "240px",
    },
    {
      name: "Subject",
      selector: (row) => row.subject || "No Subject",
      sortable: true,
      width: "290px",
    },
    {
      name: "Attachments",
      selector: (row) => row.processedAttachments || [],
      width: "201px",
      cell: (row) => {
        // Check if processed attachments exist and have length
        if (
          !row.processedAttachments ||
          row.processedAttachments.length === 0
        ) {
          return <span>No Attachments</span>;
        }

        return (
          <div className="attachments-cell">
            {/* Show attachment count */}
            <span className="attachment-count">
              {row.processedAttachments.length}
              {row.processedAttachments.length === 1
                ? " Attachment"
                : " Attachments"}
            </span>

            {/* Attachment icons */}
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
      width: "420px",
      cell: (row) => (
        <div className="timestamp-cell">
          <span className="timestamp-text">{formatTimestamp(row.sentAt)}</span>
          {hoveredRowId === row.id && (
            <div className="timestamp-icons">
              {/* Star Icon */}
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

              {/* Trash Icon */}
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

              {/* Spam Icon */}
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

              {/* Archive Icon */}
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
    // Prevent row click when clicking icons
    if (event.target.closest(".timestamp-icons")) {
      return;
    }
    FuncEmailPage(row);
    console.log("Row Data:", row);
    callback(true);
    handleIconClick("open", row, setError, setEmails);
  };

  const NoDataComponent = () => (
    <div style={{ padding: "24px" }}>No emails found</div>
  );

  const handleSelectedRowsChange = (state) => {
    setSelectedRows(state.selectedRows);
    console.log("Selected Rows:", state.selectedRows);
  };

  return (
    <div>
      {selectedRows.length > 0 && (
        <div className="button-container">
          {/* Add to Favorites Button */}
          {location.pathname === "/Starred" ? (
            <button
              className="action-button favorite-button"
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
              className="action-button favorite-button"
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
          {/* Add to Trash Button */}
          {location.pathname === "/Trash" ? (
            <>
              <button
                className="action-button trash-button"
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
                className="removeAll"
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
                Delete permanently
              </button>
            </>
          ) : (
            <button
              className="action-button trash-button"
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
      )}
      <div className="refresh-container">
        <FaSync
          className="refresh-icon"
          onClick={handleRefresh}
          title="Refresh"
          style={{
            cursor: "pointer",
            fontSize: "20px",
            marginLeft: "10px",
            color: "#007bff",
          }}
        />
      </div>

      <div className="search-bar-container">
        <div className="input-wrapper">
          <FaSearch id="search-icon" />
          <input
            className="inputStyle"
            ref={searchBarRef}
            type="text"
            placeholder="Search mail ..."
            onFocus={() => setShowButtons(true)}
            onBlur={(e) => {
              if (!e.target.value) setShowButtons(false);
            }}
            onChange={(e) => handleOnChange(e.target.value)}
            value={inputSearch}
          />
        </div>

        {showButtons && (
          <div
            onMouseDown={(e) => e.preventDefault()} // Prevents losing focus on click
            className="search-buttons-container"
          >
            <button
              className={`action-button search-button ${
                searchKey === "sender" ? "selected" : ""
              }`}
              onClick={() => handleSearchKeyChange("sender")}
            >
              {location.pathname === "/SentMails" ? "Reciever" : "Sender"}
            </button>
            <button
              className={`action-button search-button ${
                searchKey === "subject" ? "selected" : ""
              }`}
              onClick={() => handleSearchKeyChange("subject")}
            >
              Subject
            </button>
            <button
              className={`action-button search-button ${
                searchKey === "timestamp" ? "selected" : ""
              }`}
              onClick={() => handleSearchKeyChange("timestamp")}
            >
              Timestamp
            </button>
          </div>
        )}
      </div>

      <div className="tableContainer">
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
        />
      </div>
    </div>
  );
}

export default EmailTable;
