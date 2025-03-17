import React, {useEffect, useRef, useState} from 'react';
import {Game} from './js/game';
import Navigation from "../components/Navigation.jsx";
import HandTrackingComponent from "./handTracking.jsx";

function GameComponent() {
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
        console.log(localStorage.getItem('characters'))
        startGameWithDifficulty(difficulty);
    }



    return (
        <>
            <Navigation/>
            {gameStarted && <HandTrackingComponent onDetect={setDetectedGesture}/>}
            <div className="flex flex-col items-center justify-start h-screen pt-[5vh] gap-4">
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
                    <div className="flex flex-col gap-5 items-center">
                        <div className="flex gap-4">
                            <button
                                onClick={restartGame}
                                className="bg-DuskBlue w-80 text-white text-2xl font-nunito font-bold px-8 py-4 rounded-lg shadow-lg outline-black outline-2 hover:bg-[#4F6490] transition">
                                Speel opnieuw
                            </button>
                            <button
                                onClick={returnToMenu}
                                className="bg-DuskBlue w-80 text-white text-2xl font-nunito font-bold px-8 py-4 rounded-lg shadow-lg outline-black outline-2 hover:bg-[#4F6490] transition">
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
