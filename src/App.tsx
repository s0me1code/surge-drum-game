import * as THREE from 'three'
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import { useControls } from 'leva'
import './App.css'
import { useCoord } from './state/coordinates'
import Gauges from './components/gauges/_gauge'
import { Drum } from './components/drum'
import { Grid, OrbitControls, PerspectiveCamera, useGLTF, useHelper } from '@react-three/drei'

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

const Model = () => {
    const { scene, nodes } = useGLTF('/public/models/scene.glb');

    // Apply a standard material to ensure it's affected by light
    scene.traverse((child) => {
        if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial;
        }
    });

    console.log(scene)
    console.log(nodes)
    return <primitive object={scene} scale={0.5} position={[0, 0, 0]} />;
};

function Ground() {
    const gridConfig = {
        cellSize: 0.5,
        cellThickness: 0.5,
        cellColor: '#6f6f6f',
        sectionSize: 3,
        sectionThickness: 1,
        sectionColor: '#9d4b4b',
        fadeDistance: 30,
        fadeStrength: 1,
        followCamera: false,
        infiniteGrid: true
    }
    return <Grid position={[0, -0.01, 0]} args={[10.5, 10.5]} {...gridConfig} />
}

const Experinace = () => {

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


    const spotLightRef = useRef<THREE.SpotLight>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera>(null);

    // Use the useHelper hook to attach CameraHelper to the camera
    useHelper(spotLightRef as React.MutableRefObject<THREE.Object3D>, THREE.SpotLightHelper);
    useHelper(cameraRef as React.MutableRefObject<THREE.Object3D>, THREE.CameraHelper);

    return <>
        <OrbitControls />
        <axesHelper args={[2]} />
        {/* Ambient light */}
        <ambientLight intensity={.5} />

        {/* Spotlight */}
        <spotLight ref={spotLightRef} position={[10, 10, 10]} angle={0.15} intensity={1} />

        {/* Camera and Camera Helper */}
        <PerspectiveCamera ref={cameraRef} makeDefault position={[3, 3, 3]} />

        <Ground />
        {/* Your models or other components */}
        {/* Replace <Gauges />, <Drum />, and <Model /> with your components */}
        <Gauges />
        <Drum position={[positionTemp.x, positionTemp.y, 0]} />
        <Model />

    </>
}

function App() {
    return <Canvas style={{ background: "#222" }}>
        <Experinace />
    </Canvas>
}

export default App
