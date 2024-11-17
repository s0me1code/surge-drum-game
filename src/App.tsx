import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, useHelper } from '@react-three/drei'
import { useRef } from 'react'
import './App.css'
import { useCoord } from './state/coordinates.state'
import Gauges from './components/gauges/_gauge'
import { Drum } from './components/drum'
import { _toArray } from './utils/_'
// import { LevaCoord } from './state/cootdinates.leva'
import { Ground } from './components/ground'
import { Model } from './components/Model'
import { Perf } from 'r3f-perf'
import { Overlay } from './components/overlay/Overlay'

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
            cameraRef.current.lookAt(camera.target.x, camera.target.y, camera.target.z)
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
    return <>
        <Overlay/>
        <Canvas shadows style={{ background: "#222" }}>
            <Experinace />
        </Canvas>
    </>
}

export default App
