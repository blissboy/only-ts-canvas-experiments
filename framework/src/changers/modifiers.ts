import {SimpleValue, TimedModifier} from "./types";

export function getSinWaveModifier(period: number): TimedModifier {
    return (time: number) => Math.sin(time % period);
}

export function getCosWaveModifier(period: number): TimedModifier {
    return (time: number) => Math.cos(time % period);
}

export function getSimpleRandomValueFunction(min: number, max: number): SimpleValue {
    return () => {
        return Math.floor(Math.random() * (max - min) + min);
    }
}