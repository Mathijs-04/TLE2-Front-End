import React, { useState, useEffect, useRef } from 'react';

const LetterGame = () => {
    const [letters, setLetters] = useState([]);
    const [score, setScore] = useState(0);
    const letterIdRef = useRef(0);

    // Animate letters falling by updating their "top" position on every animation frame.
    useEffect(() => {
        let animationFrameId;
        const updateLetters = () => {
            setLetters((prevLetters) =>
                prevLetters
                    .map((letter) => ({ ...letter, top: letter.top + letter.speed }))
                    .filter((letter) => letter.top < window.innerHeight)
            );
            animationFrameId = requestAnimationFrame(updateLetters);
        };
        animationFrameId = requestAnimationFrame(updateLetters);
        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    // Create a new letter every second.
    useEffect(() => {
        const intervalId = setInterval(() => {
            const newLetter = {
                id: letterIdRef.current++,
                char: String.fromCharCode(65 + Math.floor(Math.random() * 26)),
                left: Math.random() * (window.innerWidth - 30),
                top: -40,
                speed: Math.random() * 2 + 1, // Random speed between 1 and 3 pixels per frame
            };
            setLetters((prevLetters) => [...prevLetters, newLetter]);
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    // Listen for key presses to "catch" falling letters.
    useEffect(() => {
        const handleKeyDown = (event) => {
            const keyPressed = event.key.toUpperCase();
            setLetters((prevLetters) => {
                let found = false;
                // Remove the first matching letter.
                const updatedLetters = prevLetters.filter((letter) => {
                    if (!found && letter.char === keyPressed) {
                        found = true;
                        return false;
                    }
                    return true;
                });
                if (found) {
                    setScore((prevScore) => prevScore + 1);
                }
                return updatedLetters;
            });
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div
            style={{
                position: 'relative',
                width: '100vw',
                height: '100vh',
                overflow: 'hidden',
                backgroundColor: '#111',
            }}
        >
            <div style={{ position: 'absolute', top: 10, left: 10, fontSize: '24px', zIndex: 10, color: 'white' }}>
                Score: {score}
            </div>
            {letters.map((letter) => (
                <div
                    key={letter.id}
                    style={{
                        position: 'absolute',
                        fontSize: '36px',
                        fontWeight: 'bold',
                        color: '#0f0',
                        left: letter.left,
                        top: letter.top,
                    }}
                >
                    {letter.char}
                </div>
            ))}
        </div>
    );
};

export default LetterGame;
