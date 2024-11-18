import * as THREE from 'three'
import { MeshProps, useFrame } from '@react-three/fiber';
import { damp } from 'maath/easing';
import { Line, LineProps, Text, useGLTF } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import { GLTF, Line2 } from 'three-stdlib'
import '../../App.css'
import { _between } from '../../utils/_';
import useGameStore, { ILostReasons } from '../../state/game.state';

type GLTFResult = GLTF & {
    nodes: {
        digitalIn: THREE.Mesh
        digitalOut: THREE.Mesh
        level: THREE.Mesh
        levelMeasures: THREE.Mesh
        cyclic: THREE.Mesh
        cyclicMesures: THREE.Mesh
        temp: THREE.Mesh
        tempMeasures: THREE.Mesh
    }
    materials: {}
}

const Gauges = (props: JSX.IntrinsicElements['group']) => {
    /**
     * GLTF
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
    const blueishList = ['level', 'cyclic', 'temp']
    scene.traverse((child: any) => {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.isMesh) {
            blueishList.includes(child.name) ?
                child.material = blueishM :
                child.name.includes('digital') ?
                    child.material = blackM :
                    child.material = _material
        }
    });

    /**
     * Config
     * */
    // GaugesConf
    const flowConf = { max: 300, min: 0, deltaRate: .4 }
    const levelConf = { max: 100, min: 0, ratio: 20 }
    const levelScaleConf = { max: 1, min: 0, deltaRate: .5 }
    const outConf = { max: 200, min: 0, increaseRate: 10, deltaRate: .2, onPressEffect: .1 }
    const pressureConf = { max: 400, min: 0, ratio: .05 }
    const pressureRotationConf = { max: 2 * Math.PI, min: 0, deltaRate: .5 }
    type IGenerateP = { level: number, flow: number, temp: number }
    const generatePressureRatios: IGenerateP = { level: 1.8, flow: .5, temp: 3 }
    const tempConf = { max: 50, min: 20, deltaRate: .5 }
    const tempScaleConf = { max: 1, min: 0, deltaRate: .5 }
    // useFrameConf
    const times = { every1: 1, every5: 5, every15: 15 }
    const motion = { smooth: .5 }
    // visualsConf
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
    const levelCapConf = {
        max:
            nodes.levelMeasures.geometry.boundingBox ? nodes.levelMeasures.geometry.boundingBox.max.y : 0,
        min: 0,
    }
    const _levelCapProps: LineProps = {
        points: [
            [0, 0, .1],
            [1, 0, .1],
        ],
        color: "red",
        lineWidth: 2,
        dashed: false,
    }
    const levelCapProps: { top: LineProps, bottom: LineProps } = {
        top: {
            ..._levelCapProps,
            position: nodes.levelMeasures.geometry.boundingBox ?
                //[0, nodes.levelMeasures.geometry.boundingBox.max.y, 0]
                [0, 12, 0]
                : [0, 0, 0]
        },
        bottom: {
            ..._levelCapProps,
            position: nodes.levelMeasures.geometry.boundingBox ?
                [0, nodes.levelMeasures.geometry.boundingBox.min.y, 0]
                : [0, 0, 0]
        },
    }
    // lossConf
    const lossConditions = {
        pressure: 340,
        level: 10,
        timeOver: 6,
        onPressEffectRatio: .02,
    }
    const gameStartedElapsedTime = 8
    // socre
    let flowVariances = 1

    /**
     * Ref
     * */
    const levelRef = useRef<THREE.Mesh>(null)
    const pressureRef = useRef<THREE.Mesh>(null)
    const digitalInTextRef = useRef<THREE.Mesh>(null)
    const digitalOutTextRef = useRef<THREE.Mesh>(null)
    const pressureTextRef = useRef<THREE.Mesh>(null)
    const tempRef = useRef<THREE.Mesh>(null)
    const tempTextRef = useRef<THREE.Mesh>(null)
    const levelCapTopRef = useRef<Line2>(null)
    const levelCapBottomRef = useRef<Line2>(null)
    const lossConditionsTextRef = useRef<THREE.Mesh>(null)

    /**
     * Use Frame
     * */
    // GameStateInitials
    let { lost, setLost, setScore } = useGameStore()
    let gameState = {
        flow: 0,
        targetFlow: 0,
        level: 0,
        out: 0,
        pressure: 0,
        targetPressure: 0,
        temp: 0,
        spaceDown: false,
        levelCapTop: levelConf.max,
        levelCapBottom: levelConf.min,
    }
    const generateRandomFlowTarget = () => Math.floor(Math.random() * flowConf.max)
    const calculatePressureTarget = ({ level, flow, temp }: typeof generatePressureRatios) =>
        _between((generatePressureRatios.level * level + generatePressureRatios.flow * flow + generatePressureRatios.temp * temp), pressureConf.max, pressureConf.min)
    const generateRandomTemp = () => tempConf.min + Math.floor(Math.random() * (tempConf.max - tempConf.min))
    const calculateLevelCapTop = ({ targetFlow, temp }: { [key: string]: number }) =>
        ((lossConditions.pressure - generatePressureRatios.flow * targetFlow - generatePressureRatios.temp * temp) / generatePressureRatios.level)
    const convertLevelToYPoint = (level: number, maxLevel: number, maxY: number) => _between((level * maxY * 1 / maxLevel), levelCapConf.max, levelCapConf.min)
    // UseFrameIintials
    let lastUpdateTime = 0;
    let init = true;
    useFrame((state, delta) => {
        const elapsedTime = state.clock.elapsedTime
        let {
            flow,
            out,
            targetFlow,
            spaceDown,
            level,
            pressure,
            targetPressure,
            temp,
            levelCapTop,
        } = gameState
        if (elapsedTime > gameStartedElapsedTime && lost) {
            return
        }
        // lossCondition
        if (elapsedTime > gameStartedElapsedTime &&
            (
                pressure >= lossConditions.pressure ||
                (levelRef.current && levelRef.current.scale.y < lossConditions.level / levelConf.max)
            )
        ) {
            const lostResoan =
                pressure >= lossConditions.pressure ?
                    ILostReasons.HP : ILostReasons.LL
            setLost(true)
            setScore({
                lostResoan,
                gauges: { flow: targetFlow, pressure: targetPressure, level, temp, out },
                elapsedTime,
                flowVariances
            })
            console.log({
                lost,
                elapsedTime,
                flowVariances,
            })
            return
        }

        /**
         * Visuals
         * */
        levelRef && levelRef.current &&
            damp(levelRef.current.scale, "y", _between(level / levelConf.max, levelScaleConf.max, levelScaleConf.min), motion.smooth, delta * levelScaleConf.deltaRate);
        if (digitalInTextRef.current)
            (digitalInTextRef.current as any).text = String(targetFlow.toFixed(0)).padStart(3, '0');
        if (digitalOutTextRef.current)
            (digitalOutTextRef.current as any).text = String(out.toFixed(0)).padStart(3, '0');
        pressureRef && pressureRef.current &&
            damp(pressureRef.current.rotation, "z", _between((pressure / pressureConf.max) * 2 * Math.PI, pressureRotationConf.max, pressureRotationConf.min), motion.smooth, delta * pressureRotationConf.deltaRate);
        if (pressureTextRef.current)
            (pressureTextRef.current as any).text = String(targetPressure.toFixed(0)).padStart(3, '0');
        tempRef && tempRef.current &&
            damp(tempRef.current.scale, "y", _between(temp / tempConf.max, tempScaleConf.max, tempScaleConf.min), motion.smooth, delta * tempScaleConf.deltaRate);
        if (tempTextRef.current)
            (tempTextRef.current as any).text = String(temp.toFixed(0)).padStart(2, '0');
        const levelAsYPoint = convertLevelToYPoint(levelCapTop, levelConf.max, levelCapConf.max)
        levelCapTopRef.current &&
            damp(levelCapTopRef.current.position, "y", levelAsYPoint, motion.smooth, delta * levelScaleConf.deltaRate)

        /**
         * Update State
         * */
        damp(gameState, "flow", targetFlow, motion.smooth, delta * flowConf.deltaRate);
        damp(gameState, "pressure", targetPressure, motion.smooth, delta * flowConf.deltaRate);
        damp(gameState, "out", 0, motion.smooth, delta * outConf.deltaRate);
        elapsedTime > lossConditions.timeOver &&
            damp(outConf, "onPressEffect", 0, motion.smooth, delta * lossConditions.onPressEffectRatio)
        // one time
        if (init) {
            gameState.targetFlow = generateRandomFlowTarget();
            gameState.targetPressure = calculatePressureTarget({ level, flow, temp });
            gameState.temp = generateRandomTemp()
            init = false
        }
        if (spaceDown) {
            gameState.out = Math.min(outConf.max, out + outConf.increaseRate)
            gameState.spaceDown = false
            const levelT = level + - (out / levelConf.ratio) * outConf.onPressEffect
            gameState.level = _between(levelT, levelConf.max, levelConf.min)
        }
        // every 1 sec
        if (elapsedTime - lastUpdateTime >= times.every1) {
            lastUpdateTime = elapsedTime;
            const levelT = level + (flow - out) / levelConf.ratio
            gameState.level = _between(levelT, levelConf.max, levelConf.min)
            gameState.levelCapTop = calculateLevelCapTop({ targetFlow, temp })
            // every 5 sec
            if (Math.floor(elapsedTime) % times.every5 === 0) {
                const newFlow = generateRandomFlowTarget();
                flowVariances += Math.abs(targetFlow - newFlow)
                gameState.targetFlow = newFlow;
                gameState.targetPressure = calculatePressureTarget({ level, flow, temp });
            }
            // every 15 sec
            if (Math.floor(elapsedTime) % times.every15 === 0) {
                gameState.temp = generateRandomTemp()
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
                    position={[15.987, 21.217, -12.511]}
                    scale={1.2}
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
                    position={[-9.482, 1.528, 1.196]}
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
                    position={[12.719, 1.369, 0.761]}
                />
                <mesh
                    geometry={nodes.levelMeasures.geometry}
                    material={nodes.levelMeasures.material}
                    position={[12.282, 1.358, 0.758]}
                >
                    <Line
                        {...levelCapProps.top}
                        ref={levelCapTopRef}
                    />
                    <Line
                        {...levelCapProps.bottom}
                        position={[0, convertLevelToYPoint(lossConditions.level, levelConf.max, levelCapConf.max), 0]}
                        ref={levelCapBottomRef}
                    />
                </mesh>
                <mesh
                    ref={pressureRef}
                    geometry={nodes.cyclic.geometry}
                    material={nodes.cyclic.material}
                    position={[1.856, 14.852, -6.101]}
                    rotation={[Math.PI, 0, 0]}
                />
                <mesh
                    geometry={nodes.cyclicMesures.geometry}
                    material={nodes.cyclicMesures.material}
                    position={[1.856, 14.843, -6.213]}
                >
                    <Text
                        {...textProps}
                        position={[0, 1.3, 1]}
                        ref={pressureTextRef}
                        children={""}
                    />
                </mesh>
                <mesh
                    ref={tempRef}
                    geometry={nodes.temp.geometry}
                    material={nodes.temp.material}
                    position={[-10.772, 4.55, 0.903]}
                >
                </mesh>
                <Text
                    {...textProps}
                    position={[-10.772, 4.55, 0.903 + 1]}
                    ref={tempTextRef}
                    children={""}
                />
                <Text
                    {...textProps}
                    ref={lossConditionsTextRef}
                    children={""}
                />
            </group>
        </>
    );
};

useGLTF.preload('./models/gauges.glb')
export default Gauges;

