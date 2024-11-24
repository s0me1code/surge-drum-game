import { create } from "zustand";
import { db } from "../firebase/config";
import { addDoc, collection } from "firebase/firestore";
import { IDifficulty } from "../components/home.carusousel";

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
    targetFlow: number,
    targetPressure: number,
    spaceDown: boolean,
    levelCapTop: number,
    levelCapBottom: number,
}
export type IScore = {
    gauges: {
        flow: number,
        level: number,
        pressure: number,
        temp: number,
        out: number,
    },
    lostResoan: ILostReasons,
    elapsedTime: number,
    flowVariances: number,
    at?: number,
    name?: string
    difficulty?: string,
}
type IGameStore = {
    restart: boolean,
    running: boolean,
    setRunning: (running: boolean) => void,
    name?: string,
    difficulty?: string,
    count: number,
    scoreSetted: boolean,
    lostResoan?: ILostReasons,
    elapsedTime: number,
    flowVariances: number,
    gauges: IGauges,
    setGauges: (gauges: IGauges) => void,
    spaceDown: boolean,
    setSpaceDown: (spaceDown: boolean) => void,
    showDialog: boolean,
    setShowDialog: (showDialog: boolean) => void,
    setRestart: (restart: boolean) => void,
    setScore: (arg0: IScore) => void,
    setDetails: (arg0: { name: string, difficulty: string }) => void,
}
const handleAddScore = async (score: IScore) => {
    try {
        const docRef = await addDoc(collection(db, "_"), {
            ...score
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (error) {
        console.error("Error adding document: ", error);
    }
};

const useGameStore = create<IGameStore>((set, get) => ({
    running: false,
    setRunning: (running) => set(() => ({ running })),
    restart: true,
    setRestart: (restart) => set(() => ({ restart })),
    count: 5,
    scoreSetted: false,
    elapsedTime: 0,
    flowVariances: 1,
    gauges: {
        flow: 0,
        targetFlow: 0,
        level: 10,
        out: 0,
        pressure: 0,
        targetPressure: 0,
        temp: 0,
        spaceDown: false,
        levelCapTop: 0,
        levelCapBottom: 0,
    },
    setGauges: (gauges: IGauges) => set(() => ({ gauges })),
    spaceDown: false,
    setSpaceDown: (spaceDown) => set(() => ({ spaceDown })),
    showDialog: false,
    setShowDialog: (showDialog) => set(() => ({ showDialog })),
    setScore: ({ elapsedTime, flowVariances, gauges, lostResoan }) => set(() => {
        const { name, difficulty } = get()
        if (difficulty && name)
            handleAddScore({
                gauges, elapsedTime, flowVariances,
                lostResoan, at: Date.now(), name,
                difficulty
            })
        return { gauges, elapsedTime, flowVariances, lostResoan, scoreSetted: true, running: false }
    }),
    setDetails: ({ name, difficulty }) => set(() => ({ name, difficulty }))
}));

export default useGameStore;

