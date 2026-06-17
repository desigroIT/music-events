"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ViolinistProps {
  scrollProgress?: number;
  visible?: boolean;
}

function neonLine(points: [number, number, number][], color: THREE.Color) {
  const geo = new THREE.BufferGeometry().setFromPoints(
    points.map(([x, y, z]) => new THREE.Vector3(x, y, z))
  );
  return new THREE.Line(geo, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.9 }));
}

export default function ViolinistSilhouette({ scrollProgress = 0, visible = true }: ViolinistProps) {
  const groupRef = useRef<THREE.Group>(null);
  const bowArmRef = useRef<THREE.Group>(null);
  const waveRefs = useRef<THREE.Line[]>([]);

  const blue = useMemo(() => new THREE.Color("#00D4FF"), []);
  const purple = useMemo(() => new THREE.Color("#9D4EDD"), []);

  const bodyLines = useMemo(() => {
    const lines: THREE.Line[] = [];

    // Head
    const head: [number, number, number][] = Array.from({ length: 24 }, (_, i) => {
      const a = (i / 24) * Math.PI * 2;
      return [Math.cos(a) * 0.32, 3.8 + Math.sin(a) * 0.32, 0];
    });
    head.push(head[0]);
    lines.push(neonLine(head, blue));

    // Torso
    lines.push(neonLine([[0, 3.48, 0], [0, 1.2, 0]], blue));
    // Shoulders
    lines.push(neonLine([[-0.9, 3.0, 0], [0.9, 3.0, 0]], blue));
    // Left leg
    lines.push(neonLine([[-0.35, 1.2, 0], [-0.4, 0, 0], [-0.4, -1.5, 0]], blue));
    // Right leg
    lines.push(neonLine([[0.35, 1.2, 0], [0.4, 0, 0], [0.4, -1.5, 0]], blue));

    // Violin body (tilted)
    const violinBody: [number, number, number][] = [
      [-0.2, 2.2, 0], [-0.45, 2.0, 0], [-0.5, 1.7, 0],
      [-0.35, 1.5, 0], [-0.45, 1.3, 0], [-0.4, 1.1, 0],
      [-0.2, 1.0, 0], [0, 1.1, 0], [0.05, 1.3, 0],
      [-0.05, 1.5, 0], [0.1, 1.7, 0], [0.05, 2.0, 0],
      [-0.2, 2.2, 0],
    ];
    lines.push(neonLine(violinBody, purple));

    // Violin neck
    lines.push(neonLine([[-0.2, 2.2, 0], [-0.1, 2.7, 0], [0.1, 2.9, 0]], purple));

    // Bow (right side)
    lines.push(neonLine([[0.9, 2.9, 0], [0.8, 1.8, 0.1]], new THREE.Color("#FFD60A")));

    // Strings (glowing)
    for (let i = 0; i < 4; i++) {
      const x = -0.32 + i * 0.08;
      lines.push(neonLine([[x, 2.15, 0.02], [x, 1.05, 0.02]], new THREE.Color("#FFD60A")));
    }

    return lines;
  }, [blue, purple]);

  // Frequency wave lines
  const frequencyWaves = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const wavePoints: [number, number, number][] = Array.from({ length: 20 }, (_, j) => {
        const x = j * 0.2 - 0.5;
        return [x, 1.6, 0];
      });
      return neonLine(wavePoints, new THREE.Color("#00D4FF"));
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

    // Bow arm oscillation
    if (bowArmRef.current) {
      bowArmRef.current.rotation.z = Math.sin(t * 2) * 0.4;
    }

    // Animate frequency waves
    waveRefs.current.forEach((wave, i) => {
      if (!wave) return;
      const positions = wave.geometry.attributes.position as THREE.BufferAttribute;
      for (let j = 0; j < 20; j++) {
        const x = j * 0.2 - 0.5;
        const radius = 1.5 + i * 0.8;
        const angle = (j / 20) * Math.PI * 2;
        positions.setXYZ(
          j,
          Math.cos(angle) * radius,
          1.6 + Math.sin(t * 3 + j * 0.5 + i * 0.8) * (0.1 + i * 0.05),
          Math.sin(angle) * radius
        );
      }
      positions.needsUpdate = true;
      (wave.material as THREE.LineBasicMaterial).opacity =
        Math.max(0, 0.7 - i * 0.1) * opacity;
    });

    groupRef.current.position.y = Math.sin(t * 0.4) * 0.08;
    groupRef.current.rotation.y = Math.sin(t * 0.15) * 0.1;
  });

  return (
    <group ref={groupRef} visible={visible} position={[0, -1.5, 0]}>
      {bodyLines.map((line, i) => (
        <primitive key={i} object={line} />
      ))}
      {frequencyWaves.map((wave, i) => (
        <primitive
          key={`wave-${i}`}
          object={wave}
          ref={(el: THREE.Line | null) => {
            if (el) waveRefs.current[i] = el;
          }}
        />
      ))}
      <pointLight color="#00D4FF" intensity={2} distance={8} position={[-0.3, 1.5, 1]} />
      <pointLight color="#9D4EDD" intensity={1.5} distance={6} position={[0.5, 2.0, 0]} />
    </group>
  );
}
