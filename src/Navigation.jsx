import { NavLink, Outlet } from "react-router";

function Navigation() {
    return (
        <>
            <nav className="flex space-x-4">
                <NavLink to="/" className={({isActive}) => isActive ? "underline" : undefined}>Home</NavLink>
                <NavLink to="/theorie" className={({isActive}) => isActive ? "underline" : undefined}>Theorie</NavLink>
                <NavLink to="/oefenen" className={({isActive}) => isActive ? "underline" : undefined}>Oefenen</NavLink>
            </nav>
            <main>
                <Outlet/>
            </main>
        </>
    );
}

export default Navigation;
