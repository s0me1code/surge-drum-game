import * as THREE from 'three'
import { ThreeElements } from "@react-three/fiber"
import { useRef } from "react"

export function _(props: React.PropsWithChildren<ThreeElements['group']>) {
    const groupRef = useRef<THREE.Group>(null!);

    return (
        <group {...props} ref={groupRef}>
            <mesh>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color={'#2f74c0'} />
            </mesh>
            {props.children}
        </group>
    );
}
