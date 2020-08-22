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

export interface MovingEntity extends Entity, ExistingEntity {
    velocity: Victor
}

export interface ExistingEntity {
    tick: number
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
        this.r = r % 256;
        this.g = g % 256;
        this.b = b % 256;
    }

    toCssColor(): string {
        return `#${this.r.toString(16).padStart(2,'0')}${this.g.toString(16).padStart(2,'0')}${this.b.toString(16).padStart(2,'0')}`;
    }
}

export class ColorRGBA extends ColorRGB {
    a: number

    constructor(r: number, g: number, b: number, a: number) {
        super(r, g, b);
        this.a = a % 256;
        this.toCssColor = () => {
            return `${super.toCssColor()}${this.a.toString(16).padStart(2,'0')}`;
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
    width: Int
    height: Int
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
export type EdgeAvoidanceFunction = (entity: MovingEntity) => [Point, Victor];

export type compareFunction = (first: number, second: number) => boolean;

export type ColorLookupFunction = (particle: IParticle2d) => ColorRGB | ColorRGBA | ColorCMYK;

// fundamental types
export interface Point {
    x: Int
    y: Int
    z?: Int
}

export type Int = number & { __int__: void };
export const roundToInt = (num: number): Int => Math.round(num) as Int;

// frameworky stuff
export interface FrameworkError {
    message: string
}



