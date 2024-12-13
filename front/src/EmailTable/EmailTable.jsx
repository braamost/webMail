import React from "react";
import "./email.css"; // Link the CSS file

const EmailTable = ({ emails  }) => {
  return (
    <div className="container">
      <h1>Email List</h1>
      {emails.length > 0 ? (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Sender</th>
                <th>Subject</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {emails.map((email) => (
                <tr key={email.id}>
                  <td>{email.sender}</td>
                  <td>{email.subject}</td>
                  <td>{email.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="no-emails">No emails to display.</p>
      )}
    </div>
  );
};

export default EmailTable;
