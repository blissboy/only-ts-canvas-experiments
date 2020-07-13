import {FrameworkError, isFrameworkError, PixelRGBA, Point, RGBAImage} from "./types";
import {BaseFrameworkError} from "./error/BaseFrameworkError";
//import * as fs from "fs";
//import PNG from "png-ts";

export const TWO_PI = Math.PI * 2.0;

// mathy
export function getRandomFloat(max: number, min = 0) {
    if (min <= max) {
        return Math.random() * (max - min) + min;
    } else {
        throw Error("min must be < max");
    }
}

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

export function checkedFromPolarToXY(v: number, theta: number): Point | FrameworkError {
    try {
        const result = fromPolarToXY(v,theta);
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
            color: {
                r: imageData.data[pixelStartIndex],
                g: imageData.data[pixelStartIndex + 1],
                b: imageData.data[pixelStartIndex + 2],
                a: imageData.data[pixelStartIndex + 3]
            }
        });
    }

    return {
        width: imageData.width,
        height: imageData.height,
        pixels: pixelData
    }
}

// won't work in browser, no fs
// export async function loadPNGFile(filename: string): Promise<PNG | FrameworkError> {
//     return PNG.load(await fs.promises.readFile(filename));
// }

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

export function getPixelForLocation(location: Point, image: RGBAImage, allowOutOfBounds: boolean = false) : PixelRGBA | FrameworkError {
    const pixelLocation = getPixelIndexForLocation(location,image,allowOutOfBounds);
    if (pixelLocation && isFrameworkError( pixelLocation)) {
        return pixelLocation;
    } else {
        return image.pixels[pixelLocation];
    }
}
