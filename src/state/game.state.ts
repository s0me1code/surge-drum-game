import { create } from "zustand";

type IUpdateGauges = {
    flowGauge: number,
    levelGauge: number,
    pressureGauge: number,
}
type IGameStore = {
    flowGauge:number,
    levelGauge:number,
    pressureGauge:number,
    targetFlowGauge:number,
    rate:number,
    generateRandomFlowGaugeTarget:()=>void,
    updateGauges:(arg0:IUpdateGauges)=>void,
}

const useGameStore = create<IGameStore>((set) => ({
    flowGauge: 10,
    levelGauge: 10,
    pressureGauge: -90,
    targetFlowGauge: 10,
    rate: 5,
    generateRandomFlowGaugeTarget: () => set({
        targetFlowGauge: Math.floor(Math.random() * 80) + 10,
    }),
    updateGauges: ({flowGauge,pressureGauge,levelGauge}) => set({
        flowGauge,
        levelGauge,
        pressureGauge,
    }),
}));

export default useGameStore;

