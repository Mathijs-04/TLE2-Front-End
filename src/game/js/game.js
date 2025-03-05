// Make sure that any updates in the canvas do not use react state or props.

import '../css/style.css';
import { Actor, Engine, Vector, DisplayMode, Color } from 'excalibur';
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
        const fish = new Actor();
        fish.graphics.use(Resources.Fish.toSprite());
        fish.pos = new Vector(200, 180);
        fish.vel = new Vector(-10, 0);
        this.add(fish);
    }
}
