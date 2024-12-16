import React from 'react'
import './EmailTable.css'
import DataTable from 'react-data-table-component'
import SearchBar from '../SearchAndSort/SearchBar'
import { FaSearch , FaTrash, FaStar} from 'react-icons/fa';
import { useState } from 'react';

function EmailTable({emails}) {

    const [inputSearch , setInputSearch] = useState('');
    const [filteredEmails , setFilteredEmails] = useState(emails);
    const [hoveredRowId, setHoveredRowId] = useState(null);

    const handleDelete = (email) => {
      console.log('Delete clicked for row:', email.sender);
      // Add delete logic here
    };
  
    const handleFavorite = (email) => {
      console.log('Favorite clicked for row:', email.sender);
      // Add favorite logic here
    };

    const columns = [
        {
            name  : 'Sender',
            selector : row => row.sender,
            sortable:true,
            width : '30%',
        },
        {
            name  : 'Subject',
            selector : row => row.subject,
            width : '40%',
        },
        {
            name  : 'Timestamp',
            selector : row => row.timestamp,
            width : '30%',
            cell: (row) => (
              <div className="timestamp-cell">
              <span className="timestamp-text">{row.timestamp}</span>
              {hoveredRowId === row.id && (
                <div className="timestamp-icons">
                  <FaStar className="icon" onClick={() => handleFavorite(row)} />
                  <FaTrash className="icon" onClick={() => handleDelete(row)} />
                </div>
              )}
            </div>
            ),
        },
        
    ];


    const customStyles = {
        table: {
            style: {
              overflowY: 'auto',    // Enable vertical scrolling
              maxHeight: '625px',    // Set the max height for the table
            },
          },
        headCells: {
            style: {
              backgroundColor: '#d1e0e0',
              fontSize: '16px',
              fontWeight: 'bold',
            },
          },
        rows: {
        style: {
            '&:hover': {
            backgroundColor: '#f0f0f0', // Light gray hover effect
            cursor: 'pointer', // Pointer cursor for interactivity
            },
         },
         onMouseEnter: (row) => setHoveredRowId(row.id),
         onMouseLeave: () => setHoveredRowId(null),
        },
    }
    
    const handleOnChange = (value) => {
        setInputSearch(value);
        const filtereddata = emails.filter(email => email.sender.toLowerCase().includes(value.toLowerCase()));  
        setFilteredEmails(filtereddata);
      };

    const handleRowClick = (row) => {
        alert(`You clicked on row: ${row.sender}`);
        console.log('Row Data:', row); 
      };

  return (
    <div>
    
        <div className = "search-bar-container">
            <div className="input-wrapper">
                <FaSearch id="search-icon" />
                <input 
                className ="inputStyle" 
                type="text" 
                placeholder="Search mail ..." 
                onChange={(e) => {handleOnChange(e.target.value)}} 
                value = {inputSearch} 
                />
            </div>
        </div>
        <div className='tableContainer'>
            <DataTable columns={columns} 
            data={filteredEmails}  
            customStyles={customStyles}
            onRowClicked={handleRowClick} 
            onRowMouseEnter={(row) => setHoveredRowId(row.id)}
            nRowMouseLeave={() => setHoveredRowId(null)}
            fixedHeader
            />
        </div>
    </div>
  )
}
//'#d1e0e0'
export default EmailTable