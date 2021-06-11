import {Modifier} from "./types";

export function getSinWaveModifier(period: number): Modifier {
    return (time: number) => Math.sin(time % period);
}

export function getCosWaveModifier(period: number): Modifier {
    return (time: number) => Math.cos(time % period);
}