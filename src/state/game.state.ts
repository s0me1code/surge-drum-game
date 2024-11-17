import { create } from "zustand";

type IGameStore = {
    count: number,
    lost: boolean,
    elapsedTime: number,
    flowVariances: number,
    setLost: (lost: boolean) => void,
    setScore: (arg0: { elapsedTime: number, flowVariances: number }) => void,
}

const useGameStore = create<IGameStore>((set) => ({
    count: 5,
    lost: false,
    elapsedTime: 0,
    flowVariances: 1,
    setLost: (lost) => set({ lost }),
    setScore: ({ elapsedTime, flowVariances }) => set({ elapsedTime, flowVariances })
}));

export default useGameStore;

