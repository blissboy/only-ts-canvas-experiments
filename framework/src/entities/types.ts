export * from './dynamicPoints';

export interface Point {
    x: number;
    y: number;
    z?: number;
}

export const randomPoint = (pointScaleX: number, pointScaleY: number = pointScaleX, pointScaleZ: number = pointScaleX) => {
    return {
        x: Math.floor(Math.random() * pointScaleX),
        y: Math.floor(Math.random() * pointScaleY),
        z: Math.floor(Math.random() * pointScaleZ),
    } as Point
}

export interface DynamicPoint {
    getPoint: (time: number) => Point;
}
