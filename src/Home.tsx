import { useState } from "react"
import { Experinace } from "./Experiance"
import { Cover } from "./components/aceternity/cover"
import { Form } from "./components/home.form"

export enum Phases {
    landing = 0,
    form = 1,
    experinace = 5,
}

export type IHomeChild = {
    phase?: Phases,
    setPhase: React.Dispatch<React.SetStateAction<Phases>>,
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

export const Home = () => {
    const [phase, setPhase] = useState<Phases>(Phases.landing)
    return <div className="relative w-full h-full overflow-hidden">
        <Form setPhase={setPhase} />
        <Experinace setPhase={setPhase} />
    </div>
}
//{ phase == Phases.landing && <Landing setPhase={setPhase} /> }
