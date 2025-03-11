import React, { useEffect, useRef, useState } from 'react';
import { Game } from './js/game';
import Navigation from "../components/Navigation.jsx";

function GameComponent() {
    const canvasRef = useRef(null);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameEnded, setGameEnded] = useState(false);
    const [difficulty, setDifficulty] = useState(null);
    const gameRef = useRef(null);

    const startGameWithDifficulty = (selectedDifficulty) => {
        setDifficulty(selectedDifficulty);
        setGameStarted(true);
        setGameEnded(false);
    };

    const restartGame = () => {
        setGameEnded(false);
        if (gameRef.current) {
            gameRef.current.stop();
        }
        gameRef.current = new Game(canvasRef.current, difficulty, () => {
            setGameEnded(true);
        });
        gameRef.current.start();
    };

    const returnToMenu = () => {
        setGameStarted(false);
        setGameEnded(false);
        if (gameRef.current) {
            gameRef.current.stop();
        }
    };

    useEffect(() => {
        if (gameStarted && difficulty && !gameEnded) {
            if (gameRef.current) {
                gameRef.current.stop();
            }
            gameRef.current = new Game(canvasRef.current, difficulty, () => {
                setGameEnded(true);
            });
            gameRef.current.start();
        }
    }, [gameStarted, difficulty, gameEnded]);

    useEffect(() => {
        if (gameStarted) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [gameStarted]);

    return (
        <>
            <Navigation />
            <div className="flex flex-col items-center justify-start h-screen pt-[5vh] gap-4 overflow-y-hidden">
                <canvas
                    ref={canvasRef}
                    width={1280}
                    height={720}
                    className="border-2 border-black bg-black"
                    style={{ display: gameStarted ? 'block' : 'none' }}
                />
                {!gameStarted && (
                    <div className="flex flex-col gap-5 items-center">
                        <h2 className="text-white text-2xl">Select Difficulty</h2>
                        <button
                            onClick={() => startGameWithDifficulty('beginner')}
                            className="bg-gray-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-gray-600 transition-colors w-48"
                        >
                            Beginner
                        </button>
                        <button
                            onClick={() => startGameWithDifficulty('gemiddeld')}
                            className="bg-gray-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-gray-600 transition-colors w-48"
                        >
                            Gemiddeld
                        </button>
                        <button
                            onClick={() => startGameWithDifficulty('gevorderd')}
                            className="bg-gray-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-gray-600 transition-colors w-48"
                        >
                            Gevorderd
                        </button>
                    </div>
                )}
                {gameEnded && (
                    <div className="flex flex-col gap-5 items-center">
                        <h2 className="text-white text-4xl">Game Completed!</h2>
                        <div className="flex gap-4">
                            <button
                                onClick={restartGame}
                                className="bg-gray-500 text-white px-8 py-4 rounded-lg text-xl hover:bg-gray-600 transition-colors w-48"
                            >
                                Opnieuw
                            </button>
                            <button
                                onClick={returnToMenu}
                                className="bg-gray-500 text-white px-8 py-4 rounded-lg text-xl hover:bg-gray-600 transition-colors w-48"
                            >
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
