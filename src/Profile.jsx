import Navigation from "./components/Navigation.jsx";
import {useLocation, useNavigate} from "react-router";
import {useEffect, useState} from "react";

function Profile() {
    const [name, setName] = useState("");
    const [bestTime, setBestTime] = useState(null);
    const [averageTime, setAverageTime] = useState(null);
    const [gameCount, setGameCount] = useState(0);
    const [recentGames, setRecentGames] = useState({beginner: [], gemiddeld: [], gevorderd: []});
    const [totalPlaytime, setTotalPlaytime] = useState(0);

    const navigate = useNavigate();
    const location = useLocation();

    const [fastestTimes, setFastestTimes] = useState({
        beginner: null,
        gemiddeld: null,
        gevorderd: null
    });

    useEffect(() => {
        async function fetchGameData() {
            try {
                const response = await fetch(`http://145.24.222.137:8000/api/v2/scores`, {
                    method: "GET",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'x-access-key': 'c19939b20ba08edeceb70785f5a473217c1706b456ce7ecd3cb38ec36785cfe3',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                const data = await response.json();

                if (!data || data.length === 0) {
                    console.warn("No game data received.");
                    return;
                }

                const sortedData = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

                const groupedGames = {
                    beginner: sortedData.filter(game => game.level_id === 1).slice(0, 3),
                    gemiddeld: sortedData.filter(game => game.level_id === 2).slice(0, 3),
                    gevorderd: sortedData.filter(game => game.level_id === 3).slice(0, 3),
                };

                const times = sortedData.map(game => game.best_time / 1000).filter(time => time !== null);

                if (times.length > 0) {
                    setBestTime(Math.min(...times)); // Overall fastest time
                    setAverageTime((times.reduce((sum, time) => sum + time, 0) / times.length).toFixed(2)); // Average time
                }

                setGameCount(sortedData.length); // Total games count
                setRecentGames(groupedGames);

                // Calculate fastest time per difficulty
                const fastestTimesPerLevel = {
                    beginner: Math.min(...groupedGames.beginner.map(game => game.best_time / 1000)) || null,
                    gemiddeld: Math.min(...groupedGames.gemiddeld.map(game => game.best_time / 1000)) || null,
                    gevorderd: Math.min(...groupedGames.gevorderd.map(game => game.best_time / 1000)) || null,
                };

                setFastestTimes(fastestTimesPerLevel);

                // Calculate total playtime
                const totalTime = times.reduce((sum, time) => sum + time, 0);
                setTotalPlaytime(totalTime);

            } catch (error) {
                console.error("Error in fetching game data", error);
            }
        }

        fetchGameData();
    }, []);


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
        if (storedName) {
            setName(storedName);
        }
    }, []);

    const formatTotalTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    const splitName = (name) => {
        const index = name.indexOf('(');
        return index !== -1 ? [name.slice(0, index), name.slice(index)] : [name];
    };

    const nameParts = splitName(name);

    return (
        <>
            <Navigation/>
            <main
                className="flex flex-col font-nunito lg:items-start items-center lg:flex-row justify-center min-h-screen relative">

                <div className="text-Navy text-center w-full max-w-sm lg:max-w-lg break-words mt-8 lg:mt-32">
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
                    className="relative lg:absolute lg:top-8 lg:left-0 bg-SlateBlue text-white p-4 rounded-xl lg:rounded-r-xl lg:rounded-l-none shadow-lg w-full max-w-[25%] mt-14 lg:mt-0">
                    <div className="border-b-2 border-Yellow w-28 mb-2">
                        <h2 className="whitespace-nowrap text-lg lg:text-xl font-extrabold">Recente games</h2>
                    </div>

                    {["Beginner", "Gemiddeld", "Gevorderd"].map((difficulty) => {
                        const games = recentGames[difficulty.toLowerCase()] || [];
                        console.log(`Rendering ${difficulty} Games:`, games);

                        const formatTime = (seconds) => {
                            const h = Math.floor(seconds / 3600);
                            const m = Math.floor((seconds % 3600) / 60);
                            const s = Math.floor(seconds % 60);
                            return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
                        };

// Function to format date & time
                        const formatDateTime = (dateString) => {
                            const date = new Date(dateString);
                            return date.toLocaleString('nl-NL', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit'
                            });
                        };


                        return (
                            <ul key={difficulty} className="text-lg font-bold space-y-1 mb-1">
                                {difficulty}
                                <br />
                                {games.length > 0
                                    ? games.map((game, i) => (
                                        <li key={i} className="flex flex-col font-medium border-b pb-1">
                                                <span className="text-sm">{(game.best_time / 1000).toFixed(2)}s</span>
                                            <span className="text-xs text-gray-300">{formatDateTime(game.created_at)}</span>
                                        </li>
                                    ))
                                    : Array.from({ length: 3 }).map((_, i) => (
                                        <li key={i} className="flex font-medium justify-between border-b pb-1">
                                            <span className="italic text-sm">Game {i + 1}</span>
                                            <span className="text-sm">--:--</span>
                                        </li>
                                    ))}
                            </ul>
                        );
                    })}
                </div>


                {/* Right Side - Statistieken */}
                <div
                    className="relative lg:absolute lg:top-40 lg:right-0 bg-IceBlue text-Navy p-8 rounded-xl lg:rounded-l-xl lg:rounded-r-none shadow-lg w-full max-w-[90%] lg:max-w-[30%] mt-14 lg:mt-0">
                    <div className="border-b-2 border-Yellow w-28 mb-4">
                        <h2 className="whitespace-nowrap text-xl font-extrabold">Statistieken</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                        {[
                            { title: "Snelste Beginner", value: fastestTimes.beginner ? `${fastestTimes.beginner.toFixed(2)}s` : "--:--" },
                            { title: "Gemiddelde tijd", value: averageTime ? `${averageTime}s` : "--:--" },
                            { title: "Snelste Gemiddeld", value: fastestTimes.gemiddeld ? `${fastestTimes.gemiddeld.toFixed(2)}s` : "--:--" },
                            { title: "Aantal games", value: gameCount },
                            { title: "Snelste Gevorderd", value: fastestTimes.gevorderd ? `${fastestTimes.gevorderd.toFixed(2)}s` : "--:--" },
                            { title: "Totale speeltijd", value: formatTotalTime(totalPlaytime) },
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
