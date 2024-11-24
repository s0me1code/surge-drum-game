import { motion, AnimatePresence } from 'framer-motion';
import { ToggleGroupItem, ToggleGroup } from "../.././components/ui/toggle-group"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../.././components/ui/card"
import { Input } from "../.././components/ui/input"
import { Button } from "../.././components/ui/button"
import { Label } from "../.././components/ui/label"
import { IHomeChild, Phases } from "../Home"
import { useState } from "react"
import { DifficultyCarousel, IDifficulty } from "./home.carusousel"
import useGameStore from "../state/game.state"
import { useToast } from "../../hooks/use-toast"
import { useAnStore } from '../state/animation.store';

type IConf = { title: string, name: string, nameP: string, difficulty: string, difficulties: IDifficulty[], button: string }
const conf: IConf = {
    title: "Get ready",
    name: "Name",
    nameP: "Will show it on the dashboard",
    difficulty: "Difficulty",
    difficulties: [
        {
            label: "Easy",
            value: "easy",
            videoUrl: "./easy.gif",
        },
        {
            label: "Medium",
            value: "medium",
            videoUrl: "./medium.gif",
        },
        {
            label: "Hard",
            value: "hard",
            videoUrl: "./hard.gif",
        }
    ],
    button: "Submit"
}

export const Form: React.FC<IHomeChild> = ({ setPhase }) => {

    const { setDetails } = useGameStore()
    const { toast } = useToast()
    const [difficulty, setDifficalty] = useState<string>()
    const [name, setName] = useState<string>()
    const handelUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value
        setName(name)
    }
    const handelSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (name && difficulty) {
            setStartAn(true)
            setDetails({ name, difficulty })
            toast({ description: "Your data saved successfully" })
            setPhase(Phases.experinace)
        } else {
            toast({ description: "Try Again, We faced and issue saving your data", variant: "destructive" })
        }
    }

    // Animaiton
    const { startAn, setStartAn, carusouselAn, formAn, walkAn } = useAnStore()

    return <div className="bg-none bg-transparent w-full h-full flex flex-row justify-around items-center">
        <motion.div
            {...formAn}
            animate={startAn ? "on" : "off"}
            className='w-full'>
            <Card className="w-full max-w-sm mx-auto">
                <CardHeader>
                    <CardTitle>{conf.title}</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor={conf.name}>{conf.name}</Label>
                            <Input
                                id={conf.name}
                                placeholder={conf.nameP}
                                onChange={handelUpdate}
                            />
                        </div>
                    </div>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor={conf.difficulty}>{conf.difficulty}</Label>
                            <div className="w-full max-w-sm mx-auto">
                                <ToggleGroup
                                    type="single"
                                    value={difficulty}
                                    onValueChange={(value) => { value && setDifficalty(value) }}
                                    className="justify-center border rounded-md"
                                >
                                    {conf.difficulties.map((difficalty, i) => (
                                        <ToggleGroupItem key={i} value={difficalty.value} className="flex-1 px-4 py-2 data-[state=on]:bg-secondary data-[state=on]:border data-[state=on]:border-primary">
                                            {difficalty.label}
                                        </ToggleGroupItem>
                                    ))}
                                </ToggleGroup>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button disabled={!name || !difficulty} onClick={handelSubmit}>{conf.button}</Button>
                </CardFooter>
            </Card>
        </motion.div>

        {/*<Button
            className='absolute z-50 top-0 right-1/2'
            onClick={() => {
                console.log(running)
                //                setStartAn(!startAn); console.log(startAn)
                setRunning(true)
            }} >
            {conf.button}
        </Button>*/}
        <AnimatePresence mode='wait'>
            <div className="w-1/2 flex-col relative">
                <motion.div
                    className="w-full flex flex-row justify-center"
                    {...carusouselAn}
                    animate={startAn ? "on" : "off"}
                >
                    <DifficultyCarousel difficulties={conf.difficulties} selectedDifficulty={difficulty} />
                </motion.div>
                <motion.div className=" absolute top-0 w-full flex flex-row justify-start"
                    {...walkAn}
                    animate={startAn ? "on" : "off"}
                >
                    <Video />
                </motion.div>
            </div>
        </AnimatePresence>
    </div>
}


const Video = () => {
    return (
        <Card className=" w-[36rem] overflow-clip p-1">
            <img
                className="rounded-lg"
                src={"./walk.gif"}
            />
        </Card>
    );
}

