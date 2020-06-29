export interface ISimulation {

    init(config: any): void
    update(imgData: ImageData): void
    draw(ctx: CanvasRenderingContext2D): void

}

export type AccelerationFunction = (particle: IParticle2d) => Point;
export type DrawFunction = (particle: IParticle2d) => void;

export interface IParticle2d {
    location: Point
    velocity: Velocity2d
    draw: (ctx: CanvasRenderingContext2D) => any
    init(config: any): void
    update(updateData: any): void
    addAccelerator?(accelerator: AccelerationFunction) : void
    addDrawer?(drawer: DrawFunction): void
}

export interface Point {
    x: number
    y: number
    z?: number
}

export interface Velocity2d {
    speed: number
    theta: number
}

export interface ParticleConfig {
    location?: Point
    velocity?: Velocity2d
    lifespan?: number
    radius?: number
    palette?: string[]
    maxSize?: number
}
