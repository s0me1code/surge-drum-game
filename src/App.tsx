import * as THREE from 'three'
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { useControls } from 'leva'
import './App.css'
import { useCoord } from './state/coordinates'

function Box(props: ThreeElements['mesh']) {
    const meshRef = useRef<THREE.Mesh>(null!)

    // next comment logic
    // TODO: handle position cases
    const { position } = { ...props }
    const { positionTemp } = useControls("name", {
        positionTemp: {
            joystick: 'invertY',
            value: { x: (position as any)[0], y: (position as any)[1] },
            step: 0.01,
        }
    })

    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)

    useFrame((_, delta) => (meshRef.current.rotation.x += delta))
    return (
        <mesh
            {...props}
            ref={meshRef}
            position={[positionTemp.x, positionTemp.y, 0]}
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
    const { initBox } = useCoord((state) => state)

    return (
        <>
            <Canvas>
                <ambientLight intensity={Math.PI / 2} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
                <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
                <Box position={[initBox.position.x, initBox.position.y, 0]} />
            </Canvas>
        </>
    )
}

export default App
