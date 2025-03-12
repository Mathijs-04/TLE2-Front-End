import Navigation from "./components/Navigation.jsx";

function Profile() {
    return (
        <>
            <Navigation />

            {/* Left Side - Recente Games */}
            <div className="absolute top-40 left-0 bg-SlateBlue text-white p-8 rounded-r-xl shadow-lg w-[500px] h-auto min-h-[500px]">
                <div className="mb-6 text-center">
                    <h2 className="text-5xl font-nunito font-extrabold relative inline-block">
                        Recente <span className="border-b-4 border-Yellow absolute bottom-0 left-1/4 transform -translate-x-1/2 w-[125px] rounded"></span> games
                    </h2>
                </div>
                <ul className="text-lg space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <li key={i} className="bg-IceBlue p-6 rounded-3xl shadow-md text-Navy font-bold text-xl">
                            Game {i + 1} - 00:02:45
                        </li>
                    ))}
                </ul>
            </div>

            {/* Center - Welcome & Student Info */}
            <div className="absolute top-28 left-1/2 transform -translate-x-1/2 text-[#001344] text-center w-[650px]">
                <h1 className="text-6xl font-bold">Welkom,</h1>
                <h2 className="text-7xl font-extrabold mt-4">[Student Name]</h2>
                <div className="w-52 h-52 bg-gray-700 rounded-full mx-auto mt-8"></div>
                <p className="mt-8 text-7xl font-light">1048489</p>
            </div>

            {/* Right Side - Statistieken */}
            <div className="absolute top-40 right-0 bg-IceBlue text-white p-5 rounded-l-xl shadow-lg w-[500px] h-auto min-h-[500px]">
                <div className="text-center mb-6">
                    <h2 className="text-5xl font-nunito font-extrabold text-[#001344] relative inline-block">
                        Statistieken <span className="border-b-4 border-Yellow absolute bottom-0 left-1/4 transform -translate-x-1/3 w-[150px] rounded"></span>
                    </h2>
                </div>
                <div className="grid grid-cols-2 gap-1">
                    <div className="bg-DuskBlue p-10 rounded-3xl shadow-md text-center text-white">
                        <h3 className="text-xl font-light">Snelste tijd</h3>
                        <p className="text-4xl font-extrabold">00:02:30</p>
                    </div>
                    <div className="bg-DuskBlue p-10 rounded-3xl shadow-md text-center text-white">
                        <h3 className="text-xl font-light">Gemiddelde tijd</h3>
                        <p className="text-4xl font-extrabold">00:03:15</p>
                    </div>
                    <div className="bg-DuskBlue p-10 rounded-3xl shadow-md text-center text-white">
                        <h3 className="text-xl font-light">Aantal games</h3>
                        <p className="text-4xl font-extrabold">24</p>
                    </div>
                    <div className="bg-DuskBlue p-10 rounded-3xl shadow-md text-center text-white">
                        <h3 className="text-xl font-light">Accuraatheid</h3>
                        <p className="text-4xl font-extrabold">89%</p>
                    </div>
                </div>
            </div>

        </>
    );
}

export default Profile;
