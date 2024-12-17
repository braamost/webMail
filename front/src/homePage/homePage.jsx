import "./HomePage.css" 

import MenuBar from "../MenuBar/MenuBar";
import SearchBar from "../SearchAndSort/SearchBar";
import EmailTable from "../IsTable/EmailTable";
import {MocData} from "../MocData.jsx"
function HomePage({emails , user, error}){
    
    return (
    <>
    <div className="pagecontent">
        <SearchBar/>
        <EmailTable emails={emails}/>
        <MenuBar user={user}/>   
    </div>
    </>
    )

}
export default HomePage