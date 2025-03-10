import React, { useEffect, useRef } from 'react';
import { Game } from './js/game';

function GameComponent() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const game = new Game(canvasRef.current);
        game.start();

        return () => {
            game.stop();
        };
    }, []);

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                height: '100vh',
                paddingTop: '5vh',
                gap: '1rem'
            }}
        >
            <canvas
                ref={canvasRef}
                width={900}
                height={500}
                style={{
                    border: '2px solid #000',
                    backgroundColor: '#000'
                }}
            />
        </div>
    );
}

export default GameComponent;
