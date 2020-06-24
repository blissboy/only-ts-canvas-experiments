// utility function
import enumerate = Reflect.enumerate;

function getRandomFloat(max: number, min: number = 0): number {
    if (min <= max) {
        return Math.random() * (max - min) + min;
    } else {
        throw Error("min must be < max");
    }
}

function getRandomInt(max: number, min: number = 0): number {
    if (min < max) {
        return Math.floor(getRandomFloat(max, min));
    } else {
        throw Error("min must be < max");
    }
}

function fromPolar(v: number, theta: number): [number, number] {
    if (isNaN(v) || isNaN(theta)) {
        console.error(`nan`);
    }
    return [v * Math.cos(theta), v * Math.sin(theta)];
}

const TWO_PI = Math.PI * 2.0;

interface ISimulation {
    update(imgData: ImageData): void

    draw(ctx: CanvasRenderingContext2D): void
}

// Simulation constants
const particleCount = 2500;
const colorPalettes: string[][] = [
    ["#f3b700", "#faa300", "#e57c04", "#ff6201", "#f63e02"],
    ["#ed6a5a", "#f4f1bb", "#9bc1bc", "#5ca4a9", "#e6ebe0"],
    ["#50514f", "#f25f5c", "#ffe066", "#247ba0", "#70c1b3"],
    ["#edc4b3", "#e6b8a2", "#deab90", "#d69f7e", "#cd9777", "#c38e70", "#b07d62", "#9d6b53", "#8a5a44", "#774936"],
    ["#673c4f", "#7f557d", "#726e97", "#7698b3", "#83b5d1"],
    ["#e8aeb7", "#b8e1ff", "#a9fff7", "#94fbab", "#82aba1"]
];


class Simulation implements ISimulation {
    particles: Particle[] = [];
    palette: string[] = colorPalettes[getRandomInt(colorPalettes.length)];

    constructor(private width: number, private height: number) {
        this.palette = colorPalettes[getRandomInt(colorPalettes.length - 1)];
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(
                new Particle(i, {x: getRandomInt(width), y: getRandomInt(height)}, {
                    x: width,
                    y: height
                }, {palette: this.palette})
            )
        }
    }

    update(imageData: ImageData) {
        this.particles.forEach(p => p.update(imageData))
    }

    backgroundDrawn = false;

    draw(ctx: CanvasRenderingContext2D) {
        // draw background
        if (!this.backgroundDrawn) {
            ctx.fillStyle = this.palette[0];//getRandomInt(this.palette.length)];
            ctx.fillRect(0, 0, this.width, this.height);
            this.backgroundDrawn = true;
        }
        // draw particles
        this.particles.forEach(p => p.draw(ctx));
    }
}

interface Point {
    x: number
    y: number
    z?: number
}

interface Velocity {
    speed: number
    theta: number
}

interface ParticleOptions {
    location?: Point
    velocity?: Velocity
    lifespan?: number
    radius?: number
    palette?: string[]
}

interface IParticle {
    location: Point
    velocity: Velocity
    color: string
    lifespan: number
    radius: number
    palette: string[]
}

const maxParticleSize = 3.0;

class Particle implements ISimulation, IParticle {
    private ttl: number = 400;
    color: string = 'green';
    lifespan: number = 400;
    location: Point = {x: 0, y: 0};
    radius: number = 1;
    velocity: Velocity = {speed: 0, theta: 0};
    palette: string[] = [];
    max: Point = {x: 0, y: 0};
    id: number = 0;

    constructor(id: number, location: Point = {x: 0, y: 0}, max: Point, options: ParticleOptions = {}) {

        this.createParticle(id, location, max, options);
    }

    createParticle(id: number, location: Point, max: Point, options: ParticleOptions) {
        this.id = id;
        this.velocity = options.velocity ? options.velocity : {
            speed: getRandomFloat(9),
            theta: getRandomFloat(2 * Math.PI)
        };
        this.max = max;
        this.lifespan = options.lifespan ? options.lifespan : getRandomInt(500, 100);
        this.radius = options.radius ? options.radius : getRandomFloat(maxParticleSize, 0.1);
        this.palette = options.palette ? options.palette : ['black'];
        this.color = this.palette[getRandomInt(this.palette.length)];
        //this.color = 'red';
        //console.log(this.color);
        this.ttl = this.lifespan;
        this.location = {
            x: clamp(0, max.x, Math.floor(location.x)),
            y: clamp(0, max.y, Math.floor(location.y))
        };
        if (isNaN(this.location.x) || isNaN(this.location.y)) {
            console.error(`nan`);
        }
    }

    counter: number = 0;

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

        const dRadius = getRandomFloat(maxParticleSize / 10, -maxParticleSize / 10);
        const dSpeed = getRandomFloat(0.01, -0.01);
        const dTheta = getRandomFloat(Math.PI / 8, -Math.PI / 8);

        this.velocity.speed += dSpeed;
        this.velocity.theta += dTheta;

        const [dx, dy] = fromPolar(this.velocity.theta * lum, this.velocity.theta * lum);
        if (isNaN(dx) || isNaN(dy)) {
            console.error(`nan`);
        }
        if (isNaN(this.location.x)) {
            console.error(`ID: ${this.id} Nan ${this.counter}`);
        }
        // else {
        //     console.log(`ID: ${this.id}is a number ${this.counter}`);
        // }
        this.location.x = clamp(0, this.max.x, Math.floor(this.location.x + dx));
        this.location.y = clamp(0, this.max.y, Math.floor(this.location.y + dy));
        if (isNaN(this.location.x) || isNaN(this.location.y)) {
            console.error(`nan`);
        }
        if (this.location.x >= this.max.x) {
            this.location.x = this.max.x;
            this.velocity.theta += Math.PI / 2;
        }
        if (this.location.y >= this.max.y) {
            this.location.y = this.max.y;
            this.velocity.theta += Math.PI / 2;
        }
        if (isNaN(this.location.x) || isNaN(this.location.y)) {
            console.error(`nan`);
        }

        this.radius += dRadius;
        this.radius = clamp(.5, maxParticleSize, this.radius) * lum;

        this.ttl--;

        if (this.ttl < 0) {
            this.createParticle(this.id, this.location, this.max, {
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
            const ret = 1 - (toLuma(r, g, b) / 255.0);
            return ret;
        } else {
            return 0;
        }
    }

}

function toLuma(r: number, g: number, b: number): number {

    let luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    if (isNaN(luma)) {
        console.log(`nan`);
    }
    return luma;
}

function clamp(min: number, max: number, value: number) {
    if (value) {
        return (value < min) ? min : (value > max) ? max : value;
    } else {
        return min;
    }
}

function createDrawCanvas(imageCtx: CanvasRenderingContext2D, width: number, height: number) {
    const updateFrameRate = 60;
    const drawFrameRate = 60;

    const canvas: HTMLCanvasElement = document.createElement('canvas');
    document.body.appendChild(canvas);

    if (!canvas) {
        return;
    }

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
        return;
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const sim: ISimulation = new Simulation(width, height);
    const imageData = imageCtx.getImageData(0, 0, width, height);

    setInterval(
        () => {
            sim.update(imageData);
        },
        1000 / updateFrameRate
    );

    setInterval(
        () => {
            sim.draw(ctx);
        },
        1000 / drawFrameRate
    );
}

function bootstrapper() {

    console.log("called bootstrapper");
    let width: number = 800;
    let height: number = 800;

    // create image element to load the jpg
    const image: HTMLImageElement = new window.Image();
    if (!image) {
        console.error('no image');
        return;
    }
    image.crossOrigin = 'Anonymous';
    image.onload = (e) => {
        width = image.width;
        height = image.height;
        const imageCanvas = document.createElement('canvas');
        //document.body.appendChild(imageCanvas);
        imageCanvas.height = height;
        imageCanvas.width = width;
        const ctx: CanvasRenderingContext2D | null = imageCanvas.getContext('2d');
        if (!ctx) {
            console.error('no canvas');
            return;
        }
        ctx.drawImage(image, 0, 0, width, height);
        createDrawCanvas(ctx, width, height);
    }
    image.src = 'pic.png';

}

console.log("calling bootstrapper");
bootstrapper();