import Navigation from "./components/Navigation.jsx";
import {Link, useLocation, useNavigate} from "react-router";
import {useEffect, useState} from "react";

function Home() {
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

    // const [leaderboard, setLeaderboard] = useState([])
    // //leaderboard is een array van objecten met de volgende properties: id, name, time
    //
    // useEffect(() => {
    //     const fetchLeaderboard = async () => {
    //         try {
    //             const response = await fetch(``, {
    //                 method: "GET",
    //                 headers: {
    //                     'Accept': 'application/json'
    //                 }
    //             })
    //             const data = await response.json()
    //             console.log(data)
    //             setLeaderboard(data.items)
    //         } catch (error) {
    //             console.error("Error in fetching Leaderboard", error)
    //         }
    //     }
    //     fetchLeaderboard();
    // }, []);

    return (
        <>
            <Navigation/>

            <main className="flex flex-col items-center justify-start min-h-screen bg-cream relative pt-20">
                <h1 className="text-Navy font-nunito font-extrabold text-6xl mt-28 mb-14">Gebaren Game</h1>

                <div className="flex items-center gap-8">
                    <img className="h-14" src="/images/info.png" alt="Info"/>
                    <Link to={"/game"}>
                        <button
                            className="bg-Yellow w-80 text-Navy text-3xl font-nunito font-bold px-12 py-6 rounded-3xl shadow-lg hover:bg-yellow-500 transition">
                            Start!
                        </button>
                    </Link>
                </div>

                <div className="absolute top-40 right-10 bg-Navy text-white p-6 rounded-xl shadow-lg w-64">
                    <div className="border-b-2 border-Yellow w-20 mb-4">
                        <h2 className="text-xl font-nunito font-extrabold">Leaderboard</h2>
                    </div>
                    <ul className="text-sm space-y-2">
                        {Array.from({length: 8}).map((_, i) => (
                            <li key={i} className="flex justify-between border-b pb-1">
                                <span className="italic">John Doe</span>
                                <span>00:03:23</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </main>

        </>
    );
}

export default Home;
