import { ToggleGroupItem, ToggleGroup } from "../.././components/ui/toggle-group"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../.././components/ui/card"
import { Input } from "../.././components/ui/input"
import { Button } from "../.././components/ui/button"
import { Label } from "../.././components/ui/label"
import { IHomeChild } from "../Home"
import { useState } from "react"
import { DifficultyCarousel, IDifficalty } from "./home.carusousel"

type IConf = { title: string, name: string, nameP: string, difficulty: string, difficulties: IDifficalty[], button: string }
const conf: IConf = {
    title: "Get ready",
    name: "Name",
    nameP: "Will show it on the dashboard",
    difficulty: "Difficulty",
    difficulties: [
        {
            label: "Easy",
            value: "easy",
            videoUrl: "./easy.mp4",
        },
        {
            label: "Medium",
            value: "medium",
            videoUrl: "./medium.mp4",
        },
        {
            label: "Hard",
            value: "hard",
            videoUrl: "./hard.mp4",
        }
    ],
    button: "Submit"
}

export const Form: React.FC<IHomeChild> = () => {
    const [value, setValue] = useState<string>(conf.difficulties[0].value)
    return <div className="w-full h-full flex flex-row justify-around items-center">
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
                <Button>{conf.button}</Button>
            </CardFooter>
        </Card>
        <DifficultyCarousel difficulties={conf.difficulties} selectedDifficulty={value} />
    </div>
}



