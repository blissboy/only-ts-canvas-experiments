// utility function
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

function fromPolar(v: number, theta: number): [number,number] {
    return[v * Math.cos(theta), v * Math.sin(theta)];
}

const TWO_PI = Math.PI * 2.0;

interface ISimulation {
    update(): void
    draw(ctx: CanvasRenderingContext2D): void
}

// Simulation constants
const particleCount = 500;
const colorPalettes: string[][] = [
    ["#f3b700","#faa300","#e57c04","#ff6201","#f63e02"],
    ["#ed6a5a","#f4f1bb","#9bc1bc","#5ca4a9","#e6ebe0"],
    ["#50514f","#f25f5c","#ffe066","#247ba0","#70c1b3"],
    ["#673c4f","#7f557d","#726e97","#7698b3","#83b5d1"],
    ["#e8aeb7","#b8e1ff","#a9fff7","#94fbab","#82aba1"]
];


class Simulation implements ISimulation {
    particles: Particle[] = [];
    palette:string[] = colorPalettes[getRandomInt(colorPalettes.length)];
    constructor(private width: number, private height: number) {
        this.palette = colorPalettes[getRandomInt(colorPalettes.length - 1)];
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(
                new Particle({x: getRandomInt(width), y: getRandomInt(height)}, {palette: this.palette})
            )
        }
    }

    update() {
        this.particles.forEach(p => p.update())
    }

    backgroundDrawn = false;
    draw(ctx: CanvasRenderingContext2D) {
        // draw background
        if ( !this.backgroundDrawn ) {
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
    private ttl: number;
    color: string;
    lifespan: number;
    location: Point;
    radius: number;
    velocity: Velocity;
    palette: string[];

    constructor(location: Point = {x: 0, y: 0}, options: ParticleOptions = {}) {
        this.velocity = options.velocity ? options.velocity : {
            speed: getRandomFloat(3),
            theta: getRandomFloat(2 * Math.PI)
        };

        this.lifespan = options.lifespan ? options.lifespan : getRandomInt(500, 5);
        this.radius = options.radius ? options.radius : getRandomFloat(maxParticleSize, 0.1);
        this.palette = options.palette ? options.palette : ['black'];
        this.color = this.palette[getRandomInt(this.palette.length)];
        //this.color = 'red';
        //console.log(this.color);
        this.ttl = this.lifespan;
        this.location = location;
    }

    update() {
        const dRadius = getRandomFloat(maxParticleSize/10, -maxParticleSize/10);
        const dSpeed = getRandomFloat(0.01, -0.01);
        const dTheta = getRandomFloat(Math.PI/8, -Math.PI/8);

        this.velocity.speed += dSpeed;
        this.velocity.theta += dTheta;

        const [dx, dy] = fromPolar(this.velocity.theta, this.velocity.theta);

        this.location.x += dx;
        this.location.y += dy;
        this.radius += dRadius;
        this.radius += (this.radius < 0) ? -2 * dRadius : 0;
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

}

function bootstrapper() {

    console.log("called bootstrapper");
    const width: number = 800;
    const height: number = 800;

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

    setInterval(
        () => {
            sim.update();
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

console.log("calling bootstrapper");
bootstrapper();
