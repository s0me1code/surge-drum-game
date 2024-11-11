import { useGLTF } from '@react-three/drei';
import * as THREE from 'three'

export const Model = () => {
    const { scene, nodes } = useGLTF('./models/scene.glb');
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
    return <primitive object={nodes.Scene} scale={0.5} position={[0, 0, 0]} />;
};

