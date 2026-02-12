"use client"

import { Suspense, useRef, useMemo, useEffect, useState } from "react"
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber"
import { Sphere, Cylinder, Cone, Box, Instance, Instances } from "@react-three/drei"
import {
  EffectComposer,
  Bloom,
  Vignette,
} from "@react-three/postprocessing"
import * as THREE from "three"

// --- Improved Rocket Component ---
function LaunchRocket({ isLaunching }: { isLaunching: boolean }) {
  const groupRef = useRef<THREE.Group>(null)

  // Reset rocket when not launching
  useEffect(() => {
    if (groupRef.current) {
      if (!isLaunching) {
        groupRef.current.position.set(0, -0.8, 2) // Reset to surface
        groupRef.current.rotation.set(0, 0, 0)
        groupRef.current.visible = false // Hide initially
      } else {
        groupRef.current.visible = true // Show on launch
        groupRef.current.position.set(0, -0.8, 2)
      }
    }
  }, [isLaunching])

  useFrame((state, delta) => {
    if (!groupRef.current || !isLaunching) return

    // Accelerate upwards
    const t = state.clock.getElapsedTime()
    // Simple acceleration physics: p = p0 + v*t + 0.5*a*t^2
    // We just increment position for simplicity in this visual effect
    groupRef.current.position.y += delta * 2.5 + (groupRef.current.position.y + 0.8) * 0.08

    // Tilt slightly as it ascends
    groupRef.current.rotation.z = Math.sin(t * 10) * 0.02
    groupRef.current.rotation.x = Math.cos(t * 8) * 0.01
  })

  // Improve render quality
  return (
    <group ref={groupRef} visible={false}>
      {/* --- Main Body Stage 1 --- */}
      <Cylinder args={[0.15, 0.2, 1.2, 32]} position={[0, 0.6, 0]}>
        <meshStandardMaterial color="#e0e0e0" metalness={0.6} roughness={0.3} />
      </Cylinder>

      {/* --- Cockpit Window --- */}
      <mesh position={[0, 0.9, 0.14]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#111111" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* --- Nose Cone --- */}
      <Cone args={[0.15, 0.4, 32]} position={[0, 1.4, 0]}>
        <meshStandardMaterial color="#cc3333" metalness={0.4} roughness={0.4} />
      </Cone>

      {/* --- Fins (4x) --- */}
      {[0, 90, 180, 270].map((angle, i) => (
        <group key={i} rotation={[0, (angle * Math.PI) / 180, 0]}>
          {/* Aerodynamic fin shape using flattened boxes */}
          <group position={[0.22, 0.2, 0]}>
            <Box args={[0.15, 0.4, 0.02]} rotation={[0, 0, -0.2]}>
              <meshStandardMaterial color="#a00000" metalness={0.5} />
            </Box>
          </group>
        </group>
      ))}

      {/* --- Engine Nozzles --- */}
      <group position={[0, -0.05, 0]}>
        <Cylinder args={[0.08, 0.12, 0.15, 16]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#333" />
        </Cylinder>
      </group>

      {/* --- Engine Glow --- */}
      {isLaunching && (
        <group position={[0, -0.2, 0]}>
          <pointLight intensity={3} color="#ffaa00" distance={3} decay={2} />
          <mesh>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshBasicMaterial color="#ffaa00" transparent opacity={0.8} />
          </mesh>
        </group>
      )}

      {/* Smoke System */}
      <SmokeEmitter isLaunching={isLaunching} />
    </group>
  )
}

// --- Smoke Particle System ---
function SmokeEmitter({ isLaunching }: { isLaunching: boolean }) {
  const particlesRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  // Particle state: [x, y, z, scale, velocity, life]
  const particles = useMemo(() => {
    return new Array(150).fill(0).map(() => ({
      x: 0, y: 0, z: 0,
      scale: 0,
      vx: 0, vy: 0, vz: 0,
      life: 0, maxLife: 0,
      active: false
    }))
  }, [])

  useFrame((state, delta) => {
    if (!particlesRef.current) return

    particles.forEach((p, i) => {
      if (isLaunching) {
        // Spawn high density particles during launch
        if (!p.active && Math.random() < 0.4) {
          p.active = true;
          p.life = 0;
          p.maxLife = 0.5 + Math.random() * 0.5;
          p.x = (Math.random() - 0.5) * 0.1;
          p.y = -0.2; // Emitter position relative to rocket
          p.z = (Math.random() - 0.5) * 0.1;
          // Explode downwards and outwards
          p.vx = (Math.random() - 0.5) * 0.8;
          p.vy = -2 - Math.random() * 2;
          p.vz = (Math.random() - 0.5) * 0.8;
          p.scale = 0.05;
        }
      }

      if (p.active) {
        // Update physics
        p.x += p.vx * delta
        p.y += p.vy * delta
        p.z += p.vz * delta
        p.life += delta

        // Expand rapidly
        p.scale += delta * 1.5

        // Draw
        dummy.position.set(p.x, p.y, p.z)
        dummy.scale.setScalar(p.scale)
        dummy.updateMatrix()
        particlesRef.current!.setMatrixAt(i, dummy.matrix)

        // Reset if dead
        if (p.life > p.maxLife) {
          p.active = false
          p.scale = 0 // Hide it
          dummy.scale.setScalar(0)
          dummy.updateMatrix()
          particlesRef.current!.setMatrixAt(i, dummy.matrix)
        }
      } else {
        // Ensure hidden
        dummy.scale.setScalar(0)
        dummy.updateMatrix()
        particlesRef.current!.setMatrixAt(i, dummy.matrix)
      }
    })

    particlesRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={particlesRef} args={[undefined, undefined, 150]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial color="#aaaaaa" transparent opacity={0.4} depthWrite={false} />
    </instancedMesh>
  )
}

function MoonSphere() {
  const meshRef = useRef<THREE.Mesh>(null)

  // Load real moon textures
  const [colorMap, bumpMap] = useLoader(THREE.TextureLoader, [
    "/moon-texture.jpg",
    "/moon-bump.jpg",
  ])

  // Configure textures for maximum quality
  useMemo(() => {
    for (const tex of [colorMap, bumpMap]) {
      tex.anisotropy = 16
      tex.magFilter = THREE.LinearFilter
      tex.minFilter = THREE.LinearMipmapLinearFilter
      tex.generateMipmaps = true
      tex.colorSpace = THREE.SRGBColorSpace
    }
    // Bump map should be linear
    bumpMap.colorSpace = THREE.LinearSRGBColorSpace
  }, [colorMap, bumpMap])

  // Smooth rotation for visual interest
  useFrame((_state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.035
    }
  })

  // Fresnel glow shader for atmospheric rim
  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        glowColor: { value: new THREE.Color(0.82, 0.85, 0.95) },
        viewVector: { value: new THREE.Vector3(0, 0, 8) },
      },
      vertexShader: `
        varying float vIntensity;
        uniform vec3 viewVector;
        void main() {
          vec3 vNormal = normalize(normalMatrix * normal);
          vec3 vNormel = normalize(normalMatrix * viewVector);
          vIntensity = pow(0.68 - dot(vNormal, vNormel), 3.5);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        varying float vIntensity;
        void main() {
          gl_FragColor = vec4(glowColor, vIntensity * 0.4);
        }
      `,
    })
  }, [])

  return (
    <group position={[0, -3.8, 0]}>
      {/* Main moon body -- smaller radius for proper spacing */}
      <Sphere ref={meshRef} args={[3, 256, 256]}>
        <meshStandardMaterial
          map={colorMap}
          bumpMap={bumpMap}
          bumpScale={0.04}
          roughness={0.92}
          metalness={0.01}
          envMapIntensity={0.08}
        />
      </Sphere>

      {/* Fresnel atmosphere glow */}
      <Sphere args={[3.06, 128, 128]}>
        <primitive object={atmosphereMaterial} attach="material" />
      </Sphere>

      {/* Soft outer haze layers */}
      <Sphere args={[3.1, 64, 64]}>
        <meshBasicMaterial
          color="#c8cce8"
          transparent
          opacity={0.02}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </Sphere>
      <Sphere args={[3.18, 64, 64]}>
        <meshBasicMaterial
          color="#dde0f0"
          transparent
          opacity={0.008}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </Sphere>
    </group>
  )
}

function Lighting() {
  return (
    <>
      {/* Primary sunlight -- strong directional from upper-left */}
      <directionalLight
        position={[-5, 8, 6]}
        intensity={2.0}
        color="#fffef8"
      />
      {/* Earth-shine fill from opposite side */}
      <directionalLight
        position={[4, -1, 3]}
        intensity={0.1}
        color="#a8b8d8"
      />
      {/* Very subtle ambient so the dark side isn't pitch black */}
      <ambientLight intensity={0.03} color="#ffffff" />
      {/* Rim light for edge definition */}
      <pointLight
        position={[3, 3, -7]}
        intensity={0.3}
        color="#e0e4ff"
        distance={18}
        decay={2}
      />
    </>
  )
}

function MouseParallax() {
  const { camera } = useThree()
  const mouse = useRef({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 0.1
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 0.06
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useFrame(() => {
    target.current.x += (mouse.current.x - target.current.x) * 0.012
    target.current.y += (mouse.current.y - target.current.y) * 0.012
    camera.position.x = target.current.x
    camera.position.y = target.current.y
    camera.lookAt(0, -1.5, 0)
  })

  return null
}

export default function MoonScene({ isLaunching }: { isLaunching?: boolean }) {
  return (
    <div className="fixed inset-0 z-0" style={{ pointerEvents: "none" }}>
      {/* Ambient CSS glow behind the moon */}
      <div
        className="fixed left-1/2 -translate-x-1/2"
        style={{
          bottom: "-30%",
          width: "120vw",
          height: "70vh",
          background:
            "radial-gradient(ellipse at center bottom, rgba(255,255,255,0.04) 0%, rgba(180,195,225,0.015) 30%, transparent 65%)",
          pointerEvents: "none",
          animation: "breathe 12s ease-in-out infinite",
        }}
      />
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        style={{ pointerEvents: "auto" }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
      >
        <Suspense fallback={null}>
          <Lighting />
          <MoonSphere />
          <LaunchRocket isLaunching={!!isLaunching} />
          <MouseParallax />
          <EffectComposer multisampling={4}>
            <Bloom
              luminanceThreshold={0.75}
              luminanceSmoothing={0.85}
              intensity={0.2}
              radius={0.5}
              mipmapBlur
            />
            <Vignette offset={0.2} darkness={0.6} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  )
}
