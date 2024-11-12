import { create } from "zustand";

type IUpdateGauges = {
    flow: number,
    level: number,
    pressure: number,
    temp: number,
    out: number,
}
type IGameStore = IUpdateGauges & {
    targetFlow: number,
    rate: number,
    generateRandomFlowTarget: () => void,
    updateGauges: (arg0: IUpdateGauges) => void,
}

const useGameStore = create<IGameStore>((set) => ({
    flow: 10,
    level: 10,
    pressure: -90,
    temp: 30,
    out: 20,
    targetFlow: 10,
    rate: 5,
    generateRandomFlowTarget: () => set({
        targetFlow: Math.floor(Math.random() * 300),
    }),
    updateGauges: ({ flow, pressure, level, temp, out }:IUpdateGauges) => set({
        flow,
        level,
        pressure,
        temp,
        out
    }),
}));

export default useGameStore;

