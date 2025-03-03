import { NavLink, Outlet } from "react-router";

function Layout() {
    return (
        <>
            <nav>
                <NavLink to="/">Home</NavLink>
            </nav>
            <main>
                <Outlet />
            </main>
        </>
    );
}

export default Layout;
