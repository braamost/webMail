import React, { useState, useEffect } from "react";
import "./EmailTable.css";
import DataTable from "react-data-table-component";
import { FaSearch, FaTrash, FaStar, FaSync } from "react-icons/fa";
import { FaPaperclip } from "react-icons/fa";
import { MovetoFolder } from "./MoveToFolder";
import { useLocation } from "react-router-dom";
function EmailTable({ emails, setError, callback, FuncEmailPage }) {
  const location = useLocation();
  const [inputSearch, setInputSearch] = useState("");
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [hoveredRowId, setHoveredRowId] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

  // Update filteredEmails when emails prop changes
  useEffect(() => {
    if (emails && Array.isArray(emails)) {
      if (inputSearch) {
        const filtered = emails.filter((email) =>
          email.emailOfSender.toLowerCase().includes(inputSearch.toLowerCase())
        );
        setFilteredEmails(filtered);
      } else {
        setFilteredEmails(emails);
      }
    } else {
      setFilteredEmails([]);
    }
  }, [emails, inputSearch]);

  const handleRefresh = () => {
    window.location.reload(); // Refresh the page
  };

  // Button Handlers

  const handleSelectedOnClick = async (folder) => {
    console.log("Add to Trash clicked for selected rows:", selectedRows);
    // Add logic to move selected rows to selected folder
    selectedRows.forEach(async (email) =>{
      try {
        await MovetoFolder(folder, email.id, setError);
      } catch (error) {
        console.error("Failed to move email", error);
      }
    })
    handleRefresh();
  };

  const handleIconClick = async (folder, email) => {
    try {
      await MovetoFolder(folder, email.id, setError);
      handleRefresh();
    } catch (error) {
      console.error("Failed to move email", error);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const columns = [
    {
      name: "Sender",
      selector: (row) => row.emailOfSender || "No Sender",
      sortable: true,
      width: "240px",
    },
    {
      name: "Subject",
      selector: (row) => row.subject || "No Subject",
      sortable: true,
      width: "311px",
    },
    {
      name: "Attachments",
      selector: (row) => row.processedAttachments || [],
      width: "300px",
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
                    // Download the file
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
      width: "300px",
      cell: (row) => (
        <div className="timestamp-cell">
          <span className="timestamp-text">{formatTimestamp(row.sentAt)}</span>
          {hoveredRowId === row.id && (
            <div className="timestamp-icons">
              <FaStar
                className="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleIconClick("starred", row);
                }}
              />
              <FaTrash
                className="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleIconClick("trash", row);
                }}
              />
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
          {location.pathname==="/Starred" ?(<button
            className="action-button favorite-button"
            onClick={() => handleSelectedOnClick("starred")}
          >
            Remove from Favorites 
          </button>):(
            <button
            className="action-button favorite-button"
            onClick={() => handleSelectedOnClick("starred")}
          >
            Add to Favorites 
          </button>
          )}
          {/* Add to Trash Button */}
          {location.pathname==="/Trash" ? (<button
            className="action-button trash-button"
            onClick={() => handleSelectedOnClick("trash")}
          >
            Remove from Trash
          </button>):(<button
            className="action-button trash-button"
            onClick={() => handleSelectedOnClick("trash")}
          >
            Add to Trash
          </button>)}
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
            type="text"
            placeholder="Search mail ..."
            onChange={(e) => handleOnChange(e.target.value)}
            value={inputSearch}
          />
        </div>
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
