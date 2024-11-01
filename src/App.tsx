import * as THREE from 'three'
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import { useControls } from 'leva'
import './App.css'
import { useCoord } from './state/coordinates'
import Gauges from './components/gauges/_gauge'

function Box(props: ThreeElements['mesh']) {
    const meshRef = useRef<THREE.Mesh>(null!)
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)
    useFrame((_, delta) => (meshRef.current.rotation.x += delta))
    return (
        <mesh
            {...props}
            ref={meshRef}
            scale={active ? 1.5 : 1}
            onClick={() => setActive(!active)}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={hovered ? 'hotpink' : '#2f74c0'} />
        </mesh>
    )
}

function App() {
    const { initBox, setInitBox, saveCoord } = useCoord()
    const { positionTemp } = useControls("initBox", {
        positionTemp: {
            joystick: 'invertY',
            value: { ...initBox.position },
            step: 0.01,
        }
    })
    useEffect(() => {
        const handleKeyDown = (event: any) => {
            if ((event.ctrlKey || event.metaKey) && event.key === 's') {
                event.preventDefault();
                setInitBox({ position: { ...positionTemp } })
                saveCoord();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [saveCoord, positionTemp]);

    return (
        <Canvas>
            <ambientLight intensity={Math.PI / 2} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
            <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
            <Box position={[positionTemp.x, positionTemp.y, 0]} />
            <Gauges />
        </Canvas>
    )
}

export default App
