import {getRandomInt} from "./framework/utils";
import {Particle2d} from "./framework/Particle2d";
import {FrameworkError, IParticle2d, ISimulation, RGBAImage} from "./framework/types";
import {BaseFrameworkError} from "./framework/error/BaseFrameworkError";
import PNG from "png-ts";

export type ExampleSimulationConfig = {
    colorPalettes: string[][]
    particleCount: number
    image: RGBAImage
}

/**
 * uses DOM window, document
 */
export class ImageTraceSimulation implements ISimulation {
    particles: Particle2d[] = [];
    private palette: string[];
    private config: ExampleSimulationConfig;
    private image: RGBAImage;
    private drawContext: CanvasRenderingContext2D;

    constructor(drawContext: CanvasRenderingContext2D) {
        // @ts-ignore will be done in init
        this.palette = undefined;
        // @ts-ignore will be done in init
        this.config = undefined;
        // @ts-ignore will be done in init
        this.image = undefined;

        this.drawContext = drawContext;
    }

    async init(config: ExampleSimulationConfig) {
        this.config = config;
        this.palette = config.colorPalettes[getRandomInt(config.colorPalettes.length - 1)];
        this.image = config.image;

        this.drawContext.canvas.width = this.image.width;
        this.drawContext.canvas.height = this.image.height;

        for (let i = 0; i < this.config.particleCount; i++) {
            this.particles.push(
                new Particle2d(
                    i,
                    {x: getRandomInt(this.image.width), y: getRandomInt(this.image.height)},
                    {
                        x: this.image.width - 1, // images are 1 based, location is 0 based
                        y: this.image.height - 1
                    },
                    {palette: this.palette})
            )
        }
    }

    update() {
        this.particles.forEach(p => p.update(this.image))
    }

    backgroundDrawn = false;

    draw(ctx: CanvasRenderingContext2D) {
        // draw background
        if (!this.backgroundDrawn) {
            ctx.fillStyle = this.palette[0];//getRandomInt(this.palette.length)];
            ctx.fillRect(0, 0, this.image.width, this.image.height);
            this.backgroundDrawn = true;
        }
        // draw particles
        this.particles.forEach(p => p.draw(ctx));
    }
}
