import * as THREE from 'three'
import { MeshProps, useFrame } from '@react-three/fiber';
import { damp } from 'maath/easing';
import { Text, useGLTF } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import { GLTF } from 'three-stdlib'
import '../../App.css'
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
    const _material = new THREE.MeshStandardMaterial({
        roughness: 0.5,
        metalness: 0.5,
    });
    const blueishM = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0xADD8E6),
        roughness: 0.5,
        metalness: 0.5,
    });
    const blackM = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0x003300),
        roughness: 0.5,
        metalness: 0.5,
    });
    const { scene, nodes } = useGLTF('./models/gauges.glb') as GLTFResult;
    // Apply a standard material to ensure it's affected by light
    scene.traverse((child: any) => {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.isMesh) {
            child.name == 'level' || child.name == 'cyclic' ?
                child.material = blueishM :
                child.name.includes('digital') ?
                    child.material = blackM :
                    child.material = _material
        }
    });

    /**
     * Config
     * */
    const flowConf = { max: 300, min: 0, deltaRate: .4 }
    const levelConf = { max: 100, min: 0, ratio: .05 }
    const levelScaleConf = { max: 100, min: 0, deltaRate: .5 }
    const outConf = { max: 200, min: 0, increaseRate: 10, deltaRate: .2, onPressEffect: .05 }
    const times = { updateLevel: 1, randomFlow: 5 }
    const motion = { smooth: .5 }
    const textProps: MeshProps & { [key: string]: any } = {
        scale: [1 / 4, 1 / 2, 1],
        position: [0, -0.03, .01],
        font: '/WebPlus_IBM_BIOS.woff',
        color: "#33FF33",
        fontSize: 1,
        letterSpacing: -0.05,
        lineHeight: 1,
        'material-toneMapped': false
    }

    /**
     * Ref
     * */
    const levelRef = useRef<THREE.Mesh>(null)
    const cyclicRef = useRef<THREE.Mesh>(null)
    const digitalInTextRef = useRef<THREE.Mesh>(null)
    const digitalOutTextRef = useRef<THREE.Mesh>(null)

    /**
     * Use Frame
     * */
    // GameStateInitials
    let gameState = {
        flow: 0,
        targetFlow: 0,
        level: 0,
        out: 0,
        pressure: 0,
        temp: 0,
        spaceDown: false
    }
    const generateRandomFlowTarget = () => Math.floor(Math.random() * flowConf.max)
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
         * Visuals
         * */
        levelRef && levelRef.current &&
            damp(levelRef.current.scale, "y", _between(level / levelConf.max, levelScaleConf.max, levelScaleConf.min), motion.smooth, delta * levelScaleConf.deltaRate);
        if (digitalInTextRef.current)
            (digitalInTextRef.current as any).text = String(targetFlow.toFixed(0)).padStart(3, '0');
        if (digitalOutTextRef.current)
            (digitalOutTextRef.current as any).text = String(out.toFixed(0)).padStart(3, '0');


        /**
         * Update State
         * */
        damp(gameState, "flow", targetFlow, motion.smooth, delta * flowConf.deltaRate);
        damp(gameState, "out", 0, motion.smooth, delta * outConf.deltaRate);
        // one time
        if (spaceDown) {
            gameState.out = Math.min(outConf.max, out + outConf.increaseRate)
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
        }

    });

    useEffect(() => {
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
                    position={[10.984, 16.551, -7.627]}
                >
                    <Text
                        {...textProps}
                        ref={digitalInTextRef}
                        children={""}
                    />
                </mesh>
                <mesh
                    geometry={nodes.digitalOut.geometry}
                    material={nodes.digitalOut.material}
                    position={[-6.899, 1.505, -7.583]}
                >
                    <Text
                        {...textProps}
                        ref={digitalOutTextRef}
                        children={""}
                    />
                </mesh>
                <mesh
                    ref={levelRef}
                    geometry={nodes.level.geometry}
                    material={nodes.level.material}
                    scale={[1, 0, 1]}
                    position={[12.907, 0.474, -7.875]}
                />
                <mesh
                    geometry={nodes.levelMeasures.geometry}
                    material={nodes.levelMeasures.material}
                    position={[12.469, 6.231, -7.879]}
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
                    position={[1.856, 14.568, -8.746]}
                />
            </group>
        </>
    );
};

useGLTF.preload('./models/gauges.glb')
export default Gauges;

