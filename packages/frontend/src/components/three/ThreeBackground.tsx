import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function FloatingParticles() {
  const ref = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(3000 * 3);
    const colors = new Float32Array(3000 * 3);
    
    for (let i = 0; i < 3000; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 20;
      positions[i3 + 1] = (Math.random() - 0.5) * 20;
      positions[i3 + 2] = (Math.random() - 0.5) * 20;
      
      // Gradient colors from pink/purple to blue
      const t = Math.random();
      colors[i3] = 0.8 + t * 0.2; // R
      colors[i3 + 1] = 0.3 + t * 0.4; // G
      colors[i3 + 2] = 0.5 + t * 0.5; // B
    }
    
    return { positions, colors };
  }, []);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.02;
      ref.current.rotation.y = state.clock.elapsedTime * 0.03;
    }
  });
  
  return (
    <Points ref={ref} positions={particles.positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        vertexColors
        size={0.03}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function GlowingSpheres() {
  const group = useRef<THREE.Group>(null);
  const spheres = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      position: [
        Math.sin(i * 0.8) * 3,
        Math.cos(i * 0.6) * 2,
        Math.sin(i * 0.4) * 3 - 2
      ] as [number, number, number],
      scale: 0.2 + Math.random() * 0.3,
      speed: 0.5 + Math.random() * 0.5,
      color: i % 2 === 0 ? '#ec4899' : '#8b5cf6'
    }));
  }, []);
  
  useFrame((state) => {
    if (group.current) {
      group.current.children.forEach((child, i) => {
        const t = state.clock.elapsedTime * spheres[i].speed;
        child.position.y = spheres[i].position[1] + Math.sin(t + i) * 0.5;
        child.position.x = spheres[i].position[0] + Math.cos(t * 0.5 + i) * 0.3;
      });
    }
  });
  
  return (
    <group ref={group}>
      {spheres.map((sphere, i) => (
        <mesh key={i} position={sphere.position} scale={sphere.scale}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial 
            color={sphere.color} 
            transparent 
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

function HeartShape({ position }: { position: [number, number, number] }) {
  const mesh = useRef<THREE.Mesh>(null);
  
  const heartShape = useMemo(() => {
    const shape = new THREE.Shape();
    const x = 0, y = 0;
    shape.moveTo(x + 0.5, y + 0.5);
    shape.bezierCurveTo(x + 0.5, y + 0.5, x + 0.4, y, x, y);
    shape.bezierCurveTo(x - 0.6, y, x - 0.6, y + 0.7, x - 0.6, y + 0.7);
    shape.bezierCurveTo(x - 0.6, y + 1.1, x - 0.3, y + 1.54, x + 0.5, y + 1.9);
    shape.bezierCurveTo(x + 1.2, y + 1.54, x + 1.6, y + 1.1, x + 1.6, y + 0.7);
    shape.bezierCurveTo(x + 1.6, y + 0.7, x + 1.6, y, x + 1, y);
    shape.bezierCurveTo(x + 0.7, y, x + 0.5, y + 0.5, x + 0.5, y + 0.5);
    return shape;
  }, []);
  
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.z = state.clock.elapsedTime * 0.2;
      mesh.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });
  
  return (
    <mesh ref={mesh} position={position} scale={0.4}>
      <extrudeGeometry args={[heartShape, { depth: 0.3, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.1 }]} />
      <meshStandardMaterial color="#ec4899" metalness={0.3} roughness={0.4} />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ec4899" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
      <FloatingParticles />
      <GlowingSpheres />
      <HeartShape position={[-3, 1, -3]} />
      <HeartShape position={[3, -1, -2]} />
    </>
  );
}

export default function ThreeBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-white/60 pointer-events-none" />
    </div>
  );
}