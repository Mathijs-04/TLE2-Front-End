import '../css/style.css';
import { Actor, Engine, Vector, DisplayMode, Color, Label, Font, TextAlign } from 'excalibur';
import { Resources, ResourceLoader } from './resources.js';

export class Game extends Engine {
    constructor(canvasElement, difficulty, onGameEnd) {
        super({
            canvasElement: canvasElement,
            displayMode: DisplayMode.Fixed,
            width: 1280,
            height: 720,
            backgroundColor: Color.Black,
            suppressPlayButton: true
        });

        this.difficulty = difficulty;
        this.onGameEnd = onGameEnd;
        this.start(ResourceLoader).then(() => this.startGame());
    }

    difficultyCheck() {
        const background = new Actor({
            x: 640,
            y: 360,
            anchor: new Vector(0.5, 0.5)
        });

        if (this.difficulty === 'beginner') {
            background.graphics.use(Resources.BgEasy.toSprite());
            this.add(background);
        } else if (this.difficulty === 'gemiddeld') {
            background.graphics.use(Resources.BgNormal.toSprite());
            this.add(background);
        } else if (this.difficulty === 'gevorderd') {
            background.graphics.use(Resources.BgHard.toSprite());
            this.add(background);
        }
    }

    startGame() {
        this.difficultyCheck();

        this.snail = new Actor();
        this.snail.graphics.use(Resources.Snail.toSprite());
        this.snail.pos = new Vector(-120, 300);
        this.snail.scale = new Vector(1, 1);
        this.add(this.snail);

        const shuffleArray = (array) => {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        };

        const retrieveAndShuffleValues = () => {
            const characters = JSON.parse(localStorage.getItem('characters')) || [];
            const values = characters.map(character => character.value);
            return shuffleArray(values);
        };

        const shuffledValues = retrieveAndShuffleValues();
        this.lettersQueue = shuffledValues;

        this.currentLetter = new Label({
            text: this.lettersQueue[0].toUpperCase(),
            pos: new Vector(620, 550),
            font: new Font({ size: 64, family: 'Arial', color: Color.White }),
            textAlign: TextAlign.Center
        });
        this.add(this.currentLetter);

        this.explanationLabel = new Label({
            text: '',
            pos: new Vector(480, 580),
            font: new Font({ size: 32, family: 'Arial', color: Color.Red }),
            textAlign: TextAlign.Center
        });
        this.add(this.explanationLabel);

        this.keyDownHandler = (evt) => {
            if (evt.key === 'Enter') {
                if (this.lettersQueue.length > 1) {
                    this.lettersQueue = [this.lettersQueue[this.lettersQueue.length - 1]];
                    this.currentLetter.text = this.lettersQueue[0].toUpperCase();
                    this.snail.pos.x += 55 * 25;
                }
            }
        };

        window.addEventListener('keydown', this.keyDownHandler);
    }

    handleGestureDetection(result) {
        if (!result || result.length === 0 || this.lettersQueue.length === 0) return;

        const targetChar = this.lettersQueue[0].toLowerCase();
        const detectedLetters = result.map(([letter]) => letter.toLowerCase());

        if (detectedLetters.includes(targetChar)) {
            this.snail.pos.x += 55;
            this.lettersQueue.shift();

            if (this.lettersQueue.length === 0) {
                this.endGame(this.snail);
            } else {
                this.currentLetter.text = this.lettersQueue[0].toUpperCase();
            }
            this.explanationLabel.text = '';
        } else {
            // this.explanationLabel.text = `Wrong letter! Expected ${this.lettersQueue[0].toUpperCase()}`;
        }
    }

    endGame(snail) {
        window.removeEventListener('keydown', this.keyDownHandler);
        snail.kill();
        this.currentLetter.kill();
        this.explanationLabel.kill();

        const endLabel = new Label({
            text: 'Game Ended',
            pos: new Vector(460, 300),
            font: new Font({ size: 64, family: 'Arial', color: Color.White }),
            textAlign: TextAlign.Center
        });
        this.add(endLabel);

        setTimeout(() => {
            if (this.onGameEnd) this.onGameEnd();
        }, 1);
    }
}
