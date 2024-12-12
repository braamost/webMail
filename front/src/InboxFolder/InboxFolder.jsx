import { Link } from "react-router-dom"
import HomePage from "../homePage/homePage"
function InboxFolder ({emails}){
    return (
    <>
        <HomePage emails={emails}/>
    </>
    )
}
export default InboxFolder