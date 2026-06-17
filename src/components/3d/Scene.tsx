"use client";
import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";

import * as THREE from "three";
import ParticleField from "./ParticleField";
import SoundwaveViz from "./SoundwaveViz";
import DrummerSilhouette from "./DrummerSilhouette";
import ViolinistSilhouette from "./ViolinistSilhouette";
import TablaPlayerSilhouette from "./TablaPlayerSilhouette";
import GuitaristSilhouette from "./GuitaristSilhouette";

interface SceneProps {
  scrollProgress: number;
  currentAct: number;
}

function CameraRig({ scrollProgress }: { scrollProgress: number }) {
  const camRef = useRef<THREE.PerspectiveCamera>(null);

  useFrame((state) => {
    if (!camRef.current) return;
    const mx = state.pointer.x * 0.5;
    const my = state.pointer.y * 0.3;
    camRef.current.position.x += (mx - camRef.current.position.x) * 0.05;
    camRef.current.position.y += (my + 1 - camRef.current.position.y) * 0.05;
    const targetZ = 12 - scrollProgress * 4;
    camRef.current.position.z += (targetZ - camRef.current.position.z) * 0.03;
    camRef.current.lookAt(0, 0, 0);
  });

  return <PerspectiveCamera ref={camRef} makeDefault position={[0, 1, 12]} fov={60} />;
}

function SceneContents({ scrollProgress, currentAct }: SceneProps) {
  const drummerVisible = currentAct >= 2 && currentAct <= 3;
  const violinVisible = currentAct === 4;
  const tablaVisible = currentAct === 5;
  const guitarVisible = currentAct === 6;
  const allVisible = currentAct === 7;

  const positions: [number, number, number][] = [
    [-4.5, 0, 0],
    [-1.5, 0, 0],
    [1.5, 0, 0],
    [4.5, 0, 0],
  ];

  return (
    <>
      <CameraRig scrollProgress={scrollProgress} />
      <ambientLight color="#050510" intensity={0.5} />
      <fog attach="fog" args={["#050505", 15, 40]} />

      <ParticleField count={3000} />

      {currentAct === 1 && <SoundwaveViz />}

      {(drummerVisible || allVisible) && (
        <group position={allVisible ? positions[0] : [0, 0, 0]}>
          <DrummerSilhouette
            scrollProgress={drummerVisible ? scrollProgress * 5 : 1}
            visible
          />
        </group>
      )}

      {(violinVisible || allVisible) && (
        <group position={allVisible ? positions[1] : [0, 0, 0]}>
          <ViolinistSilhouette
            scrollProgress={violinVisible ? scrollProgress * 5 : 1}
            visible
          />
        </group>
      )}

      {(tablaVisible || allVisible) && (
        <group position={allVisible ? positions[2] : [0, 0, 0]}>
          <TablaPlayerSilhouette
            scrollProgress={tablaVisible ? scrollProgress * 5 : 1}
            visible
          />
        </group>
      )}

      {(guitarVisible || allVisible) && (
        <group position={allVisible ? positions[3] : [0, 0, 0]}>
          <GuitaristSilhouette
            scrollProgress={guitarVisible ? scrollProgress * 5 : 1}
            visible
          />
        </group>
      )}


    </>
  );
}

export default function Scene({ scrollProgress, currentAct }: SceneProps) {
  return (
    <div className="canvas-container">
      <Canvas
        dpr={[1, 1.5]}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.2;
        }}
      >
        <Suspense fallback={null}>
          <SceneContents scrollProgress={scrollProgress} currentAct={currentAct} />
        </Suspense>
      </Canvas>
    </div>
  );
}
