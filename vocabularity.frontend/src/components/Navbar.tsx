import { NavLink } from "react-router"
import styles from "./Navbar.module.css"

export default function Navbar() {
    return(
        <nav className={styles.container}>
            <NavLink to="candidates">Candidates</NavLink>
            <NavLink to="dictionary">Словарь</NavLink>
            <NavLink to="tenses">Времена</NavLink>
        </nav>
    )
}