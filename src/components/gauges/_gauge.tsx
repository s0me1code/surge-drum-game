import * as THREE from 'three'
import { useFrame } from '@react-three/fiber';
import { damp } from 'maath/easing';
import useGameStore from '../../state/game.state';
import { Html, Text, useGLTF } from '@react-three/drei';
import { useEffect } from 'react';
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
        flowGauge,
        levelGauge,
        pressureGauge,
        targetFlowGauge,
        rate,
        generateRandomFlowGaugeTarget,
        updateGauges,
    } = useGameStore();

    useFrame((_, delta) => {
        const f = {
            flowGauge,
            levelGauge,
            pressureGauge,
        }
        damp(f, "flowGauge", targetFlowGauge, 0.1, delta);
        f.levelGauge = Math.min(95, Math.max(10, f.flowGauge / rate));
        f.pressureGauge = f.levelGauge - 100;

        updateGauges({ ...f });

        // ganerate only when close to target
        if (Math.abs(f.flowGauge - targetFlowGauge) < 2) {
            generateRandomFlowGaugeTarget();
        }
    });
    useEffect(() => {
        console.log(nodes)
    }, [])

    return (
        <>
            <group>
                <Html>
                    {targetFlowGauge}<br />{flowGauge.toFixed(2)}
                </Html>
            </group>
            <group {...props} scale={.5} dispose={null}>
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.digitalIn.geometry}
                    material={nodes.digitalIn.material}
                    position={[10.984, 16.187, -8.407]}
                    rotation={[0, -1.571, 0]}
                >
                   <Text rotation-y={Math.PI / 2} position={[1,0,0]}>
{levelGauge}
                   </Text>
                </mesh>
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.digitalOut.geometry}
                    material={nodes.digitalOut.material}
                    position={[-6.899, 1.141, -8.362]}
                    rotation={[0, -1.571, 0]}
                />
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.level.geometry}
                    material={nodes.level.material}
                    position={[12.887, 0.503, -7.865]}
                    rotation={[0, -0.019, 0]}
                    scale={[2.062, 4.092, 2.062]}
                />
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.levelMeasures.geometry}
                    material={nodes.levelMeasures.material}
                    position={[12.9, 6.231, -8.537]}
                    rotation={[0, -0.019, 0]}
                    scale={2.062}
                />
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.cyclic.geometry}
                    material={nodes.cyclic.material}
                    position={[1.856, 14.568, -8.608]}
                    rotation={[0, -1.571, 0]}
                />
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.cyclicMesures.geometry}
                    material={nodes.cyclicMesures.material}
                    position={[1.856, 14.568, -8.656]}
                    rotation={[0, -1.571, 0]}
                />
            </group>
        </>
    );
};

useGLTF.preload('./models/gauges.glb')
export default Gauges;

