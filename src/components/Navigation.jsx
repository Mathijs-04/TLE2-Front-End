import { NavLink, Outlet } from "react-router";

function Navigation() {
    return (
        <>
            <nav className="fixed bottom-3 left-4 right-4 bg-gray-800 text-white text-center p-4 flex justify-around rounded-2xl">
                <NavLink to="/" className={({isActive}) => isActive ? "underline" : undefined}> <img alt={"Theorie"}/>  </NavLink>
                <NavLink to="/theorie" className={({isActive}) => isActive ? "underline" : undefined}> <img alt={"Home"}/> </NavLink>
                <NavLink to="/oefenen" className={({isActive}) => isActive ? "underline" : undefined}> <img alt={"Oefeningen"}/> </NavLink>
            </nav>
            <main>
                <Outlet/>
            </main>
        </>
    );
}

export default Navigation;
