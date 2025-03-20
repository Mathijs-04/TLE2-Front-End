import React, {useEffect, useRef, useState} from 'react';
import {Game} from './js/game';
import Navigation from "../components/Navigation.jsx";
import {useLocation, useNavigate} from "react-router";
import HandTrackingComponent from "./handTracking.jsx";

function GameComponent() {
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

    const canvasRef = useRef(null);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameEnded, setGameEnded] = useState(false);
    const [showInfoPage, setShowInfoPage] = useState(false);
    const [difficulty, setDifficulty] = useState(null);
    const gameRef = useRef(null);
    const [detectedGesture, setDetectedGesture] = useState(null);
    const [playTime, setPlayTime] = useState(null);


    // Difficulty-specific information
    const difficultyInfo = {
        beginner: {
            title: "Welkom bij Beginner!",
            description: "Dit is de makkelijkste moeilijkheidsgraad. Je krijgt voorbeelden om je te helpen. Zorg ervoor dat je camera aan staat voordat je start. De timer begint direct!",
        },
        gemiddeld: {
            title: "Klaar voor Gemiddeld?",
            description: "De uitdaging wordt groter! Na een tijdje wanneer je geen juiste handvorm hebt gevormd, krijg je een hint. Gebruik je vaardigheden! Vergeet niet dat je camera aan moet staan en dat de timer meteen begint!",
        },
        gevorderd: {
            title: "Durf jij Gevorderd aan?",
            description: "Dit is de moeilijkste modus. Hierbij krijg je geen hints. Veel succes! Zorg ervoor dat je camera actief is, want de timer begint direct!",
        }
    };


    const startGame = () => {
        setGameStarted(true);
        setGameEnded(false);
        setShowInfoPage(false);
        setPlayTime(null); // Reset playtime before starting

    };

    const fetchGameData = async () => {
        let level;
        if (difficulty === "beginner") {
            level = 1;
        } else if (difficulty === "gemiddeld") {
            level = 2;
        } else if (difficulty === "gevorderd") {
            level = 3;
        }
        console.log(level)
        console.table(localStorage)
        try {
            const playTime = parseInt(localStorage.getItem('playTime'));

            const response = await fetch(`http://145.24.222.137:8000/api/v2/scores`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-key': 'c19939b20ba08edeceb70785f5a473217c1706b456ce7ecd3cb38ec36785cfe3',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,

                },
                body: JSON.stringify({
                    level: level,
                    time: playTime,

                })
            })
            const getStats = await fetch(`http://145.24.222.137:8000/api/v2/scores`, {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-key': 'c19939b20ba08edeceb70785f5a473217c1706b456ce7ecd3cb38ec36785cfe3',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
            const data = await getStats.json()
            console.log(data)
            localStorage.removeItem('playTime');
            console.log(localStorage.getItem('playTime'))
        } catch (error) {
            console.error("Error in fetching token", error)
        }

    }

    const restartGame = () => {
        fetchGameData();

        setGameEnded(false);
        if (gameRef.current) gameRef.current.stop();
        gameRef.current = new Game(canvasRef.current, difficulty, () => {
            const endTime = Date.now();
            const timeTaken = ((endTime - gameRef.current.startTime) / 1000).toFixed(2);
            setPlayTime(timeTaken);
            setGameEnded(true);

        });
        gameRef.current.start();
        gameRef.current.startTime = Date.now(); // Store game start time
    };


    const returnToMenu = () => {
        fetchGameData();

        setGameStarted(false);
        setGameEnded(false);
        setShowInfoPage(false);
        if (gameRef.current) gameRef.current.stop();
    };

    const toProfile = () => {
        fetchGameData(); // Ensure game data is saved before navigating
        setGameStarted(false);
        setGameEnded(false);
        setShowInfoPage(false);
        if (gameRef.current) gameRef.current.stop();

        navigate('/profile'); // Navigate to profile page
    };


    useEffect(() => {
        if (gameStarted && difficulty && !gameEnded) {
            if (gameRef.current) gameRef.current.stop();
            gameRef.current = new Game(canvasRef.current, difficulty, () => {
                const endTime = Date.now();
                const timeTaken = ((endTime - gameRef.current.startTime) / 1000).toFixed(2);
                setPlayTime(timeTaken);
                setGameEnded(true);
            });
            gameRef.current.start();
            gameRef.current.startTime = Date.now(); // Store game start time
        }
    }, [gameStarted, difficulty, gameEnded]);


    useEffect(() => {
        if (gameRef.current && detectedGesture) {
            gameRef.current.handleGestureDetection(detectedGesture);
        }
    }, [detectedGesture]);

    const fetchHandler = async (selectedDifficulty) => {
        console.log(selectedDifficulty);
        setDifficulty(selectedDifficulty);
        setShowInfoPage(true);

        const response = await fetch(`http://145.24.222.137:8000/api/v1/characters`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-key': 'c19939b20ba08edeceb70785f5a473217c1706b456ce7ecd3cb38ec36785cfe3',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        const data = await response.json();
        console.log(data);
        localStorage.setItem('characters', JSON.stringify(data));
    };

    return (
        <>
            <Navigation/>

            <div className="flex flex-col items-center justify-start h-screen pt-[5vh] gap-4">

                {gameStarted && <HandTrackingComponent onDetect={setDetectedGesture}/>}

                {!gameStarted && !showInfoPage && (
                    <div className="flex flex-col gap-5 items-center">
                        <h2 className="text-navy text-5xl font-nunito font-bold">Selecteer Niveau</h2>
                        <button
                            onClick={() => fetchHandler('beginner')}
                            className="bg-IceBlue w-80 text-white text-3xl font-nunito font-bold px-12 py-6 rounded-lg shadow-lg outline-black outline-2 hover:bg-[#8FA9D8] transition">
                            Beginner
                        </button>
                        <button
                            onClick={() => fetchHandler('gemiddeld')}
                            className="bg-DuskBlue w-80 text-white text-3xl font-nunito font-bold px-12 py-6 rounded-lg shadow-lg outline-black outline-2 hover:bg-[#4F6490] transition">
                            Gemiddeld
                        </button>
                        <button
                            onClick={() => fetchHandler('gevorderd')}
                            className="bg-SlateBlue w-80 text-white text-3xl font-nunito font-bold px-12 py-6 rounded-lg shadow-lg outline-black outline-2 hover:bg-[#1F355F] transition">
                            Gevorderd
                        </button>
                    </div>
                )}

                {showInfoPage && difficulty && (
                    <div
                        className="flex flex-col items-center justify-center bg-white p-8 w-[90%] max-w-[500px] rounded-2xl shadow-2xl">
                        <h2 className="text-navy text-3xl font-nunito font-bold mb-4">{difficultyInfo[difficulty].title}</h2>
                        <p className="text-lg text-gray-700 mb-6 text-center">{difficultyInfo[difficulty].description}</p>
                        <div className="flex gap-4 items-center">
                            <button
                                onClick={() => setShowInfoPage(false)}
                                aria-label="Terug naar Moeilijkheid"
                                className="focus:outline-none"
                            >
                                <img
                                    src="/images/back-button.svg"
                                    alt="Terug naar Moeilijkheid"
                                    className="w-12 h-12 sm:w-14 sm:h-14 hover:opacity-80 transition"
                                />
                            </button>

                            <button
                                onClick={startGame}
                                className="bg-Yellow w-full sm:w-64 lg:w-80 text-Navy text-lg sm:text-xl font-nunito font-bold px-8 py-3 rounded-2xl shadow-lg hover:bg-yellow-500 transition">
                                Start Game
                            </button>
                        </div>
                    </div>
                )}


                <canvas
                    ref={canvasRef}
                    width={1280}
                    height={720}
                    className="border-2 border-black bg-black"
                    style={{display: gameStarted ? 'block' : 'none'}}
                />

                {gameEnded && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
        bg-white p-10 w-[90%] max-w-[400px] rounded-2xl shadow-2xl flex flex-col items-center">
                        <h3 className="text-3xl font-bold text-Navy mb-4">Finish!</h3>
                        {playTime &&
                            <p className="text-lg font-semibold text-gray-700 mb-4">Jouw tijd: {playTime - 5.0} seconden</p>}
                        <button
                            onClick={restartGame}
                            className="bg-DuskBlue w-full max-w-[250px] text-white text-lg font-nunito font-bold px-4 py-2 rounded-lg shadow-lg hover:bg-[#4F6490] transition focus:ring-2 focus:ring-blue-400">
                            Speel opnieuw
                        </button>
                        <button
                            onClick={returnToMenu}
                            className="bg-DuskBlue w-full max-w-[250px] text-white text-lg font-nunito font-bold px-4 py-2 rounded-lg shadow-lg hover:bg-[#4F6490] transition focus:ring-2 focus:ring-blue-400 mt-4">
                            Ander level
                        </button>
                        <button
                            onClick={toProfile}
                            className="bg-DuskBlue w-full max-w-[250px] text-white text-lg font-nunito font-bold px-4 py-2 rounded-lg shadow-lg hover:bg-[#4F6490] transition focus:ring-2 focus:ring-blue-400 mt-4">
                            Naar Profiel
                        </button>

                    </div>
                )}

            </div>
        </>
    );
}

export default GameComponent;
