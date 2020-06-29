import {getRandomInt} from "./framework/utils";
import {Particle2d} from "./framework/Particle2d";
import {IParticle2d, ISimulation} from "./framework/types";
//import {ISimulation} from "framework/types";
type ExampleSimulationConfig = {
    colorPalettes: string[][]
    particleCount: number
}

export class ExampleSimulation implements ISimulation {
    particles: IParticle2d[] = [];
    readonly palette: string[]; // = colorPalettes[getRandomInt(colorPalettes.length)];
    config: ExampleSimulationConfig;
    constructor(private width: number, private height: number, config: ExampleSimulationConfig) {
        this.config = config;
        this.palette = config.colorPalettes[getRandomInt(config.colorPalettes.length - 1)];
        for (let i = 0; i < this.config.particleCount; i++) {
            this.particles.push(
                new Particle2d(
                    i,
                    {x: getRandomInt(width), y: getRandomInt(height)},
                    {
                    x: width,
                    y: height
                },
                    {palette: this.palette})
            )
        }
    }

    init(config: any) {

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
