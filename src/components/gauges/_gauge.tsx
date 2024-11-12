import * as THREE from 'three'
import { useFrame } from '@react-three/fiber';
import { damp } from 'maath/easing';
import useGameStore from '../../state/game.state';
import { Html, Text, useGLTF } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import { GLTF } from 'three-stdlib'
import '../../App.css'
import { useControls } from 'leva';

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
        spaceDown,
        setSpaceDown,
        updateGauges,
    } = useGameStore();


    /**
     * Ref
     * */
    const levelRef = useRef<THREE.Mesh>(null)
    const cyclicRef = useRef<THREE.Mesh>(null)


    /**
     * Changeing rates
     * */
    const { inRate} = useControls({
        inRate: {
            value: 4,
            min: 0,
            max: 10,
            step: 1,
        }
    })
    useFrame((state, delta) => {
        const elapsedTime = state.clock.elapsedTime
        const f = {
            flow,
            level,
            pressure,
            temp,
            out,
        }
        damp(f, "flow", targetFlow, inRate , delta * .5);
        damp(f, "out", 0, .6, delta * .5);
        f.level = (flow - out) / 20
        if (levelRef && levelRef.current) levelRef.current.scale.y = 1
        if (spaceDown) {
            console.log(spaceDown)
            f.out = Math.min(200, out + 10)
            setSpaceDown(false)
        }
        //updateGauges({ ...f })
        // ganerate every 5 sec
        if (elapsedTime % 5 < delta) {
            f.level = Math.min(95, Math.max(10, f.flow / rate));
            generateRandomFlowTarget();
        }
    });

    useEffect(() => {
        console.log(nodes)
        const handleKeyDown = (event: any) => {
            if (event.key === ' ' || event.code === 'Space') {
                event.preventDefault();
                console.log(spaceDown)
                setSpaceDown(true)
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
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

