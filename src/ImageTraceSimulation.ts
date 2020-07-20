import {
    getImageLookupColorFunction, getNinetyDegreeBounceEdgeDetector,
    getRandomFloat,
    getRandomInt, getStaticSizeFunction,
    throwFrameworkErrorIfReturned,
    TWO_PI
} from "./framework/utils";
import {BaseColoredParticle2d} from "./framework/BaseColoredParticle2d";
import {
    ISimulation,
    RGBAImage,
} from "./framework/types";
import Victor from "victor";

export type ExampleSimulationConfig = {
    colorPalettes: string[][]
    particleCount: number
    image: RGBAImage
}

/**
 * uses DOM window, document
 */
export class ImageTraceSimulation implements ISimulation {
    particles: BaseColoredParticle2d[] = [];
    private palette: string[];
    private config: ExampleSimulationConfig;
    private image: RGBAImage;
    private drawContext: CanvasRenderingContext2D;

    private INIT_PARTICLE_VELOCITY: number = 3;

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

        const colorLookupFromImage = getImageLookupColorFunction(this.image);

        for (let i = 0; i < this.config.particleCount; i++) {
            this.particles.push(
                new BaseColoredParticle2d(
                    {x: getRandomInt(this.image.width), y: getRandomInt(this.image.height)},
                    new Victor(
                        getRandomFloat(this.INIT_PARTICLE_VELOCITY,-this.INIT_PARTICLE_VELOCITY),
                        getRandomFloat(this.INIT_PARTICLE_VELOCITY,-this.INIT_PARTICLE_VELOCITY)),
                    {x: 0, y: 0},
                    {
                        x: this.image.width - 1, // images are 1 based, location is 0 based
                        y: this.image.height - 1
                    },
                    getStaticSizeFunction(3),
                    getNinetyDegreeBounceEdgeDetector({x:0,y:0}, {x:this.image.width,y:this.image.height}),
                    throwFrameworkErrorIfReturned(colorLookupFromImage)
                )
            );
        }
    }

    update() {
        this.particles.forEach(p => p.update(this.image))
    }

    backgroundDrawn = false;

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        // draw background
        if (!this.backgroundDrawn) {
            ctx.fillStyle = this.palette[0];//getRandomInt(this.palette.length)];
            ctx.fillRect(0, 0, this.image.width, this.image.height);
            this.backgroundDrawn = true;
        }
        // draw particles
        this.particles.forEach(p => p.draw(ctx));
        ctx.restore();
    }
}
