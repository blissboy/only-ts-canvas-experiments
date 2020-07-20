// core "app" types
import {getPixelForLocation, limitCoordinateToBoundary} from "./utils";
import Victor from "victor";

export interface ISimulation {
    init(config: any): void

    update(updateData: any): void

    draw(ctx: CanvasRenderingContext2D): void
}

// types used by "app"
export interface Entity {
    location: Point
}

export interface MovingEntity extends Entity {
    velocity: Victor
}

export interface ConstrainedMovingEntity extends MovingEntity {
    /**
     * the min location limit for this entity. "the top left corner". Will often be (0,0)
     */
    minLocation: Point
    /**
     * the max location limit for this entity. "the bottom right corner"
     */
    maxLocation: Point
}

export interface Drawable {
    draw(ctx: CanvasRenderingContext2D): void
}

export interface IParticle2d extends ConstrainedMovingEntity, Drawable {
    init(config: any): void

    update(updateData: any): void

    addAccelerator?(accelerator: AccelerationFunction): void
}

export interface IColoredParticle2d extends IParticle2d {
    addColorLookup?(colorLookup: ColorLookupFunction): ColorLookupFunction | void
}

// particle
// particle system
// entity (mover)


// color types
export class ColorRGB {
    r: number
    g: number
    b: number

    constructor(r: number, g: number, b: number) {
        this.r = r % 255;
        this.g = g % 255;
        this.b = b % 255;
    }

    toCssColor(): string {
        return `#${this.r.toString(16)}${this.g.toString(16)}${this.b.toString(16)}AA`;
    }
}

export class ColorRGBA extends ColorRGB {
    a: number

    constructor(r: number, g: number, b: number, a: number) {
        super(r, g, b);
        this.a = a % 255;
        this.toCssColor = () => {
            return `#${this.r.toString(16)}${this.g.toString(16)}${this.b.toString(16)}${this.a.toString(16)}`;
        }
    }
}

export interface ColorCMYK {
    c: number
    m: number
    y: number
    k: number
    toCssColor: () => string
}

// image types
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

// function types and base implementations
export type AccelerationFunction = (particle: IParticle2d) => Victor;
export type SizeFunction = (particle: IParticle2d) => number;
export type DrawFunction = (particle: IParticle2d) => void;
export type EdgeAvoidanceFunction = (particle: IParticle2d) => [Point, Victor];

export type compareFunction = (first: number, second: number) => boolean;

export type ColorLookupFunction = (particle: IParticle2d) => ColorRGB | ColorRGBA | ColorCMYK;

// fundamental types
export interface Point {
    x: number
    y: number
    z?: number
}

// frameworky stuff
export interface FrameworkError {
    message: string
}



