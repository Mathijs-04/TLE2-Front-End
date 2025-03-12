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
                        <h2 className="text-navy text-5xl font-nunito font-bold">Selecteer Niveau</h2>
                        <button
                            onClick={() => startGameWithDifficulty('beginner')}
                            className="bg-Yellow w-80 text-Navy text-3xl font-nunito font-bold px-12 py-6 rounded-3xl shadow-lg hover:bg-yellow-500 transition">
                            Beginner
                        </button>
                        <button
                            onClick={() => startGameWithDifficulty('gemiddeld')}
                            className="bg-Yellow w-80 text-Navy text-3xl font-nunito font-bold px-12 py-6 rounded-3xl shadow-lg hover:bg-yellow-500 transition">
                            Gemiddeld
                        </button>
                        <button
                            onClick={() => startGameWithDifficulty('gevorderd')}
                            className="bg-Yellow w-80 text-Navy text-3xl font-nunito font-bold px-12 py-6 rounded-3xl shadow-lg hover:bg-yellow-500 transition">
                            Gevorderd
                        </button>
                    </div>
                )}
                {gameEnded && (
                    <div className="flex flex-col gap-5 items-center">
                        <div className="flex gap-4">
                            <button
                                onClick={restartGame}
                                className="bg-Yellow w-80 text-Navy text-2xl font-nunito font-bold px-8 py-4 rounded-3xl shadow-lg hover:bg-yellow-500 transition">
                                Speel opnieuw
                            </button>
                            <button
                                onClick={returnToMenu}
                                className="bg-Yellow w-80 text-Navy text-2xl font-nunito font-bold px-8 py-4 rounded-3xl shadow-lg hover:bg-yellow-500 transition">
                                Ander niveau
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default GameComponent;
