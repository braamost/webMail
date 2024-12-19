import MenuBar from "../MenuBar/MenuBar";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import "./Contact.css";
import { CreateContact, FetchContacts} from "./FetchContacts";
import "../style.css";

function MyContacts({ user, contacts , handleLogout}) {
    const columns = [
        {
            name: "Contact Name",
            selector: row => row.contactName,
            sortable: true,
        },
        {
            name: "Contact Email",
            selector: row => row.contactEmail,
            sortable: true,
        },
        {
            name: "Created At",
            selector: row => {
                const date = new Date(row.createdAt);
                return date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            },
            sortable: true,
        }
    ];

    const [filteredContacts, setFilteredContacts] = useState(contacts || []);
    const [contactName, setContactName] = useState("");  // State for new contact name
    const [contactEmail, setContactEmail] = useState("");  // State for new contact email
    const [error,setError] = useState("");

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const data = await FetchContacts(user.id); // Assuming FetchContacts is a function that fetches data
                console.log(data);
                setFilteredContacts(data); // Setting the fetched data to state
            } catch (error) {
                console.error("Error fetching contacts:", error);
            }
        };
        
        fetchContacts(); // Call the async function to fetch contacts
    }, [user.id]);

    // Initialize state with contacts prop
    useEffect(() => {
        setFilteredContacts(contacts || []);
    }, [contacts]);

    const handleSearch = (e) => {
        const searchValue = e.target.value.toLowerCase();
        const filtered = contacts.filter(row => 
            row.contactName.toLowerCase().includes(searchValue) ||
            row.contactEmail.toLowerCase().includes(searchValue)
        );
        setFilteredContacts(filtered);
    };

    const handleAddContact = async(e) => {
      e.preventDefault(); // Prevent the form from reloading the page
      if (contactName && contactEmail) {
          const newContact = await CreateContact(user.id, contactName, contactEmail , setError); // Assuming CreateContact returns the full contact including ID
          console.log(newContact);
  
          setFilteredContacts([...filteredContacts, newContact]); // Ensure newContact has a unique ID
          setContactName(""); // Reset the form fields
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
                        <button type="submit" className="">Add Contact</button>
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
            <MenuBar user={user} handleLogout={handleLogout}/>
        </div>
    );
}

export default MyContacts;


// const keyWord= data.filter(row => {
//   return row.userName.toLowerCase().includes(e.target.value.toLowerCase())
// })
// setSearchTerm(keyWord)