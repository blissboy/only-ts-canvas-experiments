
export interface Point {
    x: number;
    y: number;
    z?: number;
}

export const randomPoint = (pointScaleX: number, pointScaleY: number = pointScaleX, pointScaleZ: number = pointScaleX) => {
    return {
        x: Math.random() * pointScaleX,
        y: Math.random() * pointScaleY,
        z: Math.random() * pointScaleZ,
    } as Point
}
