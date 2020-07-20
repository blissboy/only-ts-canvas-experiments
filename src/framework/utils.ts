import {
    ColorCMYK,
    ColorLookupFunction,
    ColorRGB,
    ColorRGBA,
    compareFunction,
    EdgeAvoidanceFunction,
    FrameworkError,
    IParticle2d,
    PixelRGBA,
    Point,
    RGBAImage,
    SizeFunction
} from "./types";
import {BaseFrameworkError} from "./error/BaseFrameworkError";
import Victor from "victor";
var Victor1 = require('victor');
//import * as fs from "fs";
//import PNG from "png-ts";

export const TWO_PI = Math.PI * 2.0;

// mathy
export function checkedFromPolarToXY(v: number, theta: number): Point | FrameworkError {
    try {
        const result = fromPolarToXY(v, theta);
        return result;
    } catch (e) {
        return new BaseFrameworkError(e);
    }
}
export function fromPolarToXY(v: number, theta: number): Point {
    if (validateNotNan([v, theta])) {
        return {
            x: v * Math.cos(theta),
            y: v * Math.sin(theta)
        }
    } else {
        throw new BaseFrameworkError(`something was NaN: v: ${v}, theta:${theta}`);
    }
}
export function validateNotNan(numbers: number[]): boolean {
    // this helps understand this, uncomment this and run the tests to see why it's necessary
    // numbers.forEach(number => console.log(
    //     `number: ${number} ===> is it a number? ${!( number === undefined || !(typeof number === 'number') || Number.isNaN(number))}
    //     \tundef? ${number === undefined}
    //     \tnumber type? ${typeof number === 'number'}
    //     \tisNan? ${Number.isNaN(number)}
    //     \tresult=${! number || Number.isNaN(number)}`));
    //
    return !(numbers.some(number => !number === undefined || !(typeof number === 'number') || Number.isNaN(number)));
}
export function getReflection(incoming: Victor, unitNormalOfReflectSurface: Victor): Victor {
    // 𝑟=𝑑−2(𝑑⋅𝑛)𝑛  is reflection equation where r = reflected, d is incoming velocity, n is normal
    return incoming.subtract(
        unitNormalOfReflectSurface.multiplyScalar(incoming.dot(unitNormalOfReflectSurface) * 2)
    );
}
export const posXAxis: Victor = new Victor1(1,0);
export const negXAxis: Victor = new Victor1(-1,0);
export const posYAxis: Victor = new Victor1(0,1);
export const negYAxis: Victor = new Victor1(0,-1);
export const greaterThan: compareFunction = (first: number, second: number) => {
    return first > second;
}
export const lessThan: compareFunction = (first: number, second: number) => {
    return first < second;
}

// limits
export function clamp(min: number, max: number, value: number): number {
    if (value) {
        return (value < min) ? min : (value > max) ? max : value;
    } else {
        return min;
    }
}
export function safeClamp(min: number, max: number, value: number): number | undefined {
    if (validateNotNan([min, max, value])) {
        return clamp(min, max, value);
    }
}
export function limitCoordinateToBoundary(coord: number, limit: number, compareFn: compareFunction): number {
    if (compareFn(coord, limit)) {
        return 2 * limit - coord;
    } else {
        return coord;
    }
}

// randoms
/**
 * returns a number that is greater than or equal to min, and also less than max. Note you will NEVER receive
 * a value of max as a return, it will be less than, not less than or equal.
 * @param max
 * @param min
 */
export function getRandomInt(max: number, min = 0) {
    if (min < max) {
        return Math.floor(getRandomFloat(max, min));
    } else {
        throw Error("min must be < max");
    }
}
export function getRandomFloat(max: number, min = 0) {
    if (min <= max) {
        return Math.random() * (max - min) + min;
    } else {
        throw Error(`min (${min}) must be <= max (${max})`);
    }
}

// color
export function rgbToLuma(r: number, g: number, b: number): number {
    if (validateNotNan([r, g, b])) {
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    } else {
        throw new Error(`r,g,b, must be numbers: r:${r} g:${g} b:${b}`);
    }
}
export function getRGBAImageFromImageData(imageData: ImageData): RGBAImage {
    let pixelData: PixelRGBA[] = [];
    let pixelStartIndex: number;
    for (let i: number = 0; i < imageData.data.length / 4; i++) {
        pixelStartIndex = i * 4;
        pixelData.push({
            location: {
                x: pixelStartIndex / imageData.width,
                y: pixelStartIndex / imageData.height
            },
            color: new ColorRGBA(imageData.data[pixelStartIndex],
                imageData.data[pixelStartIndex + 1],
                imageData.data[pixelStartIndex + 2],
                imageData.data[pixelStartIndex + 3])
        });
    }

    return {
        width: imageData.width,
        height: imageData.height,
        pixels: pixelData
    }
}
export function getStaticColorFunction(color: ColorRGB | ColorRGBA | ColorCMYK): ColorLookupFunction {
    return (particle: IParticle2d) => color;
}
export function getImageLookupColorFunction(image: RGBAImage): ColorLookupFunction | FrameworkError {
    return (particle: IParticle2d) => {
        const color: PixelRGBA | FrameworkError = getPixelForLocation(particle.location, image, true);
        if (isFrameworkError(color)) {
            throw new Error(color.message);
        } else {
            if ( undefined === color) {
                debugger;
            }
            return color.color;
        }
    }
}

// image
export function validateLocationInBoundsOfImage(location: Point, image: RGBAImage): boolean {

    //const retval: boolean = (location.x <= image.width) && (location.y <= image.height);
    //console.log(`location: ${JSON.stringify(location)} for image with height=${image.height} + width=${image.width} ${retval ? ' is in ' : 'is out of '} bounds`);

    return (location.x < image.width) && (location.y < image.height);
}
export function getPixelIndexForLocation(location: Point, image: RGBAImage, allowOutOfBounds: boolean = false): number | FrameworkError {
    if (!allowOutOfBounds) {
        if (!validateLocationInBoundsOfImage(location, image)) {
            return new BaseFrameworkError(`location (${location.x},${location.y}) is out of bounds of an image with width ${image.width}, height ${image.height}`);
        }
    }
    return ((location.y) * image.width) + location.x % (image.height * image.width);
}
export function getPixelForLocation(location: Point, image: RGBAImage, allowOutOfBounds: boolean = false): PixelRGBA | FrameworkError {
    const pixelLocation = getPixelIndexForLocation(location, image, allowOutOfBounds);
    if (pixelLocation && isFrameworkError(pixelLocation)) {
        return pixelLocation;
    } else {
        return image.pixels[pixelLocation];
    }
}

// framework-y
export function isFrameworkError(x: any): x is FrameworkError {
    return (x as FrameworkError && (x as FrameworkError).message !== undefined)
//    return (x as FrameworkError).message !== undefined;
}
export function throwFrameworkErrorIfReturned<T>(returnVal: T | FrameworkError): T {
    if (isFrameworkError(returnVal)) {
        throw new Error(returnVal.message);
    } else {
        return returnVal;
    }
}
export function getNinetyDegreeBounceEdgeDetector(min: Point, max: Point): EdgeAvoidanceFunction {
    return (particle: IParticle2d): [Point, Victor] => {
        const returnPoint: Point = {
            // do two limits, for min and max
            x: limitCoordinateToBoundary(
                limitCoordinateToBoundary(particle.location.x, max.x, greaterThan), // max
                min.x,
                lessThan),
            y: limitCoordinateToBoundary(
                limitCoordinateToBoundary(particle.location.y, max.y, greaterThan), // max
                min.y,
                lessThan),
        }

        if (returnPoint == particle.location) {
            return [particle.location, particle.velocity];
        } else {
            let newVelocity: Victor = particle.velocity.clone();
            if ( returnPoint.x > particle.location.x ) {
                newVelocity = getReflection(newVelocity, negXAxis);
            } else if (returnPoint.x < particle.location.x) {
                newVelocity = getReflection(newVelocity,posXAxis);
            }
            if ( returnPoint.y > particle.location.y ) {
                newVelocity = getReflection(newVelocity,negYAxis);
            } else if (returnPoint.y < particle.location.y) {
                newVelocity = getReflection(newVelocity,posYAxis);
            }
            return [returnPoint, newVelocity];
        }

    }
}
export function NoOpAccelerationFunction(particle: IParticle2d) {
    return particle.velocity;
}
export function getStaticSizeFunction(size: number): SizeFunction {
    return (particle: IParticle2d) => size;
}

