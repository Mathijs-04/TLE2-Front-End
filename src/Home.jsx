import Navigation from "./components/Navigation.jsx";
import {Link} from "react-router";
// import {useEffect, useState} from "react";

function Home() {
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

                <div className="absolute top-40 right-0 bg-Navy text-white p-8 rounded-l-xl shadow-lg w-64">
                    <div className="border-b-2 border-Yellow w-28 mb-4">
                        <h2 className="whitespace-nowrap text-xl font-nunito font-extrabold">Recente games</h2>
                    </div>
                    <ul className="text-l space-y-2 mb-2">
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
