import { Link } from "react-router-dom"
import EmailTable from "../EmailTable/EmailTable"
import "../homePage/HomePage.css"
import HomePage from "../homePage/homePage"
function Trash ({emails, user}){
    return (
    <>
   

    
    <HomePage emails={emails} user={user}/>
    <div className="menu-bar" >
    <Link to="/Home">
        <button type="button">Return Home</button>
    </Link> 
    </div> 
    </>
    )
}
export default Trash