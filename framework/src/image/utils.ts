import {FrameworkError, PixelRGBA, RGBAImage} from "../types";
import {BaseFrameworkError} from "../error/BaseFrameworkError";
import {isFrameworkError} from "../utils";
import {Point} from "../entities/types";

export function validateLocationInBoundsOfImage(location: Point, image: RGBAImage): boolean {
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
        if (image.pixels.length < pixelLocation) {
            console.log(`**************Bad location was ${JSON.stringify(location)}`);
            throw new Error("bad location");
        }
        return image.pixels[pixelLocation as number];
    }
}
