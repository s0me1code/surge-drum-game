import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Grid, OrbitControls, PerspectiveCamera, useGLTF, useHelper } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import { useControls } from 'leva'
import './App.css'
import { Coord3D, useCoord } from './state/coordinates'
import Gauges from './components/gauges/_gauge'
import { Drum } from './components/drum'

const Model = () => {
    const { scene, nodes } = useGLTF('/public/models/scene.glb');
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
    const { initBox, setInitBox,initDirectionalLight, setInitDirectionalLight, saveCoord} = useCoord()
    const { positionTemp } = useControls("initBox", {
        positionTemp: {
            joystick: 'invertY',
            value: { ...initBox.position },
            step: 0.01,
        }
    })

    console.log(initDirectionalLight)
    const { directionalLightTemp, directionalLightTarget } = useControls("DirectionalLight", {
        directionalLightTemp: {
            joystick: 'invertY',
            value: { ...initDirectionalLight.position },
            step: 0.01,
        },
        directionalLightTarget: {
            joystick: 'invertY',
            value: { ...initDirectionalLight.target },
            step: 0.01,
        },
    })

    // to allow save current useControls coordinates
    useEffect(() => {
        const handleKeyDown = (event: any) => {
            if ((event.ctrlKey || event.metaKey) && event.key === 's') {
                event.preventDefault();
                setInitBox({ position: { ...positionTemp } })
                setInitDirectionalLight({
                    target: { ...directionalLightTarget },
                    position: { ...directionalLightTemp }
                })
                saveCoord();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [saveCoord, positionTemp, directionalLightTarget, directionalLightTemp]);

    useFrame(() => {
        if (cameraRef.current) {
            //            cameraRef.current.lookAt(0, 3.5, 0);
        }
        if (directionalLightRef.current) {
            directionalLightRef.current.target.position.set(directionalLightTarget.x, directionalLightTarget.y, directionalLightTarget.z)
            directionalLightRef.current.target.updateMatrixWorld()
        }
    })

    const directionalLightRef = useRef<THREE.DirectionalLight>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera>(null);

    // Use the useHelper hook to attach CameraHelper to the camera
    useHelper(directionalLightRef as React.MutableRefObject<THREE.Object3D>, THREE.DirectionalLightHelper, 2);
    useHelper(cameraRef as React.MutableRefObject<THREE.Object3D>, THREE.CameraHelper);

    return <>
        <OrbitControls />
        <axesHelper args={[2]} />

        {/* Light*/}
        <ambientLight intensity={.3} />
        <directionalLight
            castShadow
            ref={directionalLightRef}
            position={_toArray({ ...directionalLightTemp })}
            intensity={1} />

        {/* Camera and Camera Helper */}
        <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 8, 9]} />

        <Ground />
        <Gauges />
        <Drum position={[positionTemp.x, positionTemp.y, 0]} />
        <Model />
    </>
}

// TODO: move utils
const _toArray = (obj: Coord3D): [number, number, number] => {
    return [obj.x, obj.y, obj.z]
};

function App() {
    return <Canvas shadows style={{ background: "#222" }}>
        <Experinace />
    </Canvas>
}

export default App
