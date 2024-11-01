import { useFrame } from '@react-three/fiber';
import { damp } from 'maath/easing';
import useGameStore from '../../state/game.state';
import { Html } from '@react-three/drei';

const Gauges = () => {
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

    return (
        <group>
            <Html>
                {targetFlowGauge}<br/>{flowGauge.toFixed(2)}
            </Html>
        </group>
    );
};

export default Gauges;

