import {useNavigate, useParams, useSearchParams} from "react-router";
import {useEffect} from "react";

function RedirectHRLogin() {
    const navigate = useNavigate();
    // opslaan waar iemand vandaan komt en na het inloggen weer terugsturen
    // opslaan moet gedaan worden in de localstorage
    // redirecten naar de HR-login pagina
    // https://cmgt.hr.nl/chat-login/handle/%7Bapplication%7D?redirect=http://145.24.222.170/login
    // na het inloggen moet de gebruiker terug naar de pagina waar hij vandaan kwam
    const [searchParams, setSearchParams] = useSearchParams();
    const tokenSSO = searchParams.get("token");
    const name = searchParams.get("name");
    const email = searchParams.get("email");
    console.log(tokenSSO);
    console.log(name);
    console.log(email);
    useEffect(() => {
        async function fetchToken() {
            try {
                const response = await fetch(`http://145.24.222.137:8000/api/v1/login`, {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'x-access-key': 'c19939b20ba08edeceb70785f5a473217c1706b456ce7ecd3cb38ec36785cfe3'
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        token: tokenSSO
                    })
                })
                const data = await response.json()
                console.log(data)
                localStorage.setItem("token", data.token);
            } catch (error) {
                console.error("Error in fetching token", error)
            }
        }
        fetchToken();
        const redirectUrl = localStorage.getItem("redirectUrl");
        console.log(redirectUrl);
        navigate(redirectUrl);
    }, [navigate]);

    return (
        <>Kaas</>
    )
}

export default RedirectHRLogin;