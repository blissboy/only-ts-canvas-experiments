// core "app" types
import {clamp, getDecimalValuesFromHexString, getPixelForLocation, limitCoordinateToBoundary} from "./utils";
import Victor from "victor";
import {ColorCMYK, ColorRGB, ColorRGBA} from "./color/types";

export interface ISimulation {
    init(config: any): void

    update(updateData: any): void

    draw(ctx: CanvasRenderingContext2D): void

    start(): void  //TODO: could return toggle function to allow turning sim on/off
}

// types used by "app"
export interface Entity {
    location: IntPoint
}

export interface MovingEntity extends Entity, ExistingEntity {
    velocity: Victor
}

export interface ExistingEntity extends Entity {
    tick: number
}

export interface ConstrainedMovingEntity extends MovingEntity {
    /**
     * the min location limit for this entity. "the top left corner". Will often be (0,0)
     */
    minLocation: IntPoint
    /**
     * the max location limit for this entity. "the bottom right corner"
     */
    maxLocation: IntPoint
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


// image types
export interface RGBAImage {
    width: Int
    height: Int
    pixels: PixelRGBA[]
}

export interface PixelRGB {
    location: IntPoint
    color: ColorRGB
}

export interface PixelRGBA extends PixelRGB {
    color: ColorRGBA
}

// function types and base implementations
export type AccelerationFunction = (particle: IParticle2d) => Victor;
export type SizeFunction = (particle: IParticle2d) => number;
export type DrawFunction = (particle: IParticle2d) => void;
export type EdgeAvoidanceFunction = (entity: MovingEntity) => [IntPoint, Victor];

export type compareFunction = (first: number, second: number) => boolean;

export type ColorLookupFunction = (particle: IParticle2d) => ColorRGB | ColorRGBA | ColorCMYK;

// fundamental types
export interface IntPoint {
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



