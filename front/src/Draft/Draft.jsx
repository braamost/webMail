import { Link } from "react-router-dom"
import HomePage from "../homePage/homePage"

function Draft ({emails, user}){
    return (
    <>
        <HomePage emails={emails} user={user}/>
    </>
    )
}
export default Draft