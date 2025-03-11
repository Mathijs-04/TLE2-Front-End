import React, { useEffect, useRef, useState } from 'react';
import { Game } from './js/game';
import Navigation from "../components/Navigation.jsx";

function GameComponent() {
    const canvasRef = useRef(null);
    const [gameStarted, setGameStarted] = useState(false);
    const [difficulty, setDifficulty] = useState(null);

    const startGameWithDifficulty = (selectedDifficulty) => {
        setDifficulty(selectedDifficulty);
        setGameStarted(true);
    };

    useEffect(() => {
        if (gameStarted && difficulty) {
            const game = new Game(canvasRef.current, difficulty);
            game.start();

            return () => {
                game.stop();
            };
        }
    }, [gameStarted, difficulty]);

    return (
        <>
            <Navigation />
            <div className="flex flex-col items-center justify-start h-screen pt-[5vh] gap-4">
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

                {gameStarted && (
                    <canvas
                        ref={canvasRef}
                        width={900}
                        height={500}
                        className="border-2 border-black bg-black"
                    />
                )}
            </div>
        </>
    );
}

export default GameComponent;
