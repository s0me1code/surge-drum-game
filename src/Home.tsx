import { useEffect, useState } from "react"
import { Experinace } from "./Experiance"
import { Cover } from "./components/aceternity/cover"
import { Form } from "./components/home.form"
import { useLocation, useNavigate } from "react-router-dom"

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
            <h1 className="text-4xl md:text-4xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center mb-24 relative z-20 py-6 text-slate-900 dart:from-neutral-800 dart:via-white dart:to-white">
                Surge durm simulation <br /> game, <span className="cursor-pointer" onClick={handleClickCover} ><Cover>Lets go</Cover></span>
            </h1>
        </div>
    </>
}

export const Home = () => {
    const [phase, setPhase] = useState<Phases>(Phases.landing)

    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        if (location.state?.reset) {
            // Perform reset logic here, e.g., reset state or clear data
            console.log('Resetting home page state...');
            window.location.reload()
            // Clear the reset state to prevent further triggering of this effect
            navigate('.', { replace: true, state: {} });
        }
    }, [location, navigate]);
    return <>
        {phase == Phases.landing ? <Landing setPhase={setPhase} /> :
            <div className="relative w-full h-full overflow-hidden">
                <Form setPhase={setPhase} />
                <Experinace setPhase={setPhase} />
            </div>}
    </>
}
