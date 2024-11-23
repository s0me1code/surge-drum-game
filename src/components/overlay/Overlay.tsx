import { useEffect, useState } from "react";
import useGameStore, { ILostReasons } from "../../state/game.state";
import { Card } from "../../../components/ui/card";

const conf = {
    countT: "Get ready will start in ...",
    countStart: 5,
    lostReasonsHPT: "You lost becouse the pressure went higher than 340",
    lostReasonsLLT: "You lost becouse the level droped below 10",
}
const Overlay = () => {
    const { count, lostResoan, gauges } = useGameStore()
    console.log(lostResoan)
    return <>
        <div className={"absolute flex flex-col bg-white z-10 top-0 right-1/2 translate-x-1/2"}>
            <Text>
                {conf.countT}
            </Text>
            <Text>
                {lostResoan &&
                    (lostResoan == ILostReasons.HP ?
                        conf.lostReasonsHPT :
                        conf.lostReasonsLLT
                    )
                }
            </Text>
            <Text>
                level: {gauges.level.toFixed(2)}
                flow: {gauges.flow.toFixed(2)}
                pressure: {gauges.pressure.toFixed(2)}
                temp: {gauges.temp.toFixed(2)}
                out: {gauges.out.toFixed(2)}
            </Text>
        </div>
        <Count start={count} />
    </>
}

type ICount = {
    start: number,
}
const Count: React.FC<ICount> = ({ start },) => {
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
        {count > 0 && <div className="absolute text-[10rem] z-20 leading-tight top-1/2 right-1/2 -translate-y-1/2 translate-x-1/2">
            <Card className="bg-primary-foreground/50 border-primary">
                {count}
            </Card>
        </div>}
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
