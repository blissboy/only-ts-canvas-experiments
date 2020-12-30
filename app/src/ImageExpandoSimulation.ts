import Victor from "victor";
import {
    ImageBackedParticle,
    ISimulation,
    Point,
    RGBAImage,
    getPointOnLine,
    ExistingEntity,
    roundToInt,
    LocationFunction
} from "canvas-framework/dist";

export type ImageExpandoConfig = {
    background: string
    maintainAspectRatio: boolean
    stepsInCycle: number
    image: RGBAImage
    imageSpread: number,
    sprayStep: number,
    screenMaxSize: {
        width: number,
        height: number
    }
}

/**
 * uses DOM window, document
 */
export class ImageExpandoSimulation implements ISimulation {
    private particles: ImageBackedParticle[] = [];
    private config: ImageExpandoConfig;
    private drawContext: CanvasRenderingContext2D;
    private screenWidth: number;
    private screenHeight: number;
    private widthMult: number;
    private heighMult: number;
    private backgroundDrawn = false;
    private pointA: Point;
    private pointB: Point;

    private tick: number = 0;

    constructor(drawContext: CanvasRenderingContext2D, config: ImageExpandoConfig) {

        this.drawContext = drawContext;
        this.config = config;
        //this.image = config.image;

        // figure out what size we can fit in the canvas passed

        this.screenWidth = this.drawContext.canvas.width;
        this.screenHeight = this.drawContext.canvas.height;

        let widthMultLocal: number = this.screenWidth / config.image.width;
        let heightMultLocal: number = this.screenHeight / config.image.height;

        if (config.maintainAspectRatio) {
            widthMultLocal = widthMultLocal < heightMultLocal ? widthMultLocal : heightMultLocal;
            heightMultLocal = widthMultLocal;
        }

        this.widthMult = widthMultLocal;
        this.heighMult = heightMultLocal;

        // point A is the top left of the image when it zooms back to 1:1 scale
        this.pointA = {
            x: roundToInt((this.screenWidth - this.config.image.width) / 2),
            y: roundToInt((this.screenHeight - this.config.image.height) / 2)
        };
        this.pointB = {
            x: roundToInt(this.pointA.x + this.config.image.width),
            y: roundToInt(this.pointA.y + this.config.image.height)
        };
        const screenCenter: Point = {
            x: roundToInt(this.screenWidth / 2),
            y: roundToInt(this.screenHeight / 2)
        }
        const imageCenter: Point = {
            x: roundToInt(this.config.image.width / 2),
            y: roundToInt(this.config.image.height / 2)
        }


        this.config.image.pixels.forEach((pixel) => {
            const cVector: Victor = new Victor(imageCenter.x - pixel.location.x, imageCenter.y - pixel.location.y);
            const targetVec = cVector.multiplyScalar(this.widthMult); // assuming we are keeping aspect ratio here, e.g., no difference widthMult and heightMult
            const target: Point = {
                x: roundToInt(screenCenter.x + targetVec.x),
                y: roundToInt(screenCenter.y + targetVec.y)
            };

            //console.log( `For image location (${pixel.location.x},${pixel.location.y}):\n\ttarget: (${target.x},${target.y})\n\ttargetVec: (${targetVec.x},${targetVec.y})`);
            this.particles.push(
                new ImageBackedParticle(
                    {x: roundToInt(pixel.location.x + this.pointA.x), y: roundToInt(pixel.location.y + this.pointA.y)},
                    pixel.color.toCssColor(),
                    this.createParticleMoveFunction(target))
            );
        });
    }

    // @ts-ignore we will be fine w/o those functions
    private createParticleMoveFunction: (target: Point) => LocationFunction
        = (target) => {
        return (p: ImageBackedParticle) => {
            const step = p.tick % this.config.stepsInCycle;
            return getPointOnLine(p.homeLocation, target, step / this.config.stepsInCycle);
        }
    };


    private particleMoveFunction: LocationFunction = (p: ExistingEntity) => {
        const step = p.tick % this.config.stepsInCycle;
        const target: Point = {
            x: roundToInt(this.pointA.x + ((p as ImageBackedParticle).homeLocation.x * this.widthMult)),
            y: roundToInt(this.pointA.y + ((p as ImageBackedParticle).homeLocation.y * this.heighMult))
        }
        return getPointOnLine((p as ImageBackedParticle).homeLocation, target, step / this.config.stepsInCycle);
    }


    async init(config: ImageExpandoConfig) {/* all done in constructor*/
    }

    private sprayFactor: number = 1;
    private expanding: boolean = true;

    update() {
        this.tick++;
        console.log(`${new Date().toLocaleTimeString()} started tick:\n\ttick: ${this.tick}\n\tsprayFactor: ${this.sprayFactor}`);
        if (this.tick % this.config.stepsInCycle === 0) {
            this.expanding = !this.expanding;
            //this.sprayFactor = 7;
        } else {
            if (this.expanding) {
                this.sprayFactor += this.config.sprayStep;
            } else {
                this.sprayFactor -= this.config.sprayStep;
            }
        }
        this.particles.forEach((p, index) => {
            if (index % this.sprayFactor === 0) {
                p.update(this.tick);
            }
        });
        console.log(`${new Date().toLocaleTimeString()} finished tick ${this.tick}.`);
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        // draw background
//        if (!this.backgroundDrawn) {
        //ctx.fillStyle = this.config.background;
        //ctx.fillRect(0 as Int, 0 as Int, this.screenWidth, this.screenHeight);
        //ctx.clearRect(0, 0, this.screenWidth, this.screenHeight);
        //     this.backgroundDrawn = true;
        // }
        this.particles.forEach((p, index) => {
            if (index % this.sprayFactor < 2) {
                p.draw(ctx);
            }
        });

        //this.particles.forEach(p => p.draw(ctx));
        ctx.restore();
    }
}
