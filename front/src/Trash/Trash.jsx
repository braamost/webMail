import { Link } from "react-router-dom"
import EmailTable from "../EmailTable/EmailTable"
import "../homePage/HomePage.css"
import HomePage from "../homePage/homePage"
function Trash ({emails}){
    return (
    <>
   

    
    <HomePage emails={emails}/>
    <div className="menu-bar" >
    <Link to="/Home">
        <button type="button">Return Home</button>
    </Link> 
    </div> 
    </>
    )
}
export default Trash