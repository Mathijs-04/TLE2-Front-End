import '../css/style.css';
import { Actor, Engine, Vector, DisplayMode, Color, Label, Font, TextAlign } from 'excalibur';
import { Resources, ResourceLoader } from './resources.js';

export class Game extends Engine {
    constructor(canvasElement) {
        super({
            canvasElement: canvasElement,
            displayMode: DisplayMode.Fixed,
            width: 640,
            height: 360,
            backgroundColor: Color.Black,
            suppressPlayButton: true
        });

        this.start(ResourceLoader).then(() => {
            this.startGame();
        });
    }

    startGame() {
        const snail = new Actor();
        snail.graphics.use(Resources.Snail.toSprite());
        snail.pos = new Vector(-120, 180);
        this.add(snail);

        this.alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
        this.lettersQueue = this.shuffleArray([...this.alphabet]);

        this.currentLetter = new Label({
            text: this.lettersQueue[0],
            pos: new Vector(320, 40),
            font: new Font({
                size: 32,
                family: 'Arial',
                color: Color.White
            }),
            textAlign: TextAlign.Center
        });
        this.add(this.currentLetter);

        this.correctLetters = [];

        window.addEventListener('keydown', (evt) => {
            const pressedKey = evt.key.toLowerCase();

            if (pressedKey === this.currentLetter.text) {
                snail.pos.x += 28;

                if (!this.correctLetters.includes(pressedKey)) {
                    this.correctLetters.push(pressedKey);
                }

                if (this.correctLetters.length === 26) {
                    this.endGame(snail);
                } else {
                    this.currentLetter.text = this.lettersQueue[this.correctLetters.length];
                }
            }

            // % Motion Tracking Logic:
            // 1. The hand gesture detection will capture the hand's position and movement.
            // 2. The API provides a certainty value from 0% to 100%, indicating how confident the system is in detecting the gesture.
            // 3. Any gesture with a certainty value above 60% is considered valid for the game.
            // 4. If the certainty is > 80%, the system rewards extra movement for that input.
            // 5. For now, we're using typed input, but the motion tracking will replace it in the future.

            // Example Code:
            // This would be executed inside a motion tracking loop where the certainty value is updated.
            // if (handMovementDetected) {
            //     const certainty = getGestureCertainty(); // Call the motion tracking API to get certainty (0-100%)
            //     if (certainty >= 60) {
            //         // Simulate the "key press" and move the snail
            //         snail.pos.x += 28;

            //         // Check if the gesture is > 80% for further movement
            //         if (certainty > 80) {
            //             snail.pos.x += 10; // Further move the snail if certainty is greater than 80%
            //         }

            //         // Proceed to the next letter after a valid gesture
            //         this.currentLetter.text = this.lettersQueue[this.correctLetters.length];
            //         this.correctLetters.push(this.currentLetter.text);
            //     }
            // }
        });
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    endGame(snail) {
        snail.kill();
        this.currentLetter.kill();

        const endLabel = new Label({
            text: 'End',
            pos: new Vector(280, 80),
            font: new Font({
                size: 48,
                family: 'Arial',
                color: Color.White
            }),
            textAlign: TextAlign.Center
        });
        this.add(endLabel);
    }
}
