import { useControls } from "leva"
import { useCoord } from "./coordinates.state"
import { useEffect } from "react"

const LevaCoord = () => {
    const {
        box: initBox, setBox,
        camera: initCamera, setCamera,
        directionalLight: initDirectionalLight, setDirectionalLight,
        saveCoord
    } = useCoord()

    const box = useControls("initBox", {
        position: {
            joystick: 'invertY',
            value: { ...initBox.position },
            step: 0.01,
        }
    })
    const camera = useControls("Camera", {
        position: {
            joystick: 'invertY',
            value: { ...initCamera.position },
            step: 0.01,
        },
        target: {
            joystick: 'invertY',
            value: { ...initCamera.target },
            step: 0.01,
        },
    })
    const directionalLight = useControls("DirectionalLight", {
        position: {
            joystick: 'invertY',
            value: { ...initDirectionalLight.position },
            step: 0.01,
        },
        target: {
            joystick: 'invertY',
            value: { ...initDirectionalLight.target },
            step: 0.01,
        },
    })

    useEffect(() => {
        setBox({ ...box })
        setCamera({ ...camera })
        setDirectionalLight({ ...directionalLight })
        const handleKeyDown = (event: any) => {
            if ((event.ctrlKey || event.metaKey) && event.key === 's') {
                event.preventDefault();
                saveCoord();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [box, camera, directionalLight]);

    return <></>
}
export { LevaCoord }
