import { useState } from "react"
import { Experinace } from "./Experiance"
import { ToggleGroupItem, ToggleGroup } from ".././components/ui/toggle-group"
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from ".././components/ui/card"
import { Input } from ".././components/ui/input"
import { Button } from ".././components/ui/button"
import { Label } from ".././components/ui/label"
import { Cover } from "./components/aceternity/cover"

enum Phases {
    landing = 0,
    form = 1,
    experinace = 5,
}

type IHomeChild = {
    phase?: Phases,
    setPhase?: React.Dispatch<React.SetStateAction<Phases>>,
}

const Landing: React.FC<IHomeChild> = ({ setPhase }) => {
    const handleClickCover = () => { setPhase && setPhase(Phases.form) }
    return <>
        <div className="h-full w-full flex justify-center items-center">
            <h1 className="text-4xl md:text-4xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center mb-24 relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dart:from-neutral-800 dart:via-white dart:to-white">
                Surge durm simulation <br /> game, <span className="cursor-pointer" onClick={handleClickCover} ><Cover>Lets go</Cover></span>
            </h1>
        </div>
    </>
}

const conf = {
    title: "Get ready",
    name: "Name",
    nameP: "Will show it on the dashboard",
    difficulty: "Difficulty",
    difficulties: ["Eassy", "Medium", "Hard"],
    button: "Submit"
}
const Form: React.FC<IHomeChild> = () => {
    const [value, setValue] = useState(conf.difficulties[0])
    return <div className="w-full h-full flex flex-col justify-center items-center">
        <Card className="w-full max-w-sm mx-auto">
            <CardHeader>
                <CardTitle>{conf.title}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor={conf.name}>{conf.name}</Label>
                        <Input id={conf.name} placeholder={conf.nameP} />
                    </div>
                </div>
                <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor={conf.difficulty}>{conf.difficulty}</Label>
                        <div className="w-full max-w-sm mx-auto">
                            <ToggleGroup
                                type="single"
                                value={value}
                                onValueChange={(value) => {
                                    if (value) setValue(value)
                                }}
                                className="justify-center border rounded-md"
                            >
                                <ToggleGroupItem value="option1" className="flex-1 px-4 py-2 data-[state=on]:bg-secondary data-[state=on]:border data-[state=on]:border-primary">
                                    {conf.difficulties[0]}
                                </ToggleGroupItem>
                                <ToggleGroupItem value="option2" className="flex-1 px-4 py-2 data-[state=on]:bg-secondary data-[state=on]:border data-[state=on]:border-primary">
                                    {conf.difficulties[1]}
                                </ToggleGroupItem>
                                <ToggleGroupItem value="option3" className="flex-1 px-4 py-2 data-[state=on]:bg-secondary data-[state=on]:border data-[state=on]:border-primary">
                                    {conf.difficulties[2]}
                                </ToggleGroupItem>
                            </ToggleGroup>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button>{conf.button}</Button>
            </CardFooter>
        </Card>
    </div>
}

export const Home = () => {
    const [phase, setPhase] = useState<Phases>(Phases.landing)
    return <>
        {phase == Phases.landing && <Landing setPhase={setPhase} />}
        {phase == Phases.form && <Form setPhase={setPhase} />}
        {phase == Phases.experinace && <Experinace />}
    </>
}
