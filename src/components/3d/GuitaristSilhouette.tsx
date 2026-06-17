"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface GuitaristProps {
  scrollProgress?: number;
  visible?: boolean;
}

function neonLine(points: [number, number, number][], color: THREE.Color) {
  const geo = new THREE.BufferGeometry().setFromPoints(
    points.map(([x, y, z]) => new THREE.Vector3(x, y, z))
  );
  return new THREE.Line(geo, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.9 }));
}

export default function GuitaristSilhouette({ scrollProgress = 0, visible = true }: GuitaristProps) {
  const groupRef = useRef<THREE.Group>(null);
  const strumArmRef = useRef<THREE.Group>(null);
  const stringWaveRefs = useRef<THREE.Line[]>([]);

  const gold = useMemo(() => new THREE.Color("#FFD60A"), []);
  const orange = useMemo(() => new THREE.Color("#FF5B00"), []);

  const bodyLines = useMemo(() => {
    const lines: THREE.Line[] = [];

    // Head
    const head: [number, number, number][] = Array.from({ length: 24 }, (_, i) => {
      const a = (i / 24) * Math.PI * 2;
      return [Math.cos(a) * 0.3, 4.0 + Math.sin(a) * 0.3, 0];
    });
    head.push(head[0]);
    lines.push(neonLine(head, gold));

    // Torso (slight lean forward)
    lines.push(neonLine([[0, 3.7, 0], [0.1, 1.5, 0]], gold));
    lines.push(neonLine([[-0.85, 3.2, 0], [0.85, 3.2, 0]], gold));

    // Legs (standing)
    lines.push(neonLine([[-0.35, 1.5, 0], [-0.45, 0, 0], [-0.5, -1.8, 0]], gold));
    lines.push(neonLine([[0.35, 1.5, 0], [0.45, 0, 0], [0.5, -1.8, 0]], gold));

    // Guitar body (figure-8 outline)
    const guitarTop: [number, number, number][] = Array.from({ length: 20 }, (_, i) => {
      const a = (i / 20) * Math.PI * 2;
      return [-0.1 + Math.cos(a) * 0.55, 1.8 + Math.sin(a) * 0.45, 0.4];
    });
    guitarTop.push(guitarTop[0]);
    lines.push(neonLine(guitarTop, orange));

    const guitarBottom: [number, number, number][] = Array.from({ length: 24 }, (_, i) => {
      const a = (i / 24) * Math.PI * 2;
      return [-0.1 + Math.cos(a) * 0.65, 0.9 + Math.sin(a) * 0.55, 0.4];
    });
    guitarBottom.push(guitarBottom[0]);
    lines.push(neonLine(guitarBottom, orange));

    // Sound hole
    const soundHole: [number, number, number][] = Array.from({ length: 16 }, (_, i) => {
      const a = (i / 16) * Math.PI * 2;
      return [-0.1 + Math.cos(a) * 0.2, 1.35 + Math.sin(a) * 0.2, 0.42];
    });
    soundHole.push(soundHole[0]);
    lines.push(neonLine(soundHole, new THREE.Color("#9D4EDD")));

    // Neck (going up to the left)
    lines.push(neonLine([[-0.1, 2.25, 0.4], [-0.3, 3.5, 0.2], [-0.4, 4.0, 0.1]], orange));

    // 6 Guitar strings
    for (let s = 0; s < 6; s++) {
      const sx = -0.28 + s * 0.08;
      lines.push(neonLine([[sx, 2.25, 0.42], [sx + 0.08, 0.35, 0.42]], new THREE.Color("#FFD60A")));
    }

    return lines;
  }, [gold, orange]);

  // Frequency wave fans from guitar body
  const stringWaves = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => {
      const wavePoints: [number, number, number][] = Array.from({ length: 24 }, (_, j) => {
        const angle = ((j / 24) - 0.5) * Math.PI * 0.8;
        const r = 1.2 + i * 0.5;
        return [-0.1 + Math.cos(angle) * r, 1.35, 0.4 + Math.sin(angle) * r * 0.3];
      });
      return neonLine(wavePoints, new THREE.Color("#FFD60A"));
    });
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const opacity = Math.min(1, scrollProgress * 3);

    groupRef.current.children.forEach((child) => {
      if (child instanceof THREE.Line) {
        (child.material as THREE.LineBasicMaterial).opacity = opacity * 0.9;
      }
    });

    // Strum arm swing
    if (strumArmRef.current) {
      strumArmRef.current.rotation.z = Math.sin(t * 2.5) * 0.35;
    }

    // Animate string frequency waves
    stringWaveRefs.current.forEach((wave, i) => {
      if (!wave) return;
      const positions = wave.geometry.attributes.position as THREE.BufferAttribute;
      for (let j = 0; j < 24; j++) {
        const angle = ((j / 24) - 0.5) * Math.PI * 0.8;
        const r = 1.2 + i * 0.5;
        const wobble = Math.sin(t * 4 + j * 0.4 + i * 0.7) * 0.05;
        positions.setXYZ(
          j,
          -0.1 + Math.cos(angle) * (r + wobble),
          1.35 + wobble,
          0.4 + Math.sin(angle) * (r + wobble) * 0.3
        );
      }
      positions.needsUpdate = true;
      (wave.material as THREE.LineBasicMaterial).opacity =
        Math.max(0, 0.6 - i * 0.07) * opacity;
    });

    groupRef.current.position.y = Math.sin(t * 0.5) * 0.1;
    groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.08;
  });

  return (
    <group ref={groupRef} visible={visible} position={[0, -2, 0]}>
      {bodyLines.map((line, i) => (
        <primitive key={i} object={line} />
      ))}

      {/* Frequency waves */}
      {stringWaves.map((wave, i) => (
        <primitive
          key={`swave-${i}`}
          object={wave}
          ref={(el: THREE.Line | null) => {
            if (el) stringWaveRefs.current[i] = el;
          }}
        />
      ))}

      {/* Strum arm */}
      <group ref={strumArmRef} position={[0.85, 3.0, 0]}>
        <primitive object={neonLine([[0, 0, 0], [0.4, -0.6, 0.2], [0.2, -1.2, 0.4]], gold)} />
      </group>

      <pointLight color="#FFD60A" intensity={2} distance={8} position={[-0.1, 1.35, 1]} />
      <pointLight color="#FF5B00" intensity={1.5} distance={6} position={[0, 2, 0.5]} />
    </group>
  );
}
