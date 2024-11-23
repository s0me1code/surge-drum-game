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
    at?: Date,
    by?: string
    name: string,
    difficulty: string,
}
type IGameStore = {
    name?: string,
    difficulty?: string,
    count: number,
    scoreSetted: boolean,
    lostResoan?: ILostReasons,
    elapsedTime: number,
    flowVariances: number,
    gauges: IGauges,
    setScore: (arg0: IScore) => void,
    setDetails: (arg0: { name: string, difficulty: string}) => void,
}
const handleAddScore = async (score: any) => {
    try {
        const docRef = await addDoc(collection(db, "_"), {
            ...score
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (error) {
        console.error("Error adding document: ", error);
    }
};

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
    setScore: ({ elapsedTime, flowVariances, gauges, lostResoan }) => set(() => {
        handleAddScore({ gauges, elapsedTime, flowVariances, lostResoan, at: Date.now(), by: "temp" })
        return { gauges, elapsedTime, flowVariances, lostResoan, scoreSetted: true }
    }),
    setDetails: ({ name, difficulty }) => set(() => ({ name, difficulty }))
}));

export default useGameStore;

