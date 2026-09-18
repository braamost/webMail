
import MenuBar from "../MenuBar/MenuBar";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { FaTrash, FaEdit } from "react-icons/fa";
import { fetchDrafts, deleteDraft } from "./REST";

function Drafts({ user, handleLogout }) {
    const [drafts, setDrafts] = useState([]);
    useEffect(() => {
        const fetchUserDrafts = async () => {
            try {
                const data = await fetchDrafts(user.id);
                setDrafts(data);
            } catch (error) {
                console.error("Error fetching drafts:", error);
            }
        };
        fetchUserDrafts();
    }, [user.id]);

    const handleDeleteDraft = async (draftId) => {
        try {
            await deleteDraft(draftId, user.id);
            setDrafts(drafts.filter(draft => draft.id !== draftId));
        } catch (error) {
            console.error("Error deleting draft:", error);
        }
    };

    const columns = [
        {
            name: "Subject",
            selector: row => row.subject,
            sortable: true,
        },
        {
            name: "Last Saved",
            selector: row => {
                const date = new Date(row.savedAt);
                return date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            },
            sortable: true,
        },
        {
            name: "Actions",
            cell: (row) => (
                <>
                    <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors duration-200 mr-2" onClick={() => console.log("Edit draft", row.id)}>
                        <FaEdit />
                    </button>
                    <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700 transition-colors duration-200" onClick={() => handleDeleteDraft(row.id)}>
                        <FaTrash />
                    </button>
                </>
            ),
        }
    ];

    return (
        <div className="pageContent">
            <div className="container">
                <h1>My Drafts</h1>
                <DataTable
                    columns={columns}
                    data={drafts}
                    selectableRows
                    fixedHeader
                    pagination
                    paginationPerPage={10}
                    noDataComponent="No drafts found"
                    defaultSortFieldId={1}
                />
            </div>
            <MenuBar user={user} handleLogout={handleLogout} />
        </div>
    );
}

export default Drafts;
