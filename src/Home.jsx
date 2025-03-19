import Navigation from "./components/Navigation.jsx";
import {Link, useLocation, useNavigate} from "react-router";
import {useEffect} from "react";
import {useState} from "react";

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
    // const [recent, setRecent] = useState([])
    // //recent is een array van objecten met de volgende properties: id, name, time
    //
    // useEffect(() => {
    //     const fetchRecent = async () => {
    //         try {
    //             const response = await fetch(``, {
    //                 method: "GET",
    //                 headers: {
    //                     'Accept': 'application/json'
    //                 }
    //             })
    //             const data = await response.json()
    //             console.log(data)
    //             setRecent(data.items)
    //         } catch (error) {
    //             console.error("Error in fetching Recent", error)
    //         }
    //     }
    //     fetchRecent();
    // }, []);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    // Prevent background scroll when popup is open
    useEffect(() => {
        if (isPopupOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [isPopupOpen]);

    return (
        <>
            <Navigation/>

            <main className="flex flex-col items-center font-nunito justify-start min-h-screen bg-cream relative pt-20">
                <h1 className="text-Navy font-extrabold text-4xl sm:text-5xl lg:text-6xl sm:mt-0 lg:mt-28 mb-14">
                    Sign Trail
                </h1>

                <div className="flex items-center gap-8">
                    <button
                        onClick={() => setIsPopupOpen(true)}
                        aria-label="Toon informatie"
                        className="p-2 rounded-full transition"
                    >
                        <img className="h-auto max-h-14 w-auto" src="/images/info.png" alt="Info knop"/>
                    </button>

                    <Link to={"/game"}>
                        <button
                            className="bg-Yellow w-full sm:w-64 lg:w-80 text-Navy text-2xl sm:text-3xl font-nunito font-bold px-12 py-6 rounded-3xl shadow-lg hover:bg-yellow-500 transition">
                            Start!
                        </button>
                    </Link>
                </div>

                {isPopupOpen && (
                    <div
                        className="fixed inset-0 flex flex-col font-nunito items-center justify-center bg-black bg-opacity-50 p-4 z-50 overflow-y-auto"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="popup-title"
                    >
                        <div
                            className="bg-white text-Navy p-8 rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto text-center">
                            <h2 id="popup-title"
                                className="text-5xl border-b-4 border-Yellow w-56 font-black font-nunito mb-10">INFORMATIE</h2>
                            <p className="text-2xl mb-5">
                                In dit spel kan jij door middel van jouw camera oefenen met vingerspellen.
                                Help de slak naar de finish door de juiste handvormen aan te nemen!
                            </p>
                            <p className="text-2xl mb-5">
                                Weet je het even niet meer? Spiek dan nog even in het Alfabet. Die kan je linksboven
                                vinden met dit icoontje:
                            </p>
                            <img
                                src="/images/abc-block.png"
                                alt="Alfabet referentie"
                                className="max-w-[12vh] sm:max-w-[15vh] md:max-w-[18vh] lg:max-w-[8vh] w-auto h-auto mx-auto block mt-2"
                            />
                            <p className="text-xl mt-3">
                                Je moet dan wel opnieuw beginnen...
                            </p>
                            <p className="text-2xl mb-10">
                                Druk op Start en kies hoe moeilijk jij het spel wilt spelen.
                                Speel en wordt beter in vingerspellen!
                            </p>
                            <button
                                onClick={() => setIsPopupOpen(false)}
                                className="bg-Yellow text-Navy px-8 py-4 rounded-lg text-xl font-bold hover:bg-yellow-500 transition w-full"
                                aria-label="Sluit informatie"
                            >
                                Sluiten
                            </button>
                        </div>
                    </div>
                )}

                {/*<div className="relative lg:absolute lg:top-40 lg:right-0 bg-Navy text-white p-8 rounded-xl lg:rounded-l-xl lg:rounded-r-none shadow-lg w-full max-w-xs lg:max-w-72 mt-14 lg:mt-0">*/}
                {/*    <div className="border-b-2 border-Yellow w-28 mb-4">*/}
                {/*        <h2 className="whitespace-nowrap text-xl font-nunito font-extrabold">Recente games</h2>*/}
                {/*    </div>*/}
                {/*    <ul className="text-xl space-y-2 mb-2">*/}
                {/*        {Array.from({ length: 8 }).map((_, i) => (*/}
                {/*            <li key={i} className="flex justify-between border-b pb-1">*/}
                {/*                <span className="italic">John Doe</span>*/}
                {/*                <span>00:03:23</span>*/}
                {/*            </li>*/}
                {/*        ))}*/}
                {/*    </ul>*/}
                {/*</div>*/}
            </main>
        </>
    );
}

export default Home;
