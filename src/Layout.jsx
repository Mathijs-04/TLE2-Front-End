import { NavLink, Outlet } from "react-router";

function Layout() {
    return (
        <>
            <nav className="flex space-x-4">
                <NavLink to="/" className={({isActive}) => isActive ? "underline" : undefined}>Home</NavLink>
                <NavLink to="/page1" className={({isActive}) => isActive ? "underline" : undefined}>Page 1</NavLink>
                <NavLink to="/page2" className={({isActive}) => isActive ? "underline" : undefined}>Page 2</NavLink>
                <NavLink to="/page3" className={({isActive}) => isActive ? "underline" : undefined}>Page 3</NavLink>
            </nav>
            <main>
                <Outlet/>
            </main>
        </>
    );
}

export default Layout;
