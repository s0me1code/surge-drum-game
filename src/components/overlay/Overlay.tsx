import { useEffect, useState } from "react";
import useGameStore from "../../state/game.state";

const conf = {
    countT: "Get ready will start in ...",
    countStart: 5,
}
const Overlay = () => {
    const {count} = useGameStore()
    return <>
        <div className={"absolute flex flex-col bg-white z-10 top-0 right-1/2 translate-x-1/2"}>
            <Text>
                {conf.countT}
            </Text>
            <Count start={count}/>
        </div>
    </>
}

type ICount = {
    start: number,
}
const Count: React.FC<ICount> = ({ start }) => {
    const [count, setCount] = useState(start);
    useEffect(() => {
        const timerInterval = setInterval(() => {
            setCount((prevTime) => {
                if (prevTime === 0) {
                    clearInterval(timerInterval);
                    return 0;
                } else {
                    return prevTime - 1;
                }
            });
        }, 1000);
        return () => clearInterval(timerInterval);
    }, []);
    return <>
        <Text>
            {count}
        </Text>
    </>
}

type TextProps = {
    children: React.ReactNode;
}
const Text: React.FC<TextProps> = ({ children }) => {
    return <>
        <div className={"text-xl font-ibmBios"}>
            {children}
        </div>
    </>
}

export { Overlay }
