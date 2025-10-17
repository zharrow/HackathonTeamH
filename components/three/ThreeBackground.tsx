'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

function WireframeGeometry() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3
    }
  })

  return (
    <>
      {/* Icosaèdre principal avec glow cyan */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <icosahedronGeometry args={[2.5, 1]} />
        <meshStandardMaterial
          color="#00FFF7"
          wireframe
          emissive="#00FFF7"
          emissiveIntensity={0.5}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Deuxième couche - effet de profondeur */}
      <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 4, 0]}>
        <icosahedronGeometry args={[3, 0]} />
        <meshStandardMaterial
          color="#FF00FF"
          wireframe
          emissive="#FF00FF"
          emissiveIntensity={0.3}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Points flottants */}
      <points>
        <sphereGeometry args={[5, 32, 32]} />
        <pointsMaterial
          color="#00FFF7"
          size={0.05}
          transparent
          opacity={0.4}
        />
      </points>
    </>
  )
}

interface ThreeBackgroundProps {
  className?: string
}

export function ThreeBackground({ className = '' }: ThreeBackgroundProps) {
  return (
    <div className={`fixed inset-0 -z-10 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        {/* Lumières */}
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} color="#00FFF7" intensity={1} />
        <pointLight position={[-10, -10, -10]} color="#FF00FF" intensity={0.8} />
        <pointLight position={[0, 5, 5]} color="#FFFFFF" intensity={0.3} />

        {/* Géométrie */}
        <WireframeGeometry />

        {/* Contrôles (auto-rotation) */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  )
}
