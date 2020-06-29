import {clamp, fromPolarToXY, getRandomFloat, getRandomInt, rgbToLuma, validateNotNan} from "./utils";
import {IParticle2d, ISimulation, ParticleConfig, Point, Velocity2d} from "./types";

const TWO_PI = Math.PI * 2;

export class Particle2d implements ISimulation, IParticle2d {
    private ttl: number = 400;
    color: string = 'green';
    lifespan: number = 400;
    location: Point = {x: 0, y: 0};
    radius: number = 1;
    velocity: Velocity2d = {speed: 0, theta: 0};
    palette: string[] = [];
    maxLocation: Point = {x: 0, y: 0};
    id: number = 0;

    //todo: figure this out
    maxParticleSize = 5;

    constructor(id: number,
                location: Point = {x: 0, y: 0},
                max: Point,
                options: ParticleConfig = {}) {

        this.createParticle2d(id, location, max, options);
    }

    createParticle2d(id: number, location: Point, max: Point, options: ParticleConfig) {
        if (! validateNotNan([id, location.x, location.y, max.x, max.y])) {
            throw new Error(`id: ${id}, location.x:${location.x} location.y:${location.y}, max.x:${max.x} max.y:${max.y} must all be numbers`);
        }
        this.id = id;
        this.velocity = options.velocity ? options.velocity : {
            speed: getRandomFloat(9),
            theta: getRandomFloat(2 * Math.PI)
        };
        this.maxLocation = max;
        this.lifespan = options.lifespan ? options.lifespan : getRandomInt(500, 100);
        this.radius = options.radius ? options.radius : getRandomFloat(this.maxParticleSize, 0.1);
        this.palette = options.palette ? options.palette : ['black'];
        this.color = this.palette[getRandomInt(this.palette.length)];
        //this.color = 'red';
        //console.log(this.color);
        this.ttl = this.lifespan;
        this.location = {
            x: clamp(0, max.x, Math.floor(location.x)),
            y: clamp(0, max.y, Math.floor(location.y))
        };
    }

    counter: number = 0;

    init(config: ParticleConfig) {

    }
    update(imageData: ImageData) {
        this.counter++;
        const lum = this.imageComplementLuna(imageData);
        if (isNaN(lum)) {
            console.error(`nan`);
        }
        if (!imageData) {
            throw new Error('asdf');
        }
        if (isNaN(lum)) {
            throw new Error('assdf');
        }
        //console.log(lum);

        const dRadius = getRandomFloat(this.maxParticleSize / 10, -this.maxParticleSize / 10);
        const dSpeed = getRandomFloat(0.01, -0.01);
        const dTheta = getRandomFloat(Math.PI / 8, -Math.PI / 8);

        this.velocity.speed += dSpeed;
        this.velocity.theta += dTheta;

        const deltaVector = fromPolarToXY(this.velocity.theta * lum, this.velocity.theta * lum);
        if (! deltaVector) {throw new Error('undefined move');}
        if (isNaN(this.location.x)) {
            console.error(`ID: ${this.id} Nan ${this.counter}`);
        }
        // else {
        //     console.log(`ID: ${this.id}is a number ${this.counter}`);
        // }
        this.location.x = clamp(0, this.maxLocation.x, Math.floor(this.location.x + deltaVector.x));
        this.location.y = clamp(0, this.maxLocation.y, Math.floor(this.location.y + deltaVector.y));
        if (isNaN(this.location.x) || isNaN(this.location.y)) {
            console.error(`nan`);
        }
        if (this.location.x >= this.maxLocation.x) {
            this.location.x = this.maxLocation.x;
            this.velocity.theta += Math.PI / 2;
        }
        if (this.location.y >= this.maxLocation.y) {
            this.location.y = this.maxLocation.y;
            this.velocity.theta += Math.PI / 2;
        }
        if (isNaN(this.location.x) || isNaN(this.location.y)) {
            console.error(`nan`);
        }

        this.radius += dRadius;
        this.radius = clamp(.5, this.maxParticleSize, this.radius) * lum;

        this.ttl--;

        if (this.ttl < 0) {
            this.createParticle2d(this.id, this.location, this.maxLocation, {
                palette: this.palette,
                lifespan: this.lifespan = 400
            });
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        this.experiment1(ctx);
        ctx.restore();
    }

    experiment1(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.color;
        let circle = new Path2D();
        circle.arc(this.location.x, this.location.y, this.radius, 0, TWO_PI);
        ctx.fill(circle);
    }

    private imageComplementLuna(imageData: ImageData): number {
        // get pixel in image we want - RGBA values (4 entries per pixel)
        const pixelIndexOfImage = 4 * (this.location.x + (this.location.y * imageData.width));
        if (pixelIndexOfImage < imageData.data.length) {
            const r = imageData.data[pixelIndexOfImage];
            const g = imageData.data[pixelIndexOfImage + 1];
            const b = imageData.data[pixelIndexOfImage + 2];
            const ret = 1 - (rgbToLuma(r, g, b) / 255.0);
            return ret;
        } else {
            return 0;
        }
    }

}
