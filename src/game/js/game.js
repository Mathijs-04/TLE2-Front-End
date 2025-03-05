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
        console.log('Starting the game!');

        // Create snail actor
        const snail = new Actor();
        snail.graphics.use(Resources.Snail.toSprite());
        snail.pos = new Vector(-120, 180);
        snail.vel = new Vector(0, 0); // Initially no velocity
        this.add(snail);

        // Create a label to display the current key
        const keyLabel = new Label({
            text: this.getRandomKey(),
            pos: new Vector(320, 40),
            font: new Font({
                size: 32,
                family: 'Arial',
                color: Color.White
            }),
            textAlign: TextAlign.Center
        });
        this.add(keyLabel);

        // Ensure keypresses are captured by listening on the window or document
        window.addEventListener('keydown', (evt) => {
            const pressedKey = evt.key.toLowerCase(); // Normalize to lowercase

            // Check if the correct key was pressed
            if (pressedKey === keyLabel.text) {
                // Move the snail when the correct key is pressed
                snail.pos.x += 20; // Move snail 20 pixels to the right

                // Update the key label with a new random key
                keyLabel.text = this.getRandomKey();
            }
        });
    }

    // Function to get a random key for the user to press
    getRandomKey() {
        const keys = 'abcdefghijklmnopqrstuvwxyz'.split('');
        return keys[Math.floor(Math.random() * keys.length)];
    }
}
