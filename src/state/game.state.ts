import { create } from "zustand";

export enum ILostReasons {
    HP = "high pressure",
    LL = "low level"
};
type IGauges = {
    flow: number,
    level: number,
    pressure: number,
    temp: number,
    out: number,
}
type IGameStore = {
    count: number,
    scoreSetted: boolean,
    lostResoan?: ILostReasons,
    elapsedTime: number,
    flowVariances: number,
    gauges: IGauges,
    setScoreSetted: (scoreSetted:boolean) => void,
    setScore: (arg0: { gauges: IGauges, lostResoan: ILostReasons, elapsedTime: number, flowVariances: number }) => void,
}

const useGameStore = create<IGameStore>((set) => ({
    count: 5,
    scoreSetted: false,
    elapsedTime: 0,
    flowVariances: 1,
    gauges: {
        flow: 0,
        level: 0,
        pressure: 0,
        temp: 0,
        out: 0,
    },
    setScoreSetted: (scoreSetted) => set(()=>({ scoreSetted})),
    setScore: ({ elapsedTime, flowVariances, gauges, lostResoan }) =>  set(()=>({ gauges, elapsedTime, flowVariances, lostResoan }))
}));

export default useGameStore;

