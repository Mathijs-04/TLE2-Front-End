import {Actor, Vector} from "excalibur";
import { Resources, ResourceLoader } from './resources';

export class letterDisplay extends Actor {

    constructor(x, y) {
        super({
            pos: new Vector(x, y),

        });
        this.graphics.use(Resources.Tv.toSprite());
        this.scale = new Vector(1, 1);

        this.z = 5

    }


    onInitialize(engine) {
        const tvSpritesheet = SpriteSheet.fromImageSource({
            image: Resources.Tv,
            grid: {
                rows: 1,
                columns: 5,
                spriteWidth: 880,
                spriteHeight: 600
            },
        });

        const tvAnimation = Animation.fromSpriteSheet(tvSpritesheet, range(0, 4), 2000, AnimationStrategy.Loop);

        // Add the animation to the graphics component
        this.graphics.add("tv", tvAnimation);

        // Use the animation
        this.graphics.use("tv");
    }
}