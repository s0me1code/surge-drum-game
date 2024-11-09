import { Coord3D } from "../types";

export const _toArray = (obj: Coord3D): [number, number, number] => {
    return [obj.x, obj.y, obj.z]
};

