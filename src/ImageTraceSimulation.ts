import {
    getImageLookupColorFunction, getNinetyDegreeBounceEdgeDetector,
    getRandomFloat,
    getRandomInt, getStaticSizeFunction, INT_0,
    throwFrameworkErrorIfReturned,
    ORIGIN, get2dPointFromArrayIndex, TWO_PI
} from "./framework/utils";
import {BaseColoredParticle2d} from "./framework/BaseColoredParticle2d";
import {
    Int,
    ISimulation, Point,
    RGBAImage,
} from "./framework/types";
import Victor from "victor";

export type ExampleSimulationConfig = {
    colorPalettes: string[][]
    particleCount: number
    image: RGBAImage
    imageSpread: number
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
    private width: number;
    private height: number;


    private INIT_PARTICLE_VELOCITY: number = 9;

    // TODO: why isn't init stuff in the constructor?
    constructor(drawContext: CanvasRenderingContext2D) {
        // @ts-ignore will be done in init
        this.palette = undefined;
        // @ts-ignore will be done in init
        this.config = undefined;
        // @ts-ignore will be done in init
        this.image = undefined;
        // @ts-ignore will be done in init
        this.width = undefined;
        // @ts-ignore will be done in init
        this.height = undefined;

        this.drawContext = drawContext;
    }

    async init(config: ExampleSimulationConfig) {
        this.config = config;
        this.palette = config.colorPalettes[getRandomInt(config.colorPalettes.length - 1)];
        this.image = config.image;
        this.width = this.image.width * ( config.imageSpread || 1);
        this.height = this.image.height * ( config.imageSpread || 1);
        this.drawContext.canvas.width = this.width;
        this.drawContext.canvas.height = this.height;

        const colorLookupFromImage = getImageLookupColorFunction(this.image, this.config.imageSpread);
        for (let i = 0; i < this.config.particleCount; i++) {
            this.particles.push(
                new BaseColoredParticle2d(
                    {x: getRandomInt(this.width), y: getRandomInt(this.height)},
                    new Victor(
                        getRandomFloat(this.INIT_PARTICLE_VELOCITY, -this.INIT_PARTICLE_VELOCITY),
                        getRandomFloat(this.INIT_PARTICLE_VELOCITY, -this.INIT_PARTICLE_VELOCITY)),
                    ORIGIN,
                    {
                        x: (this.width - 1) as Int, // images are 1 based, location is 0 based
                        y: (this.height - 1) as Int
                    },
                    getStaticSizeFunction(1),
                    getNinetyDegreeBounceEdgeDetector(ORIGIN, {
                        x: (this.width - 1) as Int,
                        y: (this.height - 1) as Int
                    }),
                    throwFrameworkErrorIfReturned(colorLookupFromImage),
                    (p) => {
                        return p.velocity.multiplyScalar(-1).add( new Victor(5 * Math.cos(p.tick),5 * Math.cos(p.tick) ));
                    }
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
            ctx.fillRect(0 as Int, 0 as Int, this.width, this.height);
            this.backgroundDrawn = true;
        }

        // draw image (debug)
        // this.image.pixels.forEach((pixel,index) => {
        //     ctx.save();
        //     //console.log(`fill = ${pixel.color.toCssColor()}`);
        //     ctx.fillStyle = pixel.color.toCssColor();
        //
        //     //ctx.fillStyle = 'green';
        //
        //     //const pixelLocation: Point = get2dPointFromArrayIndex(index, this.image.width);
        //     let circle: Path2D = new Path2D();
        //     circle.arc((pixel.location.x * 4), (pixel.location.y * 4), 1, 0, TWO_PI);
        //     ctx.fill(circle);
        //     ctx.restore();
        // })

        // console.log('finished drawing pixels');


        // draw particles
        this.particles.forEach(p => p.draw(ctx));
        ctx.restore();
    }
}
