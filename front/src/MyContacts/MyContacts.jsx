import MenuBar from "../MenuBar/MenuBar";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { CreateContact, FetchContacts } from "./FetchContacts";
import { FaTrash } from "react-icons/fa";
import { handleDeleteContact } from "./FetchContacts";
import React from "react";
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
  <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700 transition-colors duration-200" onClick={() => deleteContact(row.id)}>
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

  const [showMenuBar, setShowMenuBar] = React.useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/img.jpg')] bg-cover bg-center">
      {/* Desktop sidebar */}
      <div className="hidden lg:block flex-shrink-0 w-64 h-screen">
        <MenuBar user={user} handleLogout={handleLogout} />
      </div>
      {/* Mobile menu toggle button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-30 p-2 bg-white rounded-lg shadow-md"
        onClick={() => setShowMenuBar(true)}
        aria-label="Open menu"
      >
        <span className="sr-only">Open menu</span>
        <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {/* Mobile overlay menu */}
      {showMenuBar && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="w-64 bg-white/90 shadow-xl h-full">
            <MenuBar user={user} handleLogout={handleLogout} onLinkClick={() => setShowMenuBar(false)} />
          </div>
          <div className="flex-1 bg-black bg-opacity-30" onClick={() => setShowMenuBar(false)} />
        </div>
      )}
      {/* Main content */}
      <div className="w-full max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8">
          <h1 className="text-3xl font-bold text-blue-700 mb-8 text-center">My Contacts</h1>
          {/* Contact form for adding a new contact */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-blue-700 mb-4">Add New Contact</h3>
            {error && <p className="mb-4 text-red-500 text-center font-medium bg-red-50 rounded-lg py-2 px-3 border border-red-200">{error}</p>}
            <form onSubmit={handleAddContact} className="flex flex-col md:flex-row gap-4 items-center justify-center">
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Contact Name"
                required
                className="w-full md:w-1/3 px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-blue-900"
              />
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="Contact Email"
                required
                className="w-full md:w-1/3 px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-blue-900"
              />
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors duration-200 font-semibold w-full md:w-auto">
                Add Contact
              </button>
            </form>
          </div>
          {/* Search input */}
          <div className="mb-6 flex justify-center">
            <input
              className="w-full max-w-md px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-blue-900"
              type="text"
              onChange={handleSearch}
              placeholder="Search by name or email..."
            />
          </div>
          {/* DataTable to display contacts */}
          <div className="bg-white rounded-xl shadow border border-blue-100 p-2">
            <DataTable
              columns={columns}
              data={filteredContacts}
              selectableRows
              fixedHeader
              pagination
              paginationPerPage={12}
              noDataComponent={<div className="text-blue-400 py-8 text-center">No contacts found</div>}
              defaultSortFieldId={1}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyContacts;
