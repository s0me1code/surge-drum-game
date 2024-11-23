import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../../components/ui/dialog"
import useGameStore, { ILostReasons } from "../../state/game.state";
import { Card } from "../../../components/ui/card";
import { useNavigate } from 'react-router-dom';


const conf = {
    countT: "Get ready will start in ...",
    countStart: 5,
    lostReasonsHPT: " your pressure went higher than 340",
    lostReasonsLLT: " your level droped below 10",
}
const Overlay = () => {
    const navigate = useNavigate();
    const { count, lostResoan, gauges, showDialog } = useGameStore()
    const [open, setOpen] = useState<boolean>(false)

    const handlePlayAgain = () => { }
    const handelDashboard = () => {
        navigate("/dashboard")
    }
    useEffect(() => {
        if (showDialog)
            setOpen(true)
    }, [showDialog])

    return <>
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="select-none absolute top-3 right-3 z-20" >
                {showDialog && <Button variant={"destructive"}>
                    Game Over
                </Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-3xl">Game Over</DialogTitle>
                    <DialogDescription className="text-xl">
                        Your reach the end of the game, becouse
                        <span className="text-primary font-bold underline">
                            {lostResoan &&
                                (lostResoan == ILostReasons.HP ?
                                    conf.lostReasonsHPT :
                                    conf.lostReasonsLLT
                                )}
                        </span>
                    </DialogDescription>
                </DialogHeader>
                <div className=" flex flex-col  space-y-2 text-xl">
                    <div>
                        <span >level:</span>{' '}
                        <span className={"font-semibold"} >{gauges.level.toFixed(2)}</span>
                    </div>
                    <div>
                        <span >flow:</span>{' '}
                        <span className={"font-semibold"} >{gauges.flow.toFixed(2)}</span>
                    </div>
                    <div>
                        <span >pressure:</span>{' '}
                        <span className={"font-semibold"}>{gauges.pressure.toFixed(2)}</span>
                    </div>
                    <div>
                        <span >temp:</span>{' '}
                        <span className={"font-semibold"}>{gauges.temp.toFixed(2)}</span>
                    </div>
                    <div>
                        <span >out:</span>{' '}
                        <span className={"font-semibold"}>{gauges.out.toFixed(2)}</span>
                    </div>
                </div>
                <DialogFooter className="">
                    <Button onClick={handlePlayAgain} className="border-2" variant={"outline"}>Play Agian</Button>
                    <Button onClick={handelDashboard} >Dashboard</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
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
