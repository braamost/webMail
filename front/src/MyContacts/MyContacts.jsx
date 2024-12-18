import MenuBar from "../MenuBar/MenuBar"
import { useState } from "react";
import DataTable from "react-data-table-component";
import "./Contact.css"
function MyContacts({ user , contacts }) {
    
    const columns =[
        {
            name:"Contact",
            selector: row => row.userName,
            sortable: true,

        },
        {
            name: "Email",
            selector: row => row.email,
            sortable: true,
        },
    ];
    const data = [
        {
            id :1,
            userName: "John Doe",
            email: "johndoe@example.com",
        },
        {
            id :2,
            userName: "Ahmed",
            email: "Ahmed@example.com",
        },{
            id :3,
            userName: "Abdallah",
            email: "Ahmed@example.com",
        },{
            id :4,
            userName: "Abdo",
            email: "Ahmed@example.com",
        },{
            id :5,
            userName: "sameh",
            email: "Ahmed@example.com",
        },{
            id :6,
            userName: "malak",
            email: "Ahmed@example.com",
        },{
            id :7,
            userName: "hana",
            email: "Ahmed@example.com",
        },{
            id :8,
            userName: "ali",
            email: "Ahmed@example.com",
        },{
            id :9,
            userName: "mohamed",
            email: "Ahmed@example.com",
        },
        {
            id :10,
            userName: "king",
            email: "king@example.com",
        },
        
    ];
    const [searchTerm, setSearchTerm] = useState(data);
    const handleSearch = (e) => {
        console.log(e.target.value);
        const keyWord= data.filter(row => {
            return row.userName.toLowerCase().includes(e.target.value.toLowerCase())
        })
        setSearchTerm(keyWord)
    }
    return(
        <div className="pageContent">
            <div className="container">
                <h1>My Contacts</h1>
                <div >
                    <input className="search" type="text" onChange={handleSearch} placeholder="Search..."/>
                </div>
                <DataTable 
                columns={columns} 
                data={searchTerm}
                selectableRows
                fixedHeader
                pagination
                paginationPerPage={12}  // Set default rows per page
                ></DataTable>
            </div>
            <MenuBar user={user}/>  
        </div>
    )
}
export default MyContacts