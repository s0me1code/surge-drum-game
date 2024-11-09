import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { Grid, OrbitControls, PerspectiveCamera, useGLTF, useHelper } from '@react-three/drei'
import { useRef } from 'react'
import { useControls } from 'leva'
import './App.css'
import { useCoord } from './state/coordinates.state'
import Gauges from './components/gauges/_gauge'
import { Drum } from './components/drum'
import { _toArray } from './utils/_'
import { LevaCoord } from './state/cootdinates.leve'

const Model = () => {
    const { scene, nodes } = useGLTF('./models/scene.glb');
    // Apply a standard material to ensure it's affected by light
    scene.traverse((child: any) => {
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({
                color: child.material.color, // Retain original color if present
                roughness: 0.5,
                metalness: 0.5,
            });
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
    /**
     * Refs
     * */
    const directionalLightRef = useRef<THREE.DirectionalLight>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera>(null);

    /**
     * Helpers
     * */
    useHelper(directionalLightRef as React.MutableRefObject<THREE.Object3D>, THREE.DirectionalLightHelper, 2);
    useHelper(cameraRef as React.MutableRefObject<THREE.Object3D>, THREE.CameraHelper);

    /**
     * Coordinates
     * */
    const {
        box,
        camera,
        directionalLight
    } = useCoord()

    useFrame(() => {
        if (cameraRef.current) {
            //            cameraRef.current.lookAt(camera.target.x, camera.target.y, camera.target.z)
        }
        if (directionalLightRef.current) {
            directionalLightRef.current.target.position.set(directionalLight.target.x, directionalLight.target.y, directionalLight.target.z)
            directionalLightRef.current.target.updateMatrixWorld()
        }
    })

    // to allow save current useControls coordinates
    return <>
        <OrbitControls />
        <axesHelper args={[2]} />

        {/* Light*/}
        <ambientLight intensity={.3} />
        <directionalLight
            castShadow
            ref={directionalLightRef}
            position={_toArray({ ...directionalLight.position })}
            intensity={1} />

        {/* Camera and Camera Helper */}
        <PerspectiveCamera
            ref={cameraRef}
            makeDefault
            position={_toArray(camera.position)} />

        <Ground />
        <Gauges />
        <LevaCoord />
        <Drum position={[box.position.x, box.position.y, 0]} />
        <Model />
    </>
}

function App() {
    return <Canvas shadows style={{ background: "#222" }}>
        <Experinace />
    </Canvas>
}

export default App
