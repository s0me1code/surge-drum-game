import * as THREE from 'three'
import { useFrame } from '@react-three/fiber';
import { damp } from 'maath/easing';
import useGameStore from '../../state/game.state';
import { Html, Text, useGLTF } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import { GLTF } from 'three-stdlib'
import '../../App.css'

type GLTFResult = GLTF & {
    nodes: {
        digitalIn: THREE.Mesh
        digitalOut: THREE.Mesh
        level: THREE.Mesh
        levelMeasures: THREE.Mesh
        cyclic: THREE.Mesh
        cyclicMesures: THREE.Mesh
    }
    materials: {}
}

const Gauges = (props: JSX.IntrinsicElements['group']) => {
    /**
     * gltf
     * */
    const { scene, nodes } = useGLTF('./models/gauges.glb') as GLTFResult;
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
        generateRandomFlowTarget,
        updateGauges,
    } = useGameStore();


    /**
     * Ref
     * */
    const levelRef = useRef<THREE.Mesh>(null)
    const cyclicRef = useRef<THREE.Mesh>(null)

    useFrame((_, delta) => {
        const f = {
            flow,
            level,
            pressure,
            temp,
            out,
        }
        damp(f, "flow", targetFlow, 0.1, delta);
        if (levelRef && levelRef.current) levelRef.current.scale.y = 1
        updateGauges({ ...f });

        // ganerate only when close to target
        if (Math.abs(f.flow - targetFlow) < 2) {
            f.level = Math.min(95, Math.max(10, f.flow / rate));
            generateRandomFlowTarget();
        }
    });
    useEffect(() => {
        console.log(nodes)
    }, [])

    return (
        <>
            <group>
                <Html>
                    {targetFlow}<br />{flow.toFixed(2)}
                </Html>
            </group>
            <group {...props} scale={.5} dispose={null}>
                <mesh
                    geometry={nodes.digitalIn.geometry}
                    material={nodes.digitalIn.material}
                />
                <mesh
                    geometry={nodes.digitalOut.geometry}
                    material={nodes.digitalOut.material}
                />
                <mesh
                    ref={levelRef}
                    geometry={nodes.level.geometry}
                    material={nodes.level.material}
                    position={[12.907, 0.474, -7.875]}
                />
                <mesh
                    geometry={nodes.levelMeasures.geometry}
                    material={nodes.levelMeasures.material}
                />
                <mesh
                    ref={cyclicRef}
                    geometry={nodes.cyclic.geometry}
                    material={nodes.cyclic.material}
                    position={[1.856, 14.577, -8.634]}
                />
                <mesh
                    geometry={nodes.cyclicMesures.geometry}
                    material={nodes.cyclicMesures.material}
                />
            </group>
        </>
    );
};

useGLTF.preload('./models/gauges.glb')
export default Gauges;

