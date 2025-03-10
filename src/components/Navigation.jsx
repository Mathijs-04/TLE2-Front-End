import {Link, NavLink, Outlet} from "react-router";

function Navigation() {
    return (
        <>
            <nav className="flex space-x-4">
                <Link to={"/"} >Home</Link>
                <Link to={"/informatie"}>Informatie</Link>
                <Link to={"/alphabet"}>Alphabet</Link>
                <Link to={"/game"}>Game</Link>
                <Link to={"/profile"}>Profile</Link>

            </nav>
            <main>
                <Outlet/>
            </main>
        </>
    );
}

export default Navigation;
