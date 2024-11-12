import * as THREE from 'three'
import { useFrame } from '@react-three/fiber';
import { damp } from 'maath/easing';
import useGameStore from '../../state/game.state';
import { Html, Text, useGLTF } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import { GLTF } from 'three-stdlib'
import '../../App.css'
import { useControls } from 'leva';
import { _between } from '../../utils/_';

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
     * Ref
     * */
    const levelRef = useRef<THREE.Mesh>(null)
    const cyclicRef = useRef<THREE.Mesh>(null)


    /**
     * Changeing rates
     * */
    // const { inRate } = useControls({
    //     inRate: {
    //         value: .5,
    //         min: 0,
    //         max: 2,
    //         step: .1,
    //     },
    // })

    /**
     * Use Frame
     * */
    // GameStateInitials
    let gameState = {
        flow: 10,
        targetFlow: 0,
        level: 0,
        out: 0,
        pressure: 0,
        temp: 0,
        spaceDown: false
    }
    const generateRandomFlowTarget = () => Math.floor(Math.random() * flowConf.max)
    // Configrations
    const flowConf = { max: 300, min: 0, deltaRate: .4 }
    const levelConf = { max: 100, min: 0, ratio: .05 }
    const levelScaleConf = { max: 100, min: 0, deltaRate: .5 }
    const outConf = { max: 200, min: 0, increaseRate: 10, deltaRate: .2, onPressEffect: .05 }
    const times = { updateLevel: 1, randomFlow: 5 }
    const motion = {smooth: .5}
    // UseFrameIintials
    let lastUpdateTime = 0;
    useFrame((state, delta) => {
        const elapsedTime = state.clock.elapsedTime
        let {
            flow,
            out,
            targetFlow,
            spaceDown,
            level,
        } = gameState

        /**
         * Motion
         * */
        damp(gameState, "flow", targetFlow, motion.smooth, delta * flowConf.deltaRate);
        levelRef && levelRef.current &&
            damp(levelRef.current.scale, "y", _between(level / levelConf.max, levelScaleConf.max, levelScaleConf.min), motion.smooth, delta * levelScaleConf.deltaRate);
        damp(gameState, "out", 0, motion.smooth, delta * outConf.deltaRate);

        /**
         * Update State
         * */
        // one time
        if (spaceDown) {
            gameState.out = Math.min(outConf.max, out + outConf.increaseRate)
            console.log(gameState.out)
            gameState.spaceDown = false
            const levelT = level + - (out / levelConf.ratio) * outConf.onPressEffect
            gameState.level = _between(levelT, levelConf.max, levelConf.min)
        }
        // every 1 sec
        if (elapsedTime - lastUpdateTime >= times.updateLevel) {
            lastUpdateTime = elapsedTime;
            const levelT = level + (flow - out) / levelConf.ratio
            gameState.level = _between(levelT, levelConf.max, levelConf.min)
            // every 5 sec
            if (Math.floor(elapsedTime) % times.randomFlow === 0) {
                gameState.targetFlow = generateRandomFlowTarget();
            }
            console.log(gameState)
        }

    });

    useEffect(() => {
        console.log(nodes)
        const handleKeyDown = (event: any) => {
            if (event.key === ' ' || event.key === 'a') {
                event.preventDefault();
                gameState.spaceDown = true
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [])

    return (
        <>
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

