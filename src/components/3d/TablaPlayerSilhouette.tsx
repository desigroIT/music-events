"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface TablaPlayerProps {
  scrollProgress?: number;
  visible?: boolean;
}

function neonLine(points: [number, number, number][], color: THREE.Color) {
  const geo = new THREE.BufferGeometry().setFromPoints(
    points.map(([x, y, z]) => new THREE.Vector3(x, y, z))
  );
  return new THREE.Line(geo, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.9 }));
}

export default function TablaPlayerSilhouette({ scrollProgress = 0, visible = true }: TablaPlayerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const leftHandRef = useRef<THREE.Group>(null);
  const rightHandRef = useRef<THREE.Group>(null);
  const rippleRefs = useRef<THREE.Mesh[]>([]);

  const purple = useMemo(() => new THREE.Color("#9D4EDD"), []);
  const blue = useMemo(() => new THREE.Color("#00D4FF"), []);
  const gold = useMemo(() => new THREE.Color("#FFD60A"), []);

  const bodyLines = useMemo(() => {
    const lines: THREE.Line[] = [];

    // Head
    const head: [number, number, number][] = Array.from({ length: 24 }, (_, i) => {
      const a = (i / 24) * Math.PI * 2;
      return [Math.cos(a) * 0.3, 3.4 + Math.sin(a) * 0.3, 0];
    });
    head.push(head[0]);
    lines.push(neonLine(head, purple));

    // Torso
    lines.push(neonLine([[0, 3.1, 0], [0, 0.8, 0]], purple));
    lines.push(neonLine([[-0.85, 2.7, 0], [0.85, 2.7, 0]], purple));

    // Cross-legged: left leg
    lines.push(neonLine([[-0.4, 0.8, 0], [-1.1, 0.2, 0.3], [-0.8, -0.3, 0.8], [0, -0.3, 1.0]], purple));
    // Right leg
    lines.push(neonLine([[0.4, 0.8, 0], [1.1, 0.2, 0.3], [0.8, -0.3, 0.8], [0, -0.3, 1.0]], purple));

    // Left Tabla (bayan - larger)
    const bayaPoints: [number, number, number][] = Array.from({ length: 28 }, (_, i) => {
      const a = (i / 28) * Math.PI * 2;
      return [-0.55 + Math.cos(a) * 0.42, 0 + Math.sin(a) * 0.18, 1.05];
    });
    bayaPoints.push(bayaPoints[0]);
    lines.push(neonLine(bayaPoints, gold));

    // Left Tabla body
    lines.push(neonLine([[-0.55, -0.18, 1.05], [-0.55, -0.7, 1.05]], gold));
    const bayaBottom: [number, number, number][] = Array.from({ length: 28 }, (_, i) => {
      const a = (i / 28) * Math.PI * 2;
      return [-0.55 + Math.cos(a) * 0.3, -0.7 + Math.sin(a) * 0.14, 1.05];
    });
    bayaBottom.push(bayaBottom[0]);
    lines.push(neonLine(bayaBottom, gold));

    // Right Tabla (dayan - smaller)
    const dayanPoints: [number, number, number][] = Array.from({ length: 28 }, (_, i) => {
      const a = (i / 28) * Math.PI * 2;
      return [0.55 + Math.cos(a) * 0.3, 0 + Math.sin(a) * 0.14, 1.05];
    });
    dayanPoints.push(dayanPoints[0]);
    lines.push(neonLine(dayanPoints, new THREE.Color("#FF5B00")));

    lines.push(neonLine([[0.55, -0.14, 1.05], [0.55, -0.55, 1.05]], new THREE.Color("#FF5B00")));
    const dayanBottom: [number, number, number][] = Array.from({ length: 24 }, (_, i) => {
      const a = (i / 24) * Math.PI * 2;
      return [0.55 + Math.cos(a) * 0.22, -0.55 + Math.sin(a) * 0.1, 1.05];
    });
    dayanBottom.push(dayanBottom[0]);
    lines.push(neonLine(dayanBottom, new THREE.Color("#FF5B00")));

    return lines;
  }, [purple, blue, gold]);

  // Ripple rings
  const ripples = useMemo(() => {
    return Array.from({ length: 6 }, () => {
      const geo = new THREE.RingGeometry(0.05, 0.08, 32);
      const mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color("#9D4EDD"),
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
    const opacity = Math.min(1, scrollProgress * 3);

    groupRef.current.children.forEach((child) => {
      if (child instanceof THREE.Line) {
        (child.material as THREE.LineBasicMaterial).opacity = opacity * 0.9;
      }
    });

    // Alternating hand taps
    if (leftHandRef.current) {
      leftHandRef.current.position.y = Math.sin(t * 4) * 0.15;
    }
    if (rightHandRef.current) {
      rightHandRef.current.position.y = Math.sin(t * 4 + Math.PI) * 0.15;
    }

    // Ripple expand and fade
    rippleRefs.current.forEach((ring, i) => {
      if (!ring) return;
      const side = i < 3 ? -1 : 1;
      const phase = (t * 2 + i * 0.5) % 2;
      const scale = 1 + phase * 4;
      ring.scale.set(scale, scale, scale);
      ring.position.x = side * 0.55;
      (ring.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.8 - phase * 0.45) * opacity;
    });

    groupRef.current.position.y = Math.sin(t * 0.3) * 0.08;
    groupRef.current.rotation.y = Math.sin(t * 0.1) * 0.06;
  });

  return (
    <group ref={groupRef} visible={visible} position={[0, -1, 0]}>
      {bodyLines.map((line, i) => (
        <primitive key={i} object={line} />
      ))}

      {/* Ripples on tabla heads */}
      {ripples.map((ring, i) => (
        <primitive
          key={`ripple-${i}`}
          object={ring}
          ref={(el: THREE.Mesh | null) => {
            if (el) rippleRefs.current[i] = el;
          }}
          position={[i < 3 ? -0.55 : 0.55, 0, 1.08]}
          rotation={[Math.PI / 2, 0, 0]}
        />
      ))}

      {/* Left hand */}
      <group ref={leftHandRef} position={[-0.55, 0.3, 0.9]}>
        <primitive object={neonLine([[-0.15, 0, 0], [0.15, 0, 0], [0, -0.25, 0.1]], purple)} />
      </group>

      {/* Right hand */}
      <group ref={rightHandRef} position={[0.55, 0.3, 0.9]}>
        <primitive object={neonLine([[-0.12, 0, 0], [0.12, 0, 0], [0, -0.2, 0.1]], new THREE.Color("#FF5B00"))} />
      </group>

      <pointLight color="#9D4EDD" intensity={2.5} distance={8} position={[0, 0, 1.5]} />
      <pointLight color="#FFD60A" intensity={1} distance={5} position={[-0.55, 0, 1.2]} />
      <pointLight color="#FF5B00" intensity={1} distance={5} position={[0.55, 0, 1.2]} />
    </group>
  );
}
