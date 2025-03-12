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
            y: 360 ,
            anchor: new Vector(0.5, 0.5)
        });

        console.log(this.difficulty)
        if (this.difficulty === 'beginner') {
            background.graphics.use(Resources.BgEasy.toSprite());
            this.add(background);
        }
        else if (this.difficulty === 'gemiddeld') {
            background.graphics.use(Resources.BgNormal.toSprite());
            this.add(background);
        }
        else if (this.difficulty === 'gevorderd') {
            background.graphics.use(Resources.BgHard.toSprite());
            this.add(background);
        }
    }



    startGame() {



        this.difficultyCheck()

        const snail = new Actor();
        snail.graphics.use(Resources.Snail.toSprite());
        snail.pos = new Vector(-120, 310);
        snail.scale = new Vector(1, 1);
        this.add(snail);


        console.log("Starting game...");
        this.snail = new Actor();
        this.snail.graphics.use(Resources.Snail.toSprite());
        this.snail.pos = new Vector(-120, 360);
        this.snail.scale = new Vector(1.4, 1.4);
        this.add(this.snail);

        this.alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
        this.lettersQueue = this.shuffleArray([...this.alphabet]);

        this.currentLetter = new Label({
            text: this.lettersQueue[0].toUpperCase(),
            pos: new Vector(620, 100),
            font: new Font({ size: 64, family: 'Arial', color: Color.White }),
            textAlign: TextAlign.Center
        });
        this.add(this.currentLetter);

        this.timerLabel = new Label({
            text: 'Time: 3',
            pos: new Vector(50, 20),
            font: new Font({ size: 32, family: 'Arial', color: Color.White }),
            textAlign: TextAlign.Left
        });
        this.add(this.timerLabel);

        this.scoreLabel = new Label({
            text: '',
            pos: new Vector(50, 60),
            font: new Font({ size: 32, family: 'Arial', color: Color.White }),
            textAlign: TextAlign.Left
        });
        this.add(this.scoreLabel);

        this.difficultyLabel = new Label({
            text: `Difficulty: ${this.difficulty.charAt(0).toUpperCase() + this.difficulty.slice(1)}`,
            pos: new Vector(50, 650),
            font: new Font({ size: 32, family: 'Arial', color: Color.White }),
            textAlign: TextAlign.Left
        });
        this.add(this.difficultyLabel);

        this.explanationLabel = new Label({
            text: '',
            pos: new Vector(480, 580),
            font: new Font({ size: 32, family: 'Arial', color: Color.Red }),
            textAlign: TextAlign.Center
        });
        this.add(this.explanationLabel);

        this.inputEnabled = false;
        this.countdown = 0;
        this.timerId = null;

        this.keyDownHandler = (evt) => {
            if (evt.key === 'Enter') {
                if (this.lettersQueue.length > 1) {
                    this.lettersQueue = [this.lettersQueue[this.lettersQueue.length - 1]];
                    this.currentLetter.text = this.lettersQueue[0].toUpperCase();
                    this.snail.pos.x += 55 * 25;
                    console.log("Skipped to the last letter.");
                }
                return;
            }
        };

        window.addEventListener('keydown', this.keyDownHandler);
        this.startNewTimer();
    }

    handleGestureDetection(result) {
        if (!this.inputEnabled || !result || result.length === 0) {
            console.log("Input not enabled or no result.");
            return;
        }

        const targetChar = this.lettersQueue[0];
        console.log(`Expected letter: ${targetChar}, Detected letters:`, result);

        const detectedLetters = result.map(([letter]) => letter);
        if (detectedLetters.includes(targetChar)) {
            console.log(`Correct letter detected: ${targetChar}`);
            this.snail.pos.x += 55;
            this.lettersQueue.shift();

            if (this.lettersQueue.length === 0) {
                this.endGame(this.snail);
            } else {
                this.currentLetter.text = this.lettersQueue[0].toUpperCase();
                this.startNewTimer();
            }
            this.explanationLabel.text = '';
        } else {
            console.log(`Incorrect letter. Expected: ${targetChar}`);
            this.explanationLabel.text = `Wrong letter! Expected ${targetChar.toUpperCase()}`;
            this.startNewTimer();
        }

        this.inputEnabled = false;
    }

    startNewTimer() {
        if (this.timerId) clearInterval(this.timerId);

        this.countdown = 3;
        this.timerLabel.text = `Time: ${this.countdown}`;
        this.inputEnabled = false;

        this.timerId = setInterval(() => {
            this.countdown--;
            this.timerLabel.text = `Time: ${this.countdown}`;

            if (this.countdown <= 0) {
                clearInterval(this.timerId);
                this.inputEnabled = true;
                this.timerLabel.text = 'Input now!';
                this.scoreLabel.text = '';
            }
        }, 1000);
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    endGame(snail) {
        console.log("Game ended.");
        window.removeEventListener('keydown', this.keyDownHandler);
        snail.kill();
        this.currentLetter.kill();
        this.timerLabel.kill();
        this.scoreLabel.kill();
        this.difficultyLabel.kill();
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
