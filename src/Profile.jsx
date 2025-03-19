import Navigation from "./components/Navigation.jsx";
import {useLocation, useNavigate} from "react-router";
import {useEffect, useState} from "react";

function Profile() {

    useEffect( () => {
        async function fetchGameData() {
            try {
                const response = await fetch(`http://145.24.222.137:8000/api/v2/scores`, {
                    method: "GET",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'x-access-key': 'c19939b20ba08edeceb70785f5a473217c1706b456ce7ecd3cb38ec36785cfe3',
                        Authorization: `Bearer ${localStorage.getItem(('token'))}`,
                    },
                })
                const data = await response.json()
                console.log(data)

            } catch (error) {
                console.error("Error in fetching token", error)
            }
        }
        fetchGameData()
    }, []);

    const [name, setName] = useState("");
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
    useEffect(() => {
        const storedName = localStorage.getItem("name");
        console.log(storedName);
        if (storedName) {
            setName(storedName);
        }
    }, []);

    const splitName = (name) => {
        const index = name.indexOf('(');
        if (index !== -1) {
            return [name.slice(0, index), name.slice(index)];
        }
        return [name];
    };

    const nameParts = splitName(name);
    return (
        <>
            <Navigation/>

            <main
                className="flex flex-col font-nunito lg:items-start items-center lg:flex-row justify-center min-h-screen relative">

                {/* Center - Welcome & Student Info */}
                <div
                    className="text-Navy text-center w-full max-w-sm lg:max-w-lg break-words mt-8 lg:mt-32">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Welkom,</h1>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mt-4">
                        {nameParts[0].split("(")[0]}
                    </h2>

                    <img className="w-28 sm:w-32 lg:w-40 mx-auto mt-8" src="/images/user.png"/>
                    <p className="mt-8 text-xl sm:text-2xl lg:text-3xl font-light">
                        {nameParts[1] ? nameParts[1].replace(/[()]/g, "") : ""}
                    </p>

                </div>

                {/* Left Side - Recente Games */}
                <div
                    className="relative lg:absolute lg:top-8 lg:left-0 bg-SlateBlue text-white p-8 rounded-xl lg:rounded-r-xl lg:rounded-l-none shadow-lg w-full max-w-[90%] lg:max-w-[30%] mt-14 lg:mt-0">
                    <div className="border-b-2 border-Yellow w-28 mb-4">
                        <h2 className="whitespace-nowrap text-xl lg:text-2xl font-extrabold">Recente
                            games</h2>
                    </div>
                    <ul className="text-xl font-extrabold space-y-2 mb-2">
                        Beginner
                        <br/>
                        {Array.from({length: 3}).map((_, i) => (
                            <li key={i} className="flex font-medium justify-between border-b pb-1">
                                <span className="italic">Game {i + 1}</span>
                                <span>00:02:45</span>
                            </li>
                        ))}
                    </ul>
                    <br/>
                    <ul className="text-xl font-extrabold space-y-2 mb-2">
                        Gemiddeld
                        <br/>
                        {Array.from({length: 3}).map((_, i) => (
                            <li key={i} className="flex font-medium justify-between border-b pb-1">
                                <span className="italic">Game {i + 1}</span>
                                <span>00:02:45</span>
                            </li>
                        ))}
                    </ul>
                    <br/>
                    <ul className="text-xl font-extrabold space-y-2 mb-2">
                        Gevorderd
                        <br/>
                        {Array.from({length: 3}).map((_, i) => (
                            <li key={i} className="flex font-medium justify-between border-b pb-1">
                                <span className="italic">Game {i + 1}</span>
                                <span>00:02:45</span>
                            </li>
                        ))}
                    </ul>
                </div>


                {/* Right Side - Statistieken */}
                <div
                    className="relative lg:absolute lg:top-40 lg:right-0 bg-IceBlue text-Navy p-8 rounded-xl lg:rounded-l-xl lg:rounded-r-none shadow-lg w-full max-w-[90%] lg:max-w-[20%] mt-14 lg:mt-0">
                    <div className="border-b-2 border-Yellow w-28 mb-4">
                        <h2 className="whitespace-nowrap text-xl font-extrabold">Statistieken</h2>
                    </div>
                    <div className="grid gap-1 columns-1">
                        {[
                            {title: "Snelste tijd", value: "00:02:30"},
                            {title: "Gemiddelde tijd", value: "00:03:15"},
                            {title: "Aantal games", value: "24"},
                        ].map((stat, i) => (
                            <div key={i} className="bg-DuskBlue p-6 rounded-3xl shadow-md text-center text-white">
                                <h3 className="text-sm sm:text-xs font-light">{stat.title}</h3>
                                <p className="text-xl sm:text-xl font-extrabold">{stat.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </>
    );

}

export default Profile;
