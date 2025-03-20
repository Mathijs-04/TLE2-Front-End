import '../css/style.css';
import {Actor, Engine, Vector, DisplayMode, Color, Label, Font, TextAlign} from 'excalibur';
import {Resources, ResourceLoader} from './resources.js';

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

    // countdown(){
    //
    // }


    difficultyCheck() {
        const background = new Actor({
            x: 640,
            y: 360,
            anchor: new Vector(0.5, 0.5)
        });


        console.log(this.difficulty)
        if (this.difficulty === 'beginner') {
            background.graphics.use(Resources.BgEasy.toSprite());
            this.add(background);
            this.snail.graphics.use(Resources.Snail.toSprite());
            const bgm1 = Resources.Bgm1;
            bgm1.play(0.2);

        } else if (this.difficulty === 'gemiddeld') {
            background.graphics.use(Resources.BgNormal.toSprite());
            this.add(background);
            this.snail.graphics.use(Resources.Snail1.toSprite());
            this.exampleTimerGoal = 8;
            const bgm2 = Resources.Bgm2;
            bgm2.play(0.2);


        } else if (this.difficulty === 'gevorderd') {
            background.graphics.use(Resources.BgHard.toSprite());
            this.add(background);
            this.snail.graphics.use(Resources.Snail2.toSprite());
            this.exampleTimerGoal = 999;
            const bgm3 = Resources.Bgm3;
            bgm3.play(0.2);

        }
    }

    startGame() {

        if (Resources.Bgm1) {
            Resources.Bgm1.stop()
        }
        if (Resources.Bgm2) {
            Resources.Bgm2.stop()
        }
        if (Resources.Bgm3) {
            Resources.Bgm3.stop()
        }


        // this.countdown()








        setTimeout(() => {


            console.log("Starting game...");
            this.elapsedTime = 0; // Keeps track of elapsed seconds
            this.exampleTimer = 0;
            this.exampleTimerGoal = 2;

            this.snail = new Actor();

            this.difficultyCheck()

            this.snail.pos = new Vector(0, 300);
            this.snail.scale = new Vector(0.5, 0.5);
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
            console.log(shuffledValues);
            this.lettersQueue = shuffledValues;


            this.timerLabel = new Label({
                text: `Time: ${this.elapsedTime}s`,
                pos: new Vector(50, 20), // Position on screen
                font: new Font({
                    size: 46,
                    family: "Roboto Mono, monospace",
                    color: Color.Black,
                }),
                textAlign: TextAlign.Left,
            });
            this.add(this.timerLabel);


            this.currentLetter = new Label({
                text: this.lettersQueue[0].toUpperCase(),
                pos: new Vector(610, 520),
                font: new Font({
                    size: 130,
                    family: "Roboto Mono, monospace",
                    color: Color.Yellow
                }),
                textAlign: TextAlign.Center,
                bold: true,
                shadow: {
                    blur: 2,
                    offset: new Vector(2, 2),
                    color: Color.Black,
                }
            });
            this.add(this.currentLetter);

            const success = Resources.Success;

            // this.timerLabel = new Label({
            //     text: 'Time: 3',
            //     pos: new Vector(510, 510),
            //     font: new Font({
            //         size: 26,
            //         family: "Roboto Mono, monospace",
            //         color: Color.White
            //     }),
            //     textAlign: TextAlign.Center
            //
            // });
            // this.add(this.timerLabel);

            this.scoreLabel = new Label({
                text: '',
                pos: new Vector(50, 60),
                font: new Font({
                    size: 32,
                    family: "Roboto Mono, monospace",
                    color: Color.White
                }),
                textAlign: TextAlign.Left
            });
            this.add(this.scoreLabel);

            this.difficultyLabel = new Label({
                text: `${this.difficulty.charAt(0).toUpperCase() + this.difficulty.slice(1)}`,
                pos: new Vector(50, 70),
                anchor: new Vector(0.5, 0.5), // Align the label's center to the pos
                font: new Font({
                    size: 32,
                    family: "Roboto Mono, monospace",
                    color: Color.Black,
                }),
                textAlign: TextAlign.Center

            });
            this.add(this.difficultyLabel);

            this.explanationLabel = new Label({
                text: '',
                pos: new Vector(480, 580),
                font: new Font({size: 32, family: 'Arial', color: Color.Red}),
                textAlign: TextAlign.Center
            });
            this.add(this.explanationLabel);

            this.keyDownHandler = (evt) => {
                if (evt.key === 'Enter') {
                    if (this.lettersQueue.length > 1) {
                        this.lettersQueue = [this.lettersQueue[this.lettersQueue.length - 1]];
                        this.currentLetter.text = this.lettersQueue[0].toUpperCase();
                        this.snail.pos.x += 46 * 25;
                        console.log("Skipped to the last letter.");
                    }
                }
            };


            //development bypass for handdetection with spacebar, remove when live
            window.addEventListener("keydown", (evt) => {
                if (evt.key === "k") {
                    success.play(0.5);


                    this.snail.actions.moveBy(new Vector(46, 0), 200); // Moves 46px to the right in 200ms
                    this.lettersQueue.shift();
                    this.currentLetter.font.color = Color.Blue;

                    setTimeout(() => {
                        this.currentLetter.font.color = Color.Yellow;
                        this.feedbackLabel.kill();

                    }, 2000);

                    this.feedbackLabel = new Label({
                        text: 'Succes!',
                        pos: new Vector(680, 520),
                        font: new Font({
                            family: "Roboto Mono, monospace",
                            size: 30,
                            color: Color.White
                        })
                    });
                    this.add(this.feedbackLabel)

                    // Move upward by 50 pixels over 2000ms
                    this.feedbackLabel.actions.moveBy(new Vector(0, -50), 50)
                    // Fade out from full opacity to 0 over 2000ms
                    this.feedbackLabel.actions.fade(0, 1000)

                    // Once the animation is complete, remove the label from the scene
                }
            });

            window.addEventListener('keydown', this.keyDownHandler);


        }, 5000);

    }


    handleGestureDetection(result) {
        if (!result || result.length === 0 || this.lettersQueue.length === 0) return;

        const success = Resources.Success;
        const targetChar = this.lettersQueue[0].toLowerCase();
        const detectedLetters = result.map(([letter]) => letter.toLowerCase());
        console.log(`Detected letters: ${detectedLetters}`);
        if (detectedLetters.includes(targetChar)) {
            this.snail.actions.moveBy(new Vector(46, 0), 200);
            success.play(0.5);
            this.lettersQueue.shift();


            if (this.lettersQueue.length === 0) {
                this.endGame(this.snail);
            } else {

                this.currentLetter.font.color = Color.Green;


                setTimeout(() => {
                    this.currentLetter.font.color = Color.Yellow;
                    this.currentLetter.text = this.lettersQueue[0].toUpperCase();
                    this.feedbackLabel.kill();

                }, 2000);


                this.feedbackLabel = new Label({
                    text: 'Success!',
                    pos: new Vector(680, 520),
                    font: new Font({
                        family: "Roboto Mono, monospace",
                        size: 30,
                        color: Color.Green
                    })
                });
                this.add(this.feedbackLabel)

                // Move upward by 50 pixels over 2000ms
                this.feedbackLabel.actions.moveBy(new Vector(0, -50), 50)
                // Fade out from full opacity to 0 over 2000ms
                this.feedbackLabel.actions.fade(0, 1000)

                if (this.exampleLetter) {
                    this.exampleLetter.kill();
                }
                this.exampleTimer = 0;


            }

            this.explanationLabel.text = '';
        } else {
            // this.explanationLabel.text = `Wrong letter! Expected ${this.lettersQueue[0].toUpperCase()}`;
        }
    }

    showExample() {
        console.log('example showing')
        this.exampleLetter = new Actor();

        let targetLetter = this.lettersQueue[0];
        console.log(targetLetter);

        let resourceKey = `letter${targetLetter.toUpperCase()}`; // e.g., "letterB"
        this.exampleLetter.graphics.use(Resources[resourceKey].toSprite());

        this.exampleLetter.pos = new Vector(210, 590);
        this.exampleLetter.scale = new Vector(1, 1);
        this.exampleLetter.graphics.flipHorizontal = true;
        this.exampleLetter.graphics.color = Color.White;

        this.add(this.exampleLetter);

    }

    timerInterval = setInterval(() => {
        this.elapsedTime++;
        if (this.exampleTimer <= 8) {
            this.exampleTimer++;
            console.log(this.exampleTimer)
        }



        this.timerLabel.text = `Time: ${this.elapsedTime}s`;
        if (this.exampleTimer === this.exampleTimerGoal) {
            this.showExample()
        }
    }, 1000);

    // startNewTimer() {
    //     if (this.timerId) clearInterval(this.timerId);
    //
    //     this.countdown = 3;
    //     this.timerLabel.text = `Time: ${this.countdown}`;
    //     this.inputEnabled = false;
    //
    //     this.timerId = setInterval(() => {
    //         this.countdown--;
    //         this.timerLabel.text = `Time: ${this.countdown}`;
    //
    //         if (this.countdown <= 0) {
    //             clearInterval(this.timerId);
    //             this.inputEnabled = true;
    //             this.timerLabel.text = 'Input now!';
    //             this.scoreLabel.text = '';
    //             this.currentLetter.font.color = Color.Yellow;
    //
    //         }
    //     }, 1000);
    // }

    endGame(snail) {

        clearInterval(this.timerInterval); // Stops the timer
        let finalTime = this.elapsedTime;
        console.log(finalTime * 1000)
        localStorage.setItem("playTime", finalTime * 1000);
        finalTime = null;
        window.removeEventListener('keydown', this.keyDownHandler);
        snail.kill();
        this.currentLetter.kill();
        this.scoreLabel.kill();
        this.difficultyLabel.kill();
        this.explanationLabel.kill();

        if (Resources.Bgm1) {
            Resources.Bgm1.stop()
        }
        if (Resources.Bgm2) {
            Resources.Bgm2.stop()
        }
        if (Resources.Bgm3) {
            Resources.Bgm3.stop()
        }


        const endLabel = new Label({
            text: 'Game Ended',
            pos: new Vector(460, 300),
            font: new Font({size: 64, family: 'Arial', color: Color.White}),
            textAlign: TextAlign.Center
        });
        this.add(endLabel);

        setTimeout(() => {
            if (this.onGameEnd) this.onGameEnd();
        }, 1);
    }

}
