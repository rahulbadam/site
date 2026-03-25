import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Environment, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

function Rings() {
  const group = useRef<THREE.Group>(null);
  
  const rings = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => ({
      radius: 2 + i * 0.5,
      rotation: i * 0.3,
      color: i % 2 === 0 ? '#ec4899' : '#8b5cf6'
    }));
  }, []);
  
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
      group.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });
  
  return (
    <group ref={group} position={[0, 0, -2]}>
      {rings.map((ring, i) => (
        <mesh key={i} rotation={[Math.PI / 2, ring.rotation, 0]}>
          <torusGeometry args={[ring.radius, 0.03, 16, 100]} />
          <meshStandardMaterial 
            color={ring.color} 
            metalness={0.8} 
            roughness={0.2}
            emissive={ring.color}
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

function FloatingHearts() {
  const hearts = useMemo(() => {
    return Array.from({ length: 15 }, () => ({
      position: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4 - 3
      ] as [number, number, number],
      scale: 0.1 + Math.random() * 0.2,
      rotation: Math.random() * Math.PI,
      speed: 0.5 + Math.random() * 1
    }));
  }, []);
  
  return (
    <>
      {hearts.map((heart, i) => (
        <Float key={i} speed={heart.speed} rotationIntensity={0.5} floatIntensity={1}>
          <HeartMesh position={heart.position} scale={heart.scale} initialRotation={heart.rotation} />
        </Float>
      ))}
    </>
  );
}

function HeartMesh({ position, scale, initialRotation }: { position: [number, number, number], scale: number, initialRotation: number }) {
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
      mesh.current.rotation.z = initialRotation + state.clock.elapsedTime * 0.1;
    }
  });
  
  return (
    <mesh ref={mesh} position={position} scale={scale} rotation={[0, 0, initialRotation]}>
      <extrudeGeometry args={[heartShape, { depth: 0.2, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05 }]} />
      <meshStandardMaterial 
        color="#ec4899" 
        metalness={0.5} 
        roughness={0.3}
        emissive="#ec4899"
        emissiveIntensity={0.2}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

function GlassSphere() {
  const mesh = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
      mesh.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });
  
  return (
    <mesh ref={mesh} position={[0, 0, 0]} scale={1.5}>
      <icosahedronGeometry args={[1, 4]} />
      <MeshTransmissionMaterial
        backside
        samples={16}
        thickness={0.5}
        chromaticAberration={0.2}
        anisotropy={0.3}
        distortion={0.5}
        distortionScale={0.5}
        temporalDistortion={0.2}
        iridescence={1}
        iridescenceIOR={1}
        iridescenceThicknessRange={[0, 1400]}
        color="#f9a8d4"
      />
    </mesh>
  );
}

function ParticleField() {
  const ref = useRef<THREE.Points>(null);
  const { viewport } = useThree();
  
  const particles = useMemo(() => {
    const positions = new Float32Array(500 * 3);
    const scales = new Float32Array(500);
    
    for (let i = 0; i < 500; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * viewport.width * 2;
      positions[i3 + 1] = (Math.random() - 0.5) * viewport.height * 2;
      positions[i3 + 2] = (Math.random() - 0.5) * 10;
      scales[i] = Math.random();
    }
    
    return { positions, scales };
  }, [viewport]);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.elapsedTime * 0.01;
      const positions = ref.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < 500; i++) {
        const i3 = i * 3;
        positions[i3 + 1] += Math.sin(state.clock.elapsedTime + i) * 0.001;
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });
  
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={500}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#ec4899"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Scene() {
  return (
    <>
      <color attach="background" args={['#fafafa']} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#8b5cf6" />
      <pointLight position={[5, -5, 5]} intensity={0.5} color="#ec4899" />
      
      <Suspense fallback={null}>
        <Environment preset="city" />
        <GlassSphere />
        <Rings />
        <FloatingHearts />
        <ParticleField />
      </Suspense>
    </>
  );
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 -z-5">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}