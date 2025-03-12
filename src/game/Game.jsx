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
                        <h2 className="text-white text-5xl font-bold">Select Difficulty</h2>
                        <button
                            onClick={() => startGameWithDifficulty('beginner')}
                            className="bg-yellow-500 w-80 text-black text-3xl px-12 py-6 rounded-3xl shadow-lg hover:bg-yellow-600 transition">
                            Beginner
                        </button>
                        <button
                            onClick={() => startGameWithDifficulty('gemiddeld')}
                            className="bg-yellow-500 w-80 text-black text-3xl px-12 py-6 rounded-3xl shadow-lg hover:bg-yellow-600 transition">
                            Intermediate
                        </button>
                        <button
                            onClick={() => startGameWithDifficulty('gevorderd')}
                            className="bg-yellow-500 w-80 text-black text-3xl px-12 py-6 rounded-3xl shadow-lg hover:bg-yellow-600 transition">
                            Advanced
                        </button>
                    </div>
                )}
                {gameEnded && (
                    <div className="flex flex-col gap-5 items-center">
                        <div className="flex gap-4">
                            <button
                                onClick={restartGame}
                                className="bg-yellow-500 w-80 text-black text-2xl px-8 py-4 rounded-3xl shadow-lg hover:bg-yellow-600 transition">
                                Play Again
                            </button>
                            <button
                                onClick={returnToMenu}
                                className="bg-yellow-500 w-80 text-black text-2xl px-8 py-4 rounded-3xl shadow-lg hover:bg-yellow-600 transition">
                                Change Difficulty
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default GameComponent;
