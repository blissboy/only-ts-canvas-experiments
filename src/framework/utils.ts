import {Point} from "./types";

const TWO_PI = Math.PI * 2.0;

export function getRandomFloat(max: number, min = 0) {
    if (min <= max) {
        return Math.random() * (max - min) + min;
    } else {
        throw Error("min must be < max");
    }
}

export function getRandomInt(max: number, min = 0) {
    if (min < max) {
        return Math.floor(getRandomFloat(max, min));
    } else {
        throw Error("min must be < max");
    }
}

export function fromPolarToXY(v: number, theta: number): Point | undefined {
    if (validateNotNan([v, theta])) {
        return {
            x: v * Math.cos(theta),
            y: v * Math.sin(theta)
        }
    }
}

export function validateNotNan(numbers: number[]): boolean {
    return !numbers.some(number => number && !(isNaN(number)))
}

export function rgbToLuma(r: number, g: number, b: number): number {
    if (validateNotNan([r, g, b])) {
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    } else {
        throw new Error(`r,g,b, must be numbers: r:${r} g:${g} b:${b}`);
    }
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

