export interface ISimulation {

    init(config: any): void
    update(updateData: any): void
    draw(ctx: CanvasRenderingContext2D): void

}
export interface ColorRGB {
    r: number
    g: number
    b: number
}
export interface ColorRGBA extends ColorRGB {
    a: number
}

export interface ColorCMYK {
    c: number
    m: number
    y: number
    k: number
}

export type AccelerationFunction = (particle: IParticle2d) => Point;
export type DrawFunction = (particle: IParticle2d) => void;
export type EdgeAvoidanceFunction = (particle: IParticle2d) => [Point, Velocity2d];
export type ColorLookupFunction = (particle: IParticle2d) => ColorRGB | ColorRGBA | ColorCMYK;
export interface IParticle2d {
    location: Point
    velocity: Velocity2d
    draw: (ctx: CanvasRenderingContext2D) => any
    init(config: any): void
    update(updateData: any): void
    addAccelerator?(accelerator: AccelerationFunction) : void
    addDrawer?(drawer: DrawFunction): DrawFunction | void
    addEdgeAvoidance?(edgeAvoider: EdgeAvoidanceFunction): EdgeAvoidanceFunction | void
    addColorLookup?(colorLookup: ColorLookupFunction): ColorLookupFunction | void
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

export interface FrameworkError {
    message: string
}

export function isFrameworkError(x: any): x is FrameworkError {
    return (x as FrameworkError && (x as FrameworkError).message !== undefined)
//    return (x as FrameworkError).message !== undefined;
}

export interface RGBAImage {
    width: number
    height: number
    pixels: PixelRGBA[]
}

export interface PixelRGB {
    location: Point
    color: ColorRGB
}

export interface PixelRGBA extends PixelRGB {
    color: ColorRGBA
}
