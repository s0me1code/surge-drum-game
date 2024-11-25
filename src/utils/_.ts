import { Coord3D } from "../types";

export const _toArray = (obj: Coord3D): [number, number, number] => {
    return [obj.x, obj.y, obj.z]
};

export const _between = (x: number, max: number, min: number) => Math.max(Math.min(x, max), min)

export const formatSecondsToMinutes = (seconds: number): string => {
    const minutes: string = String(Math.floor(seconds / 60)).padStart(2, '0');
    const remainingSeconds: string = String((seconds % 60).toFixed(0)).padStart(2, '0');
    return `${minutes}:${remainingSeconds}`;
}

export const formatDate = (date?: Date | number): string => {
    if (!date) return "N/A";
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    }).format(date);
};
