import { Link } from "react-router-dom"
import HomePage from "../homePage/homePage"
function SentMails ({ emails }) {
    return (
    <>
        <HomePage emails={emails}/>
    </>
    )
}
export default SentMails