import * as THREE from 'three'
import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { useRef } from 'react'
import './App.css'
import { useCoord } from './state/coordinates.state'
import Gauges from './components/gauges/_gauge'
import { _toArray } from './utils/_'
// import { LevaCoord } from './state/cootdinates.leva'
//import { Ground } from './components/ground'
import { Model } from './components/Model'
//import { Perf } from 'r3f-perf'
import { Overlay } from './components/overlay/Overlay'
import { IHomeChild } from './Home'
import { useAnStore } from './state/animation.store'

const ExperinaceCanvas = () => {
    /**
     * Refs
     * */
    const directionalLightRef = useRef<THREE.DirectionalLight>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera>(null);

    /**
     * Helpers
     * */
    //useHelper(directionalLightRef as React.MutableRefObject<THREE.Object3D>, THREE.DirectionalLightHelper, 2);
    //useHelper(cameraRef as React.MutableRefObject<THREE.Object3D>, THREE.CameraHelper);

    /**
     * Coordinates
     * */
    const {
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
        {/*<Perf position="top-left" />*/}
        {/*<axesHelper args={[2]} />*/}
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
            far={20}
            fov={65}
            position={_toArray(camera.position)} />

        {/*<Ground />*/}
        <Gauges />
        <Model />
    </>
}

export const Experinace: React.FC<IHomeChild> = ({ setPhase }) => {
    const { startAn, convasAn } = useAnStore()
    return <>

        {startAn && <motion.div
            {...convasAn}
            animate={startAn ? "on" : "off"}
            className='absolute top-0 right-0 z-10 w-full h-full p-4 pt-16 flex flex-col justify-between align-top text-center text-2xl font-semibold '>
            <Overlay setPhase={setPhase} />
            <div className='-mt-12'>Press <span className='text-xl bg-gray-300 p-1 px-2 rounded-lg overflow-hidden'> SPACE</span> to Start</div>
            <Canvas
                // frameloop='demand'
                shadows
                style={{ background: "#222" }}
                className='absolute w-fill h-full rounded-xl'
            >
                <ExperinaceCanvas />
            </Canvas>
        </motion.div>}

    </>
}
