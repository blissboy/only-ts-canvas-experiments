import {
    ColorLookupFunction,
    compareFunction,
    EdgeAvoidanceFunction,
    FrameworkError, Int,
    IParticle2d, MovingEntity,
    PixelRGBA,
    IntPoint,
    RGBAImage, roundToInt,
    SizeFunction
} from "./types";
import {BaseFrameworkError} from "./error/BaseFrameworkError";
import Victor from "victor";
import {ColorCMYK, ColorRGB, ColorRGBA, getColorRGBA} from "./color/types";

var Victor1 = require('victor');

export const TWO_PI = Math.PI * 2.0;
export const INT_0: Int = 0 as Int;
export const ORIGIN: IntPoint = {x: INT_0, y: INT_0};

// mathy

export function checkedFromPolarToXY(v: number, theta: number): IntPoint | FrameworkError {
    try {
        const result = fromPolarToXY(v, theta);
        return result;
    } catch (e) {
        return new BaseFrameworkError(e);
    }
}

export function fromPolarToXY(v: number, theta: number): IntPoint {
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
    const normal: Victor = unitNormalOfReflectSurface.clone();
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

export const posXAxis: Victor = new Victor1(1, 0);
export const negXAxis: Victor = new Victor1(-1, 0);
export const posYAxis: Victor = new Victor1(0, 1);
export const negYAxis: Victor = new Victor1(0, -1);
export const greaterThan: compareFunction = (first: number, second: number) => {
    return first > second;
}
export const lessThan: compareFunction = (first: number, second: number) => {
    return first < second;
}

export const getPointOnLine: (startPoint: IntPoint, endPoint: IntPoint, percentTowardTarget: number) => IntPoint = (startPoint: IntPoint, endPoint: IntPoint, percentTowardTarget: number) => {
    return {
        x: roundToInt(startPoint.x * (1.0 - percentTowardTarget) + endPoint.x * percentTowardTarget),
        y: roundToInt(startPoint.y * (1.0 - percentTowardTarget) + endPoint.y * percentTowardTarget)
    };
}

export function getStepBetweenValue(begin: number, end: number, numSteps: number, stepsTaken: number) {
    return begin + ((end - begin) * (numSteps / stepsTaken));
}

/**
 * converts a hex string into an array of decimal values, converting 2 bytes at time. For example,
 * FFFFFF would be returned as [255,255,255]. Will throw error for invalid hex.
 * @param hexString
 */
export function getDecimalValuesFromHexString(hexString: string): number[] {
    if (hexString == '' || (hexString && (hexString.length % 2 == 0))) {
        return chunkSubstr(hexString, 2).map((twoChars: string) => {
            const val = parseInt(twoChars, 16);
            if (!isNaN(val)) {
                return val;
            } else {
                throw new Error(`invalid hex '${twoChars}' (must be 00-FF) that was part of '${hexString}'`)
            }
        }, []);
    } else {
        throw new Error(`hex string does not have length that is multiple of 2, please pad ${hexString}`);
    }
}

function chunkSubstr(str: string, size: number) {
    const numChunks = Math.ceil(str.length / size);
    const chunks = new Array(numChunks);

    for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
        chunks[i] = str.substr(o, size);
    }

    return chunks;
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
export function getRandomInt(max: number, min = 0): Int {
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
            color: getColorRGBA(imageData.data[pixelStartIndex],
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
    return {x, y};
}

export function getStaticColorFunction(color: ColorRGB | ColorRGBA | ColorCMYK): ColorLookupFunction {
    return (particle: IParticle2d) => color;
}

export function getImageLookupColorFunction(image: RGBAImage, imageSpread: number = 1): ColorLookupFunction | FrameworkError {
    return (particle: IParticle2d) => {
        const pixel: PixelRGBA | FrameworkError
            = getPixelForLocation({
            x: roundToInt(particle.location.x / imageSpread),
            y: roundToInt(particle.location.y / imageSpread)
        }, image, false);
        if (isFrameworkError(pixel)) {
            throw new Error(pixel.message);
        } else {
            if (undefined === pixel) {
                console.log('pixel is undefined')
                debugger;
            }
            return pixel.color;
        }
    }
}

// image
export function validateLocationInBoundsOfImage(location: IntPoint, image: RGBAImage): boolean {

    //const retval: boolean = (location.x <= image.width) && (location.y <= image.height);
    //console.log(`location: ${JSON.stringify(location)} for image with height=${image.height} + width=${image.width} ${retval ? ' is in ' : 'is out of '} bounds`);

    return (location.x < image.width) && (location.y < image.height);
}

export function getPixelIndexForLocation(location: IntPoint, image: RGBAImage, allowOutOfBounds: boolean = false): number | FrameworkError {
    if (!allowOutOfBounds) {
        if (!validateLocationInBoundsOfImage(location, image)) {
            return new BaseFrameworkError(`location (${location.x},${location.y}) is out of bounds of an image with width ${image.width}, height ${image.height}`);
        }
    }
    return ((location.y) * image.width) + location.x % (image.height * image.width);
}

export function getPixelForLocation(location: IntPoint, image: RGBAImage, allowOutOfBounds: boolean = false): PixelRGBA | FrameworkError {
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

export function getNinetyDegreeBounceEdgeDetector(min: IntPoint, max: IntPoint): EdgeAvoidanceFunction {
    return (particle: MovingEntity): [IntPoint, Victor] => {
        const returnPoint: IntPoint = {
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
            if (returnPoint.x > particle.location.x) {
                newVelocity = getReflection(newVelocity, negXAxis);
            } else if (returnPoint.x < particle.location.x) {
                newVelocity = getReflection(newVelocity, posXAxis);
            }
            if (returnPoint.y > particle.location.y) {
                newVelocity = getReflection(newVelocity, negYAxis);
            } else if (returnPoint.y < particle.location.y) {
                newVelocity = getReflection(newVelocity, posYAxis);
            }

            //

            if (!sanityCheckPointInBounds(returnPoint, max)) {
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

function sanityCheckPointInBounds(pointToCheck: IntPoint, bounds: IntPoint): boolean {
    return (
        (pointToCheck.x >= INT_0)
        && (pointToCheck.x <= bounds.x)
        && (pointToCheck.y >= INT_0)
        && (pointToCheck.y <= bounds.y)
    );
}

export function NoOpAccelerationFunction(particle: IParticle2d) {
    return particle.velocity;
}

export function getStaticSizeFunction(size: number): SizeFunction {
    return (particle: IParticle2d) => size;
}


// @ts-ignore
const glUtils = {

    // Find and return a DOM element given an ID
    getCanvas(id: string): null | HTMLCanvasElement {
        const canvas = document.getElementById(id) as HTMLCanvasElement;

        if (!canvas) {
            console.error(`There is no canvas with id ${id} on this page.`);
            return null;
        }

        return canvas;
    },

    // Given a canvas element, return the WebGL2 context
    getGLContext(canvas: HTMLCanvasElement): void | WebGL2RenderingContext {
        return canvas.getContext('webgl2') || console.error('WebGL2 is not available in your browser.');
    },

    // Given a canvas element, expand it to the size of the window
    // and ensure that it automatically resizes as the window changes
    autoResizeCanvas(canvas: HTMLCanvasElement) {
        const expandFullScreen = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        expandFullScreen();
        // Resize screen when the browser has triggered the resize event
        window.addEventListener('resize', expandFullScreen);
    },

    // Given a WebGL context and an id for a shader script,
    // return a compiled shader
    getShader(gl: WebGL2RenderingContext, id: string) : WebGLShader | null {
        const script = document.getElementById(id) as HTMLScriptElement;
        if (!script) {
            console.warn(`no element (script) with id '${id}`);
            return null;
        }

        const shaderString = script.text.trim();

        let shader: WebGLShader;
        if (script.type === 'x-shader/x-vertex') {
            shader = gl.createShader(gl.VERTEX_SHADER) as WebGLShader;
        } else if (script.type === 'x-shader/x-fragment') {
            shader = gl.createShader(gl.FRAGMENT_SHADER)  as WebGLShader;
        } else {
            return null;
        }

        if ( shader == null ) {
            console.error('null shader');
            return null;
        }
        gl.shaderSource(shader, shaderString);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    },

    // Normalize colors from 0-255 to 0-1
    //@ts-ignore
    normalizeColor(color) {
        //@ts-ignore
        return color.map(c => c / 255);
    },

    // De-normalize colors from 0-1 to 0-255
    //@ts-ignore
    denormalizeColor(color) {
        //@ts-ignore
        return color.map(c => c * 255);
    },

    // Returns computed normals for provided vertices.
    // Note: Indices have to be completely defined--NO TRIANGLE_STRIP only TRIANGLES.
    //@ts-ignore
    calculateNormals(vs, ind) {
        const
            x = 0,
            y = 1,
            z = 2,
            ns = [];

        // For each vertex, initialize normal x, normal y, normal z
        for (let i = 0; i < vs.length; i += 3) {
            ns[i + x] = 0.0;
            ns[i + y] = 0.0;
            ns[i + z] = 0.0;
        }

        // We work on triads of vertices to calculate
        for (let i = 0; i < ind.length; i += 3) {
            // Normals so i = i+3 (i = indices index)
            const v1 = [], v2 = [], normal = [];

            // p2 - p1
            v1[x] = vs[3 * ind[i + 2] + x] - vs[3 * ind[i + 1] + x];
            v1[y] = vs[3 * ind[i + 2] + y] - vs[3 * ind[i + 1] + y];
            v1[z] = vs[3 * ind[i + 2] + z] - vs[3 * ind[i + 1] + z];

            // p0 - p1
            v2[x] = vs[3 * ind[i] + x] - vs[3 * ind[i + 1] + x];
            v2[y] = vs[3 * ind[i] + y] - vs[3 * ind[i + 1] + y];
            v2[z] = vs[3 * ind[i] + z] - vs[3 * ind[i + 1] + z];

            // Cross product by Sarrus Rule
            normal[x] = v1[y] * v2[z] - v1[z] * v2[y];
            normal[y] = v1[z] * v2[x] - v1[x] * v2[z];
            normal[z] = v1[x] * v2[y] - v1[y] * v2[x];

            // Update the normals of that triangle: sum of vectors
            for (let j = 0; j < 3; j++) {
                ns[3 * ind[i + j] + x] = ns[3 * ind[i + j] + x] + normal[x];
                ns[3 * ind[i + j] + y] = ns[3 * ind[i + j] + y] + normal[y];
                ns[3 * ind[i + j] + z] = ns[3 * ind[i + j] + z] + normal[z];
            }
        }

        // Normalize the result.
        // The increment here is because each vertex occurs.
        for (let i = 0; i < vs.length; i += 3) {
            // With an offset of 3 in the array (due to x, y, z contiguous values)
            const nn = [];
            nn[x] = ns[i + x];
            nn[y] = ns[i + y];
            nn[z] = ns[i + z];

            let len = Math.sqrt((nn[x] * nn[x]) + (nn[y] * nn[y]) + (nn[z] * nn[z]));
            if (len === 0) len = 1.0;

            nn[x] = nn[x] / len;
            nn[y] = nn[y] / len;
            nn[z] = nn[z] / len;

            ns[i + x] = nn[x];
            ns[i + y] = nn[y];
            ns[i + z] = nn[z];
        }

        return ns;
    },

    // Calculate tangets for a given set of vertices
    //@ts-ignore
    calculateTangents(vs, tc, ind) {
        const tangents = [];

        for (let i = 0; i < vs.length / 3; i++) {
            tangents[i] = [0, 0, 0];
        }

        let
            a = [0, 0, 0],
            b = [0, 0, 0],
            triTangent = [0, 0, 0];

        for (let i = 0; i < ind.length; i += 3) {
            const i0 = ind[i];
            const i1 = ind[i + 1];
            const i2 = ind[i + 2];

            const pos0 = [vs[i0 * 3], vs[i0 * 3 + 1], vs[i0 * 3 + 2]];
            const pos1 = [vs[i1 * 3], vs[i1 * 3 + 1], vs[i1 * 3 + 2]];
            const pos2 = [vs[i2 * 3], vs[i2 * 3 + 1], vs[i2 * 3 + 2]];

            const tex0 = [tc[i0 * 2], tc[i0 * 2 + 1]];
            const tex1 = [tc[i1 * 2], tc[i1 * 2 + 1]];
            const tex2 = [tc[i2 * 2], tc[i2 * 2 + 1]];

            //@ts-ignore
            vec3.subtract(a, pos1, pos0);
            //@ts-ignore
            vec3.subtract(b, pos2, pos0);

            const c2c1b = tex1[1] - tex0[1];
            const c3c1b = tex2[0] - tex0[1];

            triTangent = [c3c1b * a[0] - c2c1b * b[0], c3c1b * a[1] - c2c1b * b[1], c3c1b * a[2] - c2c1b * b[2]];

            //@ts-ignore
            vec3.add(triTangent, tangents[i0], triTangent);
            //@ts-ignore
            vec3.add(triTangent, tangents[i1], triTangent);
            //@ts-ignore
            vec3.add(triTangent, tangents[i2], triTangent);
        }

        // Normalize tangents
        //@ts-ignore
        const ts = [];
        tangents.forEach(tan => {
            //@ts-ignore
            vec3.normalize(tan, tan);
            ts.push(tan[0]);
            ts.push(tan[1]);
            ts.push(tan[2]);
        });

        //@ts-ignore
        return ts;
    }

};

