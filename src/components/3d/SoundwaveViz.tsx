"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function SoundwaveViz() {
  const groupRef = useRef<THREE.Group>(null);
  const barsRef = useRef<THREE.Mesh[]>([]);
  const barCount = 64;

  const bars = useMemo(() => {
    return Array.from({ length: barCount }, (_, i) => {
      const angle = (i / barCount) * Math.PI * 2;
      const radius = 4;
      return {
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        angle,
        speed: 0.5 + Math.random() * 2,
        phase: Math.random() * Math.PI * 2,
      };
    });
  }, []);

  const color = new THREE.Color("#FF5B00");

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    barsRef.current.forEach((bar, i) => {
      if (!bar) return;
      const h = 0.3 + Math.abs(Math.sin(t * bars[i].speed + bars[i].phase)) * 2.5;
      bar.scale.y = h;
      bar.position.y = h / 2;

      // Cycle colors
      const hue = (t * 30 + i * 3) % 360;
      (bar.material as THREE.MeshStandardMaterial).emissive.setHSL(hue / 360, 1, 0.5);
      (bar.material as THREE.MeshStandardMaterial).color.setHSL(hue / 360, 1, 0.6);
    });

    groupRef.current.rotation.y = t * 0.15;
  });

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {bars.map((bar, i) => (
        <mesh
          key={i}
          position={[bar.x, 0.5, bar.z]}
          ref={(el) => {
            if (el) barsRef.current[i] = el;
          }}
        >
          <boxGeometry args={[0.08, 1, 0.08]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}
