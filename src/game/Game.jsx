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
    const [difficulty, setDifficulty] = useState(null);
    const gameRef = useRef(null);
    const [detectedGesture, setDetectedGesture] = useState(null);

    const startGameWithDifficulty = (selectedDifficulty) => {
        setDifficulty(selectedDifficulty);
        setGameStarted(true);
        setGameEnded(false);
    };

    const restartGame = () => {
        setGameEnded(false);
        if (gameRef.current) gameRef.current.stop();
        gameRef.current = new Game(canvasRef.current, difficulty, () => setGameEnded(true));
        gameRef.current.start();
    };

    const returnToMenu = () => {
        setGameStarted(false);
        setGameEnded(false);
        if (gameRef.current) gameRef.current.stop();
    };

    useEffect(() => {
        if (gameStarted && difficulty && !gameEnded) {
            if (gameRef.current) gameRef.current.stop();
            gameRef.current = new Game(canvasRef.current, difficulty, () => setGameEnded(true));
            gameRef.current.start();
        }
    }, [gameStarted, difficulty, gameEnded]);

    useEffect(() => {
        if (gameRef.current && detectedGesture) {
            gameRef.current.handleGestureDetection(detectedGesture);
        }
    }, [detectedGesture]);

    const fetchHandler = async (difficulty) => {
        console.log(difficulty)
        const response = await fetch(`http://145.24.222.137:8000/api/v1/characters`,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-key': 'c19939b20ba08edeceb70785f5a473217c1706b456ce7ecd3cb38ec36785cfe3',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },

            })
        const data = await response.json()
        console.log(data)
        localStorage.setItem('characters', JSON.stringify(data));
        // begint bij 0 en eindigt bij 25
        startGameWithDifficulty(difficulty);
    }



    return (
        <>
            <Navigation/>
            <div className="flex flex-col items-center justify-start h-screen pt-[5vh] gap-4">

            {gameStarted && <HandTrackingComponent onDetect={setDetectedGesture}/>}
                <canvas
                    ref={canvasRef}
                    width={1280}
                    height={720}
                    className="border-2 border-black bg-black"
                    style={{display: gameStarted ? 'block' : 'none'}}
                />
                {!gameStarted && (
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
                {gameEnded && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
        bg-white p-12 w-[500px] rounded-2xl shadow-2xl flex flex-col items-center">
                        <h3 className="text-4xl font-bold text-Navy mb-6">Game Over!</h3>
                        <div className="flex flex-col gap-6 w-full">
                            <button
                                onClick={restartGame}
                                className="bg-DuskBlue w-full text-white text-3xl font-nunito font-bold px-10 py-5 rounded-xl shadow-lg outline-black outline-2 hover:bg-[#4F6490] transition">
                                Speel opnieuw
                            </button>
                            <button
                                onClick={returnToMenu}
                                className="bg-DuskBlue w-full text-white text-3xl font-nunito font-bold px-10 py-5 rounded-xl shadow-lg outline-black outline-2 hover:bg-[#4F6490] transition">
                                Ander level
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default GameComponent;
