import {Link, NavLink, Outlet} from "react-router";

function Navigation() {
    return (
        <>
            <nav className="flex justify-between items-center p-4 text-white mr-10 ml-10">
                <div className="flex space-x-4">
                    <NavLink
                        to={"/"}
                        className={({isActive}) =>
                            `w-11 h-11 p-1 ${isActive ? 'shadow-md shadow-gray-500 border rounded' : ''}`}>
                        <img src="/public/images/home.png" alt={"Link naar Home"}/>
                    </NavLink>
                    <NavLink
                        to={"/alfabet"}
                        className={({isActive}) =>
                            `w-11 h-11 p-1 ${isActive ? 'shadow-md shadow-gray-500 border rounded' : ''}`}>
                        <img src="/public/images/abc-block.png" alt={"Link naar Het alfabet"}
                             className="w-full h-full"/>
                    </NavLink>
                </div>
                <NavLink
                    to={"/profile"}
                    className={({isActive}) =>
                        `w-12 h-12 p-1 ${isActive ? 'shadow-md shadow-gray-500 border rounded' : ''}`}>
                    <img src="/public/images/user.png" alt={"Link naar jouw profiel"}/>
                </NavLink>
            </nav>
            <div className={"flex justify-center items-center"}>
                <div className="w-11/12 border-t-4 border-blue-300 my-4  "></div>
            </div>
            <main>
                <Outlet/>
            </main>
        </>
    );
}

export default Navigation;
