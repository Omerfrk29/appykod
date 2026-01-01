'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Torus, Icosahedron, Octahedron } from '@react-three/drei';
import * as THREE from 'three';

// Floating geometric shape component
function FloatingShape({
  position,
  geometry,
  color,
  speed = 1,
  distort = 0.3,
  scale = 1
}: {
  position: [number, number, number];
  geometry: 'sphere' | 'torus' | 'icosahedron' | 'octahedron';
  color: string;
  speed?: number;
  distort?: number;
  scale?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle rotation
      meshRef.current.rotation.x += 0.001 * speed;
      meshRef.current.rotation.y += 0.002 * speed;
    }
  });

  const GeometryComponent = {
    sphere: Sphere,
    torus: Torus,
    icosahedron: Icosahedron,
    octahedron: Octahedron,
  }[geometry];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const args: any = geometry === 'torus' ? [0.8, 0.3, 32, 64] : [1, geometry === 'icosahedron' ? 1 : 2];

  return (
    <Float
      speed={speed}
      rotationIntensity={0.5}
      floatIntensity={1}
      floatingRange={[-0.2, 0.2]}
    >
      <GeometryComponent ref={meshRef} args={args} scale={scale} position={position}>
        <MeshDistortMaterial
          color={color}
          metalness={0.9}
          roughness={0.1}
          distort={distort}
          speed={2}
          envMapIntensity={1}
        />
      </GeometryComponent>
    </Float>
  );
}

// Particles component
function Particles({ count = 100 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const primaryColor = new THREE.Color('#00CED1');
    const secondaryColor = new THREE.Color('#5E6FEA');

    for (let i = 0; i < count; i++) {
      // Random positions in a sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 3 + Math.random() * 5;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Interpolate between primary and secondary
      const mixedColor = primaryColor.clone().lerp(secondaryColor, Math.random());
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    return { positions, colors };
  }, [count]);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.0005;
      mesh.current.rotation.x += 0.0002;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[particles.colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

// Mouse parallax effect
function MouseParallax({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(() => {
    if (group.current) {
      // Smooth follow mouse
      group.current.rotation.y += (mouse.x * 0.1 - group.current.rotation.y) * 0.05;
      group.current.rotation.x += (mouse.y * 0.1 - group.current.rotation.x) * 0.05;
    }
  });

  return <group ref={group}>{children}</group>;
}

// Main scene content
function Scene({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);

  // Apply scroll-based transformations
  useFrame(() => {
    if (groupRef.current) {
      // Fade out and scale down as user scrolls
      const opacity = 1 - scrollProgress;
      const scale = 1 - scrollProgress * 0.3;
      groupRef.current.scale.setScalar(scale);

      // Push shapes away as scroll increases
      groupRef.current.position.y = -scrollProgress * 2;
    }
  });

  return (
    <group ref={groupRef}>
      <MouseParallax>
        {/* Main shapes */}
        <FloatingShape
          position={[-2, 0.5, -1]}
          geometry="icosahedron"
          color="#00CED1"
          scale={0.8}
          speed={1.2}
          distort={0.4}
        />
        <FloatingShape
          position={[2.5, -0.5, -2]}
          geometry="torus"
          color="#5E6FEA"
          scale={0.6}
          speed={0.8}
          distort={0.3}
        />
        <FloatingShape
          position={[1, 1.5, -3]}
          geometry="octahedron"
          color="#47CF86"
          scale={0.5}
          speed={1}
          distort={0.2}
        />
        <FloatingShape
          position={[-1.5, -1, -2]}
          geometry="sphere"
          color="#FB6B4E"
          scale={0.4}
          speed={1.5}
          distort={0.5}
        />

        {/* Particles */}
        <Particles count={80} />
      </MouseParallax>

      {/* Ambient glow */}
      <pointLight position={[0, 0, 3]} intensity={0.5} color="#00CED1" />
      <pointLight position={[-3, 2, 0]} intensity={0.3} color="#5E6FEA" />
      <pointLight position={[3, -2, 0]} intensity={0.3} color="#47CF86" />
    </group>
  );
}

// Static fallback for reduced motion
function StaticFallback() {
  return (
    <div className="absolute inset-0 bg-gradient-warm-glow opacity-30" />
  );
}

// Main export component
export default function Hero3DScene({ scrollProgress = 0 }: { scrollProgress?: number }) {
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);

    // Mark as loaded after a small delay
    const timer = setTimeout(() => setIsLoaded(true), 100);

    return () => {
      mediaQuery.removeEventListener('change', handler);
      clearTimeout(timer);
    };
  }, []);

  if (isReducedMotion) {
    return <StaticFallback />;
  }

  return (
    <div
      className="absolute inset-0 transition-opacity duration-500"
      style={{ opacity: isLoaded ? 1 - scrollProgress * 2 : 0 }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 10, 5]} intensity={0.5} />

        {/* Scene content */}
        <Scene scrollProgress={scrollProgress} />

        {/* Environment */}
        <fog attach="fog" args={['#09090B', 5, 15]} />
      </Canvas>
    </div>
  );
}
