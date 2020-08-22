import {
    ColorCMYK,
    ColorLookupFunction,
    ColorRGB,
    ColorRGBA,
    compareFunction,
    EdgeAvoidanceFunction,
    FrameworkError, Int,
    IParticle2d, MovingEntity,
    PixelRGBA,
    Point,
    RGBAImage, roundToInt,
    SizeFunction
} from "./types";
import {BaseFrameworkError} from "./error/BaseFrameworkError";
import Victor from "victor";
import {waitForDebugger} from "inspector";
import {normalizeSlashes} from "ts-node";
var Victor1 = require('victor');
//import * as fs from "fs";
//import PNG from "png-ts";

export const TWO_PI = Math.PI * 2.0;
export const INT_0: Int = 0 as Int;
export const ORIGIN: Point = {x:INT_0,y:INT_0};

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
            x: roundToInt(v * Math.cos(theta)),
            y: roundToInt(v * Math.sin(theta))
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
    const normal:Victor = unitNormalOfReflectSurface.clone();
    const incomingReadOnly: Victor = incoming.clone();
    // 𝑟=𝑑−2(𝑑⋅𝑛)𝑛  is reflection equation where r = reflected, d is incoming velocity, n is normal
    const dot: number = incoming.dot(unitNormalOfReflectSurface);
    const dotTimesNormal: Victor = unitNormalOfReflectSurface.clone().multiplyScalar(dot);
    const dotTimesNormalTimes2: Victor = dotTimesNormal.multiplyScalar(2);

    const incomingSubtractDotTimesNormalTimes2: Victor = incoming.clone().subtract(dotTimesNormalTimes2);

    // const oldValue: Victor = incoming.subtract(
    //     unitNormalOfReflectSurface.multiplyScalar(incoming.dot(unitNormalOfReflectSurface) * 2)
    // );

    return incomingSubtractDotTimesNormalTimes2;
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
export function limitCoordinateToBoundary(coord: Int, limit: Int, compareFn: compareFunction): Int {
    if (compareFn(coord, limit)) {
        return roundToInt(2 * limit - coord);
    } else {
        return coord;
    }
}

export function limitCoordinateToRange(coord: Int, minLimit: Int, maxLimit: Int): Int {
    if (coord > maxLimit) {
        return maxLimit;
    } else if (coord < minLimit) {
        return minLimit;
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
export function getRandomInt(max: number, min = 0) : Int {
    if (min < max) {
        return Math.floor(getRandomFloat(max, min)) as Int;
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
        // const y: Int = Math.floor(pixelStartIndex / imageData.width) as Int;
        // const x: Int = (pixelStartIndex % imageData.width) as Int;

        pixelData.push({
            location: get2dPointFromArrayIndex(i, imageData.width),
            color: new ColorRGBA(imageData.data[pixelStartIndex],
                imageData.data[pixelStartIndex + 1],
                imageData.data[pixelStartIndex + 2],
                imageData.data[pixelStartIndex + 3])
        });
    }

    return {
        width: roundToInt(imageData.width),
        height: roundToInt(imageData.height),
        pixels: pixelData
    }
}

export function get2dPointFromArrayIndex(index: number, width: number) {
    const y: Int = Math.floor(index / width) as Int;
    const x: Int = (index % width) as Int;
    return {x,y};
}
export function getStaticColorFunction(color: ColorRGB | ColorRGBA | ColorCMYK): ColorLookupFunction {
    return (particle: IParticle2d) => color;
}
export function getImageLookupColorFunction(image: RGBAImage, imageSpread: number = 1): ColorLookupFunction | FrameworkError {
    return (particle: IParticle2d) => {
        const pixel: PixelRGBA | FrameworkError
            = getPixelForLocation({x: roundToInt(particle.location.x / imageSpread), y: roundToInt(particle.location.y / imageSpread)}, image, false);
        if (isFrameworkError(pixel)) {
            throw new Error(pixel.message);
        } else {
            if ( undefined === pixel) {
                console.log('pixel is undefined')
                debugger;
            }
            return pixel.color;
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
        console.log('returning pixel location which is an error')
        return pixelLocation;
    } else {
        // console.log(`attempt to return pixel location ${pixelLocation} which should be < ${image.pixels.length} `);
        // console.log(`the pixel is ${image.pixels[pixelLocation]}`);
        if ( image.pixels.length < pixelLocation) {
            console.log(`**************Bad location was ${JSON.stringify(location)}`);
            throw new Error("bad location");
        }
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
    return (particle: MovingEntity): [Point, Victor] => {
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

            //

            if ( ! sanityCheckPointInBounds(returnPoint, max)) {
                debugger;
                throw new Error(`naughty particle ${JSON.stringify(returnPoint)}`);
            }

            // if ( (newVelocity.x * newVelocity.x > 100) || (newVelocity.y * newVelocity.y > 100)) {
            //     debugger;
            //     throw new Error(`naughty velocity particle ${JSON.stringify(newVelocity)}`);
            // }

            return [returnPoint, newVelocity];
        }

    }
}

function sanityCheckPointInBounds(pointToCheck: Point, bounds: Point): boolean {
    return (
        (pointToCheck.x >= INT_0 )
        && (pointToCheck.x <= bounds.x)
        && (pointToCheck.y >= INT_0 )
        && (pointToCheck.y <= bounds.y)
        );
}

export function NoOpAccelerationFunction(particle: IParticle2d) {
    return particle.velocity;
}
export function getStaticSizeFunction(size: number): SizeFunction {
    return (particle: IParticle2d) => size;
}

