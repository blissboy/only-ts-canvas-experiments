import {Modifier} from "../changers/types";
import {DynamicPoint, Point} from "./types";
import {getCosWaveModifier, getSinWaveModifier} from "../changers/modifiers";
import base = Mocha.reporters.base;

export function createDynamicPoint(modifer: Modifier, basePoint: Point): DynamicPoint {
    return {
        getPoint: (time: number) => {
            const modValue = modifer(time);
            return {
                x: Math.floor(basePoint.x * modValue),
                y: Math.floor(basePoint.y * modValue),
                z: basePoint.z ? Math.floor(basePoint.z * modValue) : basePoint.z,
            }
        }
    }
}

export function createCirclingPoint(basePoint: Point, period: number, radius: number): DynamicPoint {
    const xMod = getSinWaveModifier(period);
    const yMod = getCosWaveModifier(period);
    return {
        getPoint: (time) => {
            //console.log(`asked for circling point for ${JSON.stringify(basePoint)} at time ${time}`);

            return {
                x: Math.floor(basePoint.x + (radius * xMod(time))),
                y: Math.floor(basePoint.y + (radius * yMod(time))),
                z: basePoint.z
            }
        }
    } as DynamicPoint;
}