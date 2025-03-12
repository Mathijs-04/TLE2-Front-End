import Navigation from "./components/Navigation.jsx";
import {useLocation, useNavigate} from "react-router";
import {useEffect} from "react";

function Profile() {
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        const token = localStorage.getItem("token");

        const currentUrl = location.pathname;
        if (token === null) {
            localStorage.setItem("redirectUrl", currentUrl);
            window.location.href = 'https://cmgt.hr.nl/chat-login/handle/%7Bapplication%7D?redirect=http://localhost:5173/login';
        }
    }, [navigate]);
    return (
        <>
            <Navigation/>
            <p>Profile</p>
        </>
    );

}

export default Profile;