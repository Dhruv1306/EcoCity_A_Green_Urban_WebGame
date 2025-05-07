import { Environment, OrbitControls } from '@react-three/drei';
import { useControls } from 'leva';

export default function Lighting() {
  const { ambientIntensity, directionalIntensity } = useControls({
    ambientIntensity: { value: 0.5, min: 0, max: 1, step: 0.1 },
    directionalIntensity: { value: 1, min: 0, max: 2, step: 0.1 }
  });

  return (
    <>
      <ambientLight intensity={ambientIntensity} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={directionalIntensity}
        castShadow
      />
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={10}
        maxDistance={200}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
      />
      <Environment preset="sunset" />
    </>
  );
} 