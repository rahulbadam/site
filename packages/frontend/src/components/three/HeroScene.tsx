import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';

// Elegant Wedding Pillar - Side Only
function WeddingPillar({ position }: { position: [number, number, number] }) {
  const group = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (group.current) {
      group.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.3) * 0.02;
    }
  });
  
  return (
    <group ref={group} position={position} scale={0.85}>
      {/* Base */}
      <mesh position={[0, -3.2, 0]}>
        <boxGeometry args={[1, 0.3, 1]} />
        <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Main pillar shaft */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.3, 0.35, 4.5, 24]} />
        <meshStandardMaterial color="#f5f5dc" metalness={0.1} roughness={0.8} />
      </mesh>
      
      {/* Gold rings */}
      {[-2.5, -1, 0.5, 2].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.35, 0.04, 12, 32]} />
          <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} />
        </mesh>
      ))}
      
      {/* Capital */}
      <mesh position={[0, 2.2, 0]}>
        <cylinderGeometry args={[0.45, 0.35, 0.25, 24]} />
        <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Top box */}
      <mesh position={[0, 2.5, 0]}>
        <boxGeometry args={[0.8, 0.25, 0.8]} />
        <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Kalash on top */}
      <mesh position={[0, 2.9, 0]}>
        <latheGeometry 
          args={[
            [
              new THREE.Vector2(0, 0),
              new THREE.Vector2(0.12, 0.03),
              new THREE.Vector2(0.18, 0.12),
              new THREE.Vector2(0.18, 0.2),
              new THREE.Vector2(0.12, 0.25),
            ],
            16
          ]} 
        />
        <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.1} />
      </mesh>
      
      {/* Soft glow */}
      <pointLight position={[0, 1.5, 0]} intensity={0.2} color="#ffd700" distance={3} />
    </group>
  );
}

// Simple Stage Platform - Just the floor hint
function StagePlatform() {
  return (
    <group position={[0, -3.8, 0]}>
      {/* Simple floor line */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 6]} />
        <meshStandardMaterial 
          color="#d4af37" 
          metalness={0.3} 
          roughness={0.6}
          transparent
          opacity={0.15}
        />
      </mesh>
    </group>
  );
}

// Flower Garland - Subtle
function FlowerGarland({ y }: { y: number }) {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const segments = 16;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const x = -5.5 + 11 * t;
      const sag = Math.sin(t * Math.PI) * 0.25;
      pts.push(new THREE.Vector3(x, y - sag, -0.5));
    }
    return pts;
  }, [y]);
  
  const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points]);
  
  return (
    <mesh>
      <tubeGeometry args={[curve, 32, 0.06, 8, false]} />
      <meshStandardMaterial 
        color="#ff6b35" 
        metalness={0.2} 
        roughness={0.6}
        transparent
        opacity={0.7}
      />
    </mesh>
  );
}

// Floating Diyas - Minimal
function FloatingDiyas() {
  const diyas = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      position: [
        Math.cos((i / 8) * Math.PI * 2) * 6,
        -2.5,
        Math.sin((i / 8) * Math.PI * 2) * 2
      ] as [number, number, number],
      scale: 0.1,
    }));
  }, []);
  
  return (
    <>
      {diyas.map((diya, i) => (
        <Diya key={i} position={diya.position} scale={diya.scale} />
      ))}
    </>
  );
}

function Diya({ position, scale }: { position: [number, number, number], scale: number }) {
  const flameRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (flameRef.current) {
      flameRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 8) * 0.2;
    }
  });
  
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.25, 0.35, 0.15, 16]} />
        <meshStandardMaterial color="#cd853f" metalness={0.3} roughness={0.7} />
      </mesh>
      <mesh ref={flameRef} position={[0, 0.2, 0]}>
        <coneGeometry args={[0.05, 0.2, 8]} />
        <meshStandardMaterial 
          color="#ff6b00" 
          emissive="#ff6b00"
          emissiveIntensity={1.2}
          transparent
          opacity={0.85}
        />
      </mesh>
      <pointLight position={[0, 0.3, 0]} intensity={0.25} color="#ff6b00" distance={2} />
    </group>
  );
}

// Subtle Golden Particles
function GoldenParticles() {
  const ref = useRef<THREE.Points>(null);
  const { viewport } = useThree();
  
  const positions = useMemo(() => {
    const pos = new Float32Array(50 * 3);
    for (let i = 0; i < 50; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * viewport.width * 2;
      pos[i3 + 1] = (Math.random() - 0.5) * viewport.height * 2;
      pos[i3 + 2] = (Math.random() - 0.5) * 3;
    }
    return pos;
  }, [viewport]);
  
  useFrame((state) => {
    if (ref.current) {
      const pos = ref.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < 50; i++) {
        const i3 = i * 3;
        pos[i3 + 1] += Math.sin(state.clock.elapsedTime * 0.3 + i) * 0.0008;
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });
  
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={50} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial 
        size={0.025} 
        color="#ffd700" 
        transparent 
        opacity={0.4} 
        sizeAttenuation 
        blending={THREE.AdditiveBlending} 
      />
    </points>
  );
}

// Decorative Corner Elements - Subtle
function CornerDecoration({ position, rotation }: { position: [number, number, number], rotation: number }) {
  return (
    <group position={position} rotation={[0, 0, rotation]}>
      {/* Curved corner piece */}
      <mesh>
        <torusGeometry args={[1, 0.03, 8, 16, Math.PI / 2]} />
        <meshStandardMaterial 
          color="#d4af37" 
          metalness={0.8} 
          roughness={0.2}
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
}

function Scene() {
  return (
    <>
      <color attach="background" args={['#fff9eb']} />
      <fog attach="fog" args={['#fff9eb', 8, 20]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 8, 5]} intensity={0.8} color="#fff9eb" />
      <directionalLight position={[-5, 5, 3]} intensity={0.4} color="#ffd700" />
      
      <Suspense fallback={null}>
        <Environment preset="sunset" />
        
        {/* Two pillars on sides - leaving center empty for text */}
        <WeddingPillar position={[-6, 0, -1]} />
        <WeddingPillar position={[6, 0, -1]} />
        
        {/* Simple stage hint */}
        <StagePlatform />
        
        {/* Flower garlands between pillars */}
        <FlowerGarland y={2.8} />
        <FlowerGarland y={2.3} />
        
        {/* Diyas around */}
        <FloatingDiyas />
        
        {/* Subtle corner decorations */}
        <CornerDecoration position={[-6.5, 3, -2]} rotation={0} />
        <CornerDecoration position={[6.5, 3, -2]} rotation={-Math.PI / 2} />
        <CornerDecoration position={[-6.5, -3, -2]} rotation={Math.PI / 2} />
        <CornerDecoration position={[6.5, -3, -2]} rotation={Math.PI} />
        
        {/* Ambient particles */}
        <GoldenParticles />
      </Suspense>
    </>
  );
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 -z-5">
      <Canvas camera={{ position: [0, 0, 9], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true }}>
        <Scene />
      </Canvas>
    </div>
  );
}