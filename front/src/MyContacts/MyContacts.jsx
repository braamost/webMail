import MenuBar from "../MenuBar/MenuBar";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import "./Contact.css";
import { CreateContact, FetchContacts } from "./FetchContacts";
import "../style.css";
import { FaTrash } from "react-icons/fa";
import { handleDeleteContact } from "./FetchContacts";
function MyContacts({ user, handleLogout }) {
  const columns = [
    {
      name: "Contact Name",
      selector: (row) => row.contactName,
      sortable: true,
    },
    {
      name: "Contact Email",
      selector: (row) => row.contactEmail,
      sortable: true,
    },
    {
      name: "Created At",
      selector: (row) => {
        const date = new Date(row.createdAt);
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      },
      sortable: true,
    },
    {
      name: "",
      cell: (row) => (
        <button className="delete-button" onClick={() => deleteContact(row.id)}>
          <FaTrash />
        </button>
      ),
    },
  ];

  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState(contacts || []);
  const [contactName, setContactName] = useState(""); // State for new contact name
  const [contactEmail, setContactEmail] = useState(""); // State for new contact email
  const [error, setError] = useState("");

  const deleteContact = async (contactId) => {
    await handleDeleteContact(user, contactId, setError);
    setFilteredContacts(
      filteredContacts.filter((contact) => contact.id !== contactId)
    );
    setContacts(contacts.filter((contact) => contact.id !== contactId));
  };

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setError("");
        const data = await FetchContacts(user);
        setContacts(data);
        setFilteredContacts(data); // Show full list initially
      } catch (error) {
        console.error("Error fetching contacts:", error);
        setError(error.message);
      }
    };

    fetchContacts();
  }, [user]);

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    const filtered = contacts.filter((row) => {
      return (
        row.contactName.toLowerCase().includes(searchValue) ||
        row.contactEmail.toLowerCase().includes(searchValue)
      );
    });
    setFilteredContacts(filtered);
  };

  const handleAddContact = async (e) => {
    e.preventDefault();
    if (contactName && contactEmail) {
      const newContact = await CreateContact(
        user,
        contactName,
        contactEmail,
        setError
      );
      if (!newContact) return; 

      // update contacts: replace if exists, otherwise add
      setContacts((prev) => {
        const exists = prev.find((c) => c.id === newContact.id);
        if (exists) {
          return prev.map((c) => (c.id === newContact.id ? newContact : c));
        }
        return [...prev, newContact];
      });

      setFilteredContacts((prev) => {
        const exists = prev.find((c) => c.id === newContact.id);
        if (exists) {
          return prev.map((c) => (c.id === newContact.id ? newContact : c));
        }
        return [...prev, newContact];
      });

      setContactName("");
      setContactEmail("");
    } else {
      alert("Please fill in both fields.");
    }
  };

  return (
    <div className="pageContent">
      <div className="container">
        <h1>My Contacts</h1>

        {/* Contact form for adding a new contact */}
        <div className="addContactForm">
          <h3 className="addContact">Add New Contact</h3>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleAddContact}>
            <input
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Contact Name"
              required
              className="ContactName"
            />
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="Contact Email"
              required
              className="ContactEmail"
            />
            <button type="submit" className="submit">
              Add Contact
            </button>
          </form>
        </div>

        {/* Search input */}
        <div>
          <input
            className="search"
            type="text"
            onChange={handleSearch}
            placeholder="Search by name or email..."
          />
        </div>

        {/* DataTable to display contacts */}
        <DataTable
          columns={columns}
          data={filteredContacts}
          selectableRows
          fixedHeader
          pagination
          paginationPerPage={12}
          noDataComponent="No contacts found"
          defaultSortFieldId={1}
        />
      </div>
      <MenuBar user={user} handleLogout={handleLogout} />
    </div>
  );
}

export default MyContacts;
