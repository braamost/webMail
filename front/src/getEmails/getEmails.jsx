import React, { useState } from "react";
import axios from "axios";

function EmailFetcher() {
  const [emails, setEmails] = useState([]);
  const [error, setError] = useState("");
  const [folder, setFolder] = useState("INBOX"); // Default folder
  const receiverId = 1;  // Example receiverId

  // Function to fetch emails
  async function getEmails(folder) {
    setError(""); // Clear any previous errors
    try {
      const response = await axios.get("http://localhost:8080/api/emails", {
        params: {
          receiverId: receiverId,  // Pass receiverId as query parameter
          folder: folder,           // Pass folder as query parameter
        },
      });

      setEmails(response.data);
      console.log(response.data); // Debugging: logs the fetched emails
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const { status, data } = error.response;
          if (status === 404) {
            setError(data.message || "No emails found");
          } else {
            setError(`Server error: ${data.message || data}`);
          }
        } else if (error.request) {
          setError("No response from server. Please check your connection.");
        } else {
          setError(`Error: ${error.message}`);
        }
      } else {
        setError("An unexpected error occurred");
      }
    }
  }

  return (
    <div>
      <h4>Email Fetcher</h4>
      
      {/* Folder selection */}
      <div>
        <label>Select Folder: </label>
        <select value={folder} onChange={(e) => setFolder(e.target.value)}>
          <option value="INBOX">Inbox</option>
          <option value="SENT">Sent</option>
          <option value="DRAFTS">Drafts</option>
        </select>
      </div>
      
      {/* Button to trigger email fetch */}
      <button onClick={() => getEmails(folder)}>Fetch Emails</button>

      {/* Error Message */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Emails List */}
      {emails.length > 0 ? (
        <ul>
          {emails.map((email) => (
            <li key={email.id}>
              <h3>{email.subject}</h3>
              <p>{email.body}</p>
              {/* Add other email details as needed */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No emails to display</p>
      )}
    </div>
  );
}

export default EmailFetcher;
