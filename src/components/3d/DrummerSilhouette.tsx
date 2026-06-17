"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface DrummerProps {
  scrollProgress?: number;
  visible?: boolean;
}

function createNeonLine(points: [number, number, number][], color: THREE.Color) {
  const geometry = new THREE.BufferGeometry().setFromPoints(
    points.map(([x, y, z]) => new THREE.Vector3(x, y, z))
  );
  const material = new THREE.LineBasicMaterial({
    color,
    linewidth: 2,
    transparent: true,
    opacity: 0.9,
  });
  return new THREE.Line(geometry, material);
}

export default function DrummerSilhouette({ scrollProgress = 0, visible = true }: DrummerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const shockwaveRef = useRef<THREE.Mesh[]>([]);
  const armLRef = useRef<THREE.Group>(null);
  const armRRef = useRef<THREE.Group>(null);

  const orangeColor = useMemo(() => new THREE.Color("#FF5B00"), []);
  const goldColor = useMemo(() => new THREE.Color("#FFD60A"), []);

  // Body lines — drummer seated at kit
  const bodyLines = useMemo(() => {
    const lines: THREE.Line[] = [];
    const c = orangeColor;

    // Head (circle approximation)
    const headPoints: [number, number, number][] = Array.from({ length: 24 }, (_, i) => {
      const a = (i / 24) * Math.PI * 2;
      return [Math.cos(a) * 0.35, 3.5 + Math.sin(a) * 0.35, 0];
    });
    headPoints.push(headPoints[0]);
    lines.push(createNeonLine(headPoints, c));

    // Torso
    lines.push(createNeonLine([[0, 3.15, 0], [0, 1.5, 0]], c));
    // Shoulders
    lines.push(createNeonLine([[-0.9, 2.8, 0], [0.9, 2.8, 0]], c));
    // Hips
    lines.push(createNeonLine([[-0.5, 1.5, 0], [0.5, 1.5, 0]], c));
    // Left leg (seated)
    lines.push(createNeonLine([[-0.4, 1.5, 0], [-0.6, 0.3, 0.5], [-0.4, -0.5, 0.8]], c));
    // Right leg (seated, on kick pedal)
    lines.push(createNeonLine([[0.4, 1.5, 0], [0.7, 0.3, 0.5], [0.5, -0.5, 0.8]], c));

    // Kick drum (circle)
    const kickPoints: [number, number, number][] = Array.from({ length: 32 }, (_, i) => {
      const a = (i / 32) * Math.PI * 2;
      return [Math.cos(a) * 1.1, -0.3 + Math.sin(a) * 0.9, 1.2];
    });
    kickPoints.push(kickPoints[0]);
    lines.push(createNeonLine(kickPoints, goldColor));

    // Snare (small circle to the left)
    const snarePoints: [number, number, number][] = Array.from({ length: 20 }, (_, i) => {
      const a = (i / 20) * Math.PI * 2;
      return [-0.9 + Math.cos(a) * 0.45, 0.6 + Math.sin(a) * 0.12, 0.8];
    });
    snarePoints.push(snarePoints[0]);
    lines.push(createNeonLine(snarePoints, new THREE.Color("#00D4FF")));

    // Hi-hat (top cymbal)
    lines.push(createNeonLine([[-1.4, 2.2, 0.5], [-0.5, 2.2, 0.5]], new THREE.Color("#9D4EDD")));

    // Crash cymbal (right)
    lines.push(createNeonLine([[0.6, 2.5, 0.5], [1.5, 2.5, 0.5]], new THREE.Color("#FFD60A")));

    return lines;
  }, [orangeColor, goldColor]);

  // Shockwave rings
  const shockwaves = useMemo(() => {
    return Array.from({ length: 4 }, (_, i) => {
      const geo = new THREE.RingGeometry(0.1, 0.15, 32);
      const mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color("#FF5B00"),
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
      });
      return new THREE.Mesh(geo, mat);
    });
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    // Fade in based on scroll
    const opacity = Math.min(1, scrollProgress * 3);
    groupRef.current.children.forEach((child) => {
      if (child instanceof THREE.Line) {
        (child.material as THREE.LineBasicMaterial).opacity = opacity * 0.9;
      }
    });

    // Arm animations
    if (armLRef.current) {
      armLRef.current.rotation.z = Math.sin(t * 3) * 0.5;
    }
    if (armRRef.current) {
      armRRef.current.rotation.z = -Math.sin(t * 3 + Math.PI) * 0.5;
    }

    // Shockwave pulse animation
    shockwaveRef.current.forEach((ring, i) => {
      if (!ring) return;
      const phase = (t * 1.5 + i * 0.4) % 2;
      const scale = 1 + phase * 3;
      ring.scale.set(scale, scale, scale);
      (ring.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.7 - phase * 0.4) * opacity;
    });

    // Gentle float
    groupRef.current.position.y = Math.sin(t * 0.5) * 0.1;
    groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.05;
  });

  return (
    <group ref={groupRef} visible={visible} position={[0, -1, 0]}>
      {bodyLines.map((line, i) => (
        <primitive key={i} object={line} />
      ))}

      {/* Shockwave rings at kick drum position */}
      {shockwaves.map((ring, i) => (
        <primitive
          key={`shock-${i}`}
          object={ring}
          ref={(el: THREE.Mesh | null) => {
            if (el) shockwaveRef.current[i] = el;
          }}
          position={[0.3, -0.3, 1.2]}
          rotation={[Math.PI / 2, 0, 0]}
        />
      ))}

      {/* Left arm group */}
      <group ref={armLRef} position={[-0.9, 2.6, 0]}>
        <primitive
          object={createNeonLine(
            [[-0, 0, 0], [-0.6, -0.8, 0], [-0.7, -1.5, 0.3]],
            orangeColor
          )}
        />
      </group>

      {/* Right arm group */}
      <group ref={armRRef} position={[0.9, 2.6, 0]}>
        <primitive
          object={createNeonLine(
            [[0, 0, 0], [0.5, -0.8, 0], [0.4, -1.5, 0.6]],
            orangeColor
          )}
        />
      </group>

      {/* Glow point lights */}
      <pointLight color="#FF5B00" intensity={2} distance={8} position={[0, 1, 1]} />
      <pointLight color="#FFD60A" intensity={1} distance={5} position={[0, -0.3, 1.2]} />
    </group>
  );
}
