// color types
import {CMYK, ColorCMYK, ColorRGB, ColorRGBA, RGB, RGBA} from "./types";
import {clamp} from "../utils";

export function getColorRGB(r: number, g: number, b: number): ColorRGB {
    const rgb: RGB = {
        r: integerize(r % 256),
        g: integerize(g % 256),
        b: integerize(b % 256)
    }
    return {
        ...rgb,
        cssColor: getRGBCssColor(rgb)
    }
}

export function getColorRGBFromNumber(color: number):ColorRGB {
    const rgb: RGB = {
        r: integerize((color % 0x1000000) / 0x10000),
        g: integerize((color % 0x10000) / 0x100),
        b: integerize((color % 0x100)),
    }
    return {
        ...rgb,
        cssColor: getRGBCssColor(rgb),
    }
}

export function getColorRGBA(r: number, g: number, b: number, a: number): ColorRGBA {
    const rgba: RGBA = {
        r: integerize(r % 256),
        g: integerize(g % 256),
        b: integerize(b % 256),
        a: integerize(a % 256),
    }
    return {
        ...rgba,
        cssColor: getRGBACssColor(rgba),
    }
}

export function getColorRGBAFromNumber(color: number): ColorRGBA {
    const rgba: RGBA = {
        r: integerize((color % 0x100000000) / 0x1000000),
        g: integerize((color %   0x1000000) /   0x10000),
        b: integerize((color %     0x10000) /     0x100),
        a: integerize(      (color %       0x100)),
    }
    return {
        ...rgba,
        cssColor: getRGBACssColor(rgba),
    }
}

export function getColorCMYK(c: number, m: number, y: number, k: number): ColorCMYK {
    const cmyk: CMYK = {
        c: clamp(0,100,c),
        m: clamp(0,100,m),
        y: clamp(0,100,y),
        k: clamp(0,100,k),
    }
    return {
        ...cmyk,
        // purposefully just using RGBA below because not sure how CMYK works vis a vis CSS
        cssColor: getRGBACssColor({r:cmyk.c, g: cmyk.m, b:cmyk.y, a:cmyk.k})
    }
}



function getRGBCssColor(rgb: RGB): string {
    return `#${rgb.r.toString(16).padStart(2, '0')}${rgb.g.toString(16).padStart(2, '0')}${rgb.b.toString(16).padStart(2, '0')}`;
}
function getRGBACssColor(rgba: RGBA): string {
    return `${getRGBCssColor({r: rgba.r,g: rgba.g,b: rgba.b})}${rgba.a.toString(16).padStart(2, '0')}`;
}

function integerize(input: number): number {
    return Math.abs(Math.trunc(input));
}
