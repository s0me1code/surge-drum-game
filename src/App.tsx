import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, useHelper } from '@react-three/drei'
import { useRef } from 'react'
import './App.css'
import { useCoord } from './state/coordinates.state'
import Gauges from './components/gauges/_gauge'
import { Drum } from './components/drum'
import { _toArray } from './utils/_'
import { LevaCoord } from './state/cootdinates.leva'
import { Ground } from './components/ground'
import { Model } from './components/Model'
import { Perf } from 'r3f-perf'
import useGameStore from './state/game.state'

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
            //cameraRef.current.lookAt(camera.target.x, camera.target.y, camera.target.z)
        }
        if (directionalLightRef.current) {
            directionalLightRef.current.target.position.set(directionalLight.target.x, directionalLight.target.y, directionalLight.target.z)
            directionalLightRef.current.target.updateMatrixWorld()
        }
    })

    return <>
        <OrbitControls />
        <Perf position="top-left" />
        <axesHelper args={[2]} />
        {/* <LevaCoord /> */}

        {/* Light*/}
        <ambientLight intensity={.3} />
        <directionalLight
            castShadow
            ref={directionalLightRef}
            position={_toArray({ ...directionalLight.position })}
            intensity={1} />

        {/* Camera */}
        <PerspectiveCamera
            ref={cameraRef}
            makeDefault
            position={_toArray(camera.position)} />

        <Ground />
        <Gauges />
        <Model />
        <Drum position={[box.position.x, box.position.y, 0]} />
    </>
}

function App() {
    /**
     * Game State
     * */
    const {
        flow,
        level,
        pressure,
        temp,
        out,
        targetFlow,
        rate,
    } = useGameStore();

    return <>
        <div style={{
            position: "absolute",
            top: 0,
            left: "50%",
            height: "150px",
            width: "300px",
            background: "#ffffff22",
            zIndex: 10,
            flex: "row",
        }}>
            <div>flow:{flow}</div>
            <div>level:{level}</div>
            <div>pressure:{pressure}</div>
            <div>temp:{temp}</div>
            <div>out:{out}</div>
            <div>targetFlow:{targetFlow}</div>
            <div>rate:{rate}</div>
        </div>
        <Canvas shadows style={{ background: "#222" }}>
            <Experinace />
        </Canvas>
    </>
}

export default App
