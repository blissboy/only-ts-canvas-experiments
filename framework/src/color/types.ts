// handle the exports for this directory "package"
export * from './colorFactory';

export interface RGB {
    r: number;
    g: number;
    b: number;
}
export interface RGBA extends RGB {
    a: number;
}

export interface ColorRGB extends RGB {
    cssColor: string;
}

export interface ColorRGBA extends RGBA{
    cssColor: string;
}

export interface CMYK {
    c: number;
    m: number;
    y: number;
    k: number;
}
export interface ColorCMYK extends CMYK{
    cssColor: string;
}
