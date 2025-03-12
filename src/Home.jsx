import Navigation from "./components/Navigation.jsx";
import { Link } from "react-router";
import { useState } from "react";

function Home() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    return (
        <>
            <Navigation />

            <main className="flex flex-col items-center justify-start min-h-screen bg-cream relative pt-20">
                <h1 className="text-Navy font-nunito font-extrabold text-4xl sm:text-5xl lg:text-6xl sm:mt-0 lg:mt-28 mb-14">
                    Gebaren Game
                </h1>

                <div className="flex items-center gap-8">
                    <button
                        onClick={() => setIsPopupOpen(true)}
                        aria-label="Toon informatie"
                        className="focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                        <img
                            className="h-auto max-h-14 w-auto"
                            src="/images/info.png"
                            alt="Info knop"
                        />
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
                        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="popup-title"
                    >
                        <div className="bg-white text-Navy p-6 rounded-xl shadow-lg max-w-lg w-full">
                            <h2 id="popup-title" className="text-2xl font-extrabold mb-4">INFORMATIE</h2>
                            <p className="text-lg mb-4">
                                In dit spel kan jij doormiddel van jouw camera oefenen met vingerspellen.
                                Help de slak naar de finish door de juiste handvormen aan te nemen.
                            </p>
                            <p className="text-lg mb-4">
                                Weet je het even niet meer? Spiek dan nog even in het Alfabet. Dat kan hier:
                                <img src="/images/abc-block.png" alt="Alfabet referentie" className="mt-2 mx-auto max-h-32"/>
                                Je moet dan wel opnieuw beginnen...
                            </p>
                            <p className="text-lg mb-6">
                                Druk op Start en kies hoe moeilijk jij het spel wilt spelen.
                                Speel en wordt beter in vingerspellen!
                            </p>
                            <button
                                onClick={() => setIsPopupOpen(false)}
                                className="bg-Yellow text-Navy px-6 py-3 rounded-lg text-lg font-bold hover:bg-yellow-500 transition w-full"
                                aria-label="Sluit informatie"
                            >
                                Sluiten
                            </button>
                        </div>
                    </div>
                )}

                <div className="relative lg:absolute lg:top-40 lg:right-0 bg-Navy text-white p-8 rounded-xl lg:rounded-l-xl lg:rounded-r-none shadow-lg w-full max-w-xs lg:max-w-72 mt-14 lg:mt-0">
                    <div className="border-b-2 border-Yellow w-28 mb-4">
                        <h2 className="whitespace-nowrap text-xl font-nunito font-extrabold">Recente games</h2>
                    </div>
                    <ul className="text-l space-y-2 mb-2">
                        {Array.from({ length: 8 }).map((_, i) => (
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
