import { MotionProps } from "framer-motion";
import { create } from "zustand";

const transitionComm = {
    ease: "easeInOut",
    duration: 6,
    times: [0, 1 / 6, 1],
}
const offTransitionComm = {
    transition: {
        ease: "easeInOut",
        duration: 2,
    }
}
let carusouselAn: MotionProps = {
    variants: {
        on: { opacity: 0, },
        off: { opacity: 1, },
    },
    initial: { opacity: 1 },
    exit: { opacity: 0 },
    transition: {
        ...transitionComm,
        duration: 1,
        times: []
    },
}
const walkAn: MotionProps = {
    variants: {
        on: {
            opacity: [0, 1, 1],
            translateX: [0, 0, "-190%"]
        },
        off: {
            ...offTransitionComm,
            opacity: [0, 0, 0],
            translateX: 0,
        }
    },
    initial: { opacity: 0 },
    exit: { opacity: 0 },
    transition: {
        ...transitionComm,
    },
}
const formAn: MotionProps = {
    variants: {
        on: {
            translateX: [0, 0, "-200%"]
        },
        off: {
            ...offTransitionComm,
            translateX: 0,
        }
    },
    initial: { opacity: 1 },
    exit: { opacity: 0 },
    transition: {
        ...transitionComm,
    },
}
const convasAn: MotionProps = {
    variants: {
        on: {
            translateX: ['100%', '100%', 0]
        },
        off: {
            ...offTransitionComm,
            translateX: '100%',
        },
    },
    //    initial: { translateX: '100%' },
    exit: { opacity: 0 },
    transition: {
        ...transitionComm,
    },
}

type IAnStore = {
    startAn: boolean,
    setStartAn: (startAn: boolean) => void,
    carusouselAn: MotionProps,
    walkAn: MotionProps,
    formAn: MotionProps,
    convasAn: MotionProps,
}
export const useAnStore = create<IAnStore>((set) => ({
    startAn: false,
    setStartAn: (startAn) => set(() => ({ startAn })),
    carusouselAn,
    walkAn,
    formAn,
    convasAn
}))

