import { useState } from "react";
import "./newMail.css";
import { emailCreation } from "./EmailCreationHandling/EmailCreation";
import { useNavigate } from "react-router-dom";
function NewMail({ user, setIsNewMail }) {
  const [toMail, setToMail] = useState("");
  const [fromMail, setFromMail] = useState("");
  const [subject, setSubject] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleCreateEmail = async (e) => {
    e.preventDefault();
    const response = await emailCreation(
      user.id,
      toMail,
      subject,
      message,
      true,
      "INBOX",
      setError
    );

    if (response != null) {
      setError("");
      setIsNewMail(false);
      window.alert("Email sent successfully!");
      navigate("/Home");
    }
  };

  return (
    <>
      <form onSubmit={handleCreateEmail} className="form-container">
        <div>
          <ion-icon name="mail-outline"></ion-icon>
          <label htmlFor="toMail">TO:</label>
          <input
            type="email"
            required
            value={toMail}
            onChange={(e) => setToMail(e.target.value)}
            placeholder="TO: "
          />
        </div>
        <div>
          <ion-icon name="mail-outline"></ion-icon>
          <label htmlFor="FromMail">From:</label>
          <input
            type="email"
            required
            value={user.email}
            onChange={(e) => setFromMail(e.target.value)}
            placeholder={user.email}
            readOnly
          />
        </div>
        <div>
          <ion-icon name="mail-outline"></ion-icon>
          <label htmlFor="subject">subject:</label>
          <input
            type="text"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="subject: "
          />
          <textarea
            placeholder="Message..."
            rows={8}
            cols={48}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          <button type="submit">Send</button>
          {error && <div className="error-message">{error}</div>}
        </div>
      </form>
    </>
  );
}
export default NewMail;
