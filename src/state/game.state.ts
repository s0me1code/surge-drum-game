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
}
export type IScore = {
    gauges: IGauges,
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
        level: 0,
        pressure: 0,
        temp: 0,
        out: 0,
    },
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
    setDetails: ({ name, difficulty }) => set(() => ({ name, difficulty, running: true }))
}));

export default useGameStore;

