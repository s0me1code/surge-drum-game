import { Coord3D } from "../types";

export const _toArray = (obj: Coord3D): [number, number, number] => {
    return [obj.x, obj.y, obj.z]
};

export const _between = (x: number, max: number, min: number) => Math.max(Math.min(x, max), min)

