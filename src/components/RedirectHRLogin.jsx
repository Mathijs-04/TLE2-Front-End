import {useNavigate, useSearchParams} from "react-router";
import {useEffect} from "react";

function RedirectHRLogin() {
    const navigate = useNavigate();

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
                // console.log(data)
                localStorage.setItem("token", data.token);
                localStorage.setItem("name", name);
                localStorage.setItem("email", email);
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
        <>Jouw infromatie aan het ophalen</>
    )
}

export default RedirectHRLogin;