// color types
import {CMYK, ColorCMYK, ColorRGB, ColorRGBA, RGB, RGBA} from "./types";
import {clamp} from "../utils";

export function getColorRGB(r: number, g: number, b: number): ColorRGB {
    const rgb: RGB = {
        r: r % 256,
        g: g % 256,
        b: b % 256
    }
    return {
        ...rgb,
        cssColor: getRGBCssColor(rgb)
    }
}

export function getColorRGBFromNumber(color: number):ColorRGB {
    const rgb: RGB = {
        r: (color % 0x0F010000) / 0x010000,
        g: (color % 0x0F0100) / 0x0100,
        b: (color % 0x0F01),
    }
    return {
        ...rgb,
        cssColor: getRGBCssColor(rgb),
    }
}

export function getColorRGBA(r: number, g: number, b: number, a: number): ColorRGBA {
    const rgba: RGBA = {
        r: r % 256,
        g: g % 256,
        b: b % 256,
        a: a % 256,
    }
    return {
        ...rgba,
        cssColor: getRGBACssColor(rgba),
    }
}

export function getColorRGBAFromNumber(color: number): ColorRGBA {
    const rgba: RGBA = {
        r: (color % 0x0F01000000) / 0x01000000,
        g: (color % 0x0F010000) / 0x010000,
        b: (color % 0x0F0100) / 0x0100,
        a: (color % 0x0F01),
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
    return `#${getRGBCssColor({r: rgba.r,g: rgba.g,b: rgba.b})}${rgba.a.toString(16).padStart(2, '0')}`;
}
