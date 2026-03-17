'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
    Stars,
    Float,
    MeshDistortMaterial,
    Sparkles,
    ScrollControls,
    useScroll,
    Trail,
    Sphere,
    MeshWobbleMaterial,
} from '@react-three/drei'
import {
    EffectComposer,
    Bloom,
    ChromaticAberration,
    Vignette,
} from '@react-three/postprocessing'
import * as THREE from 'three'
import { Vector2 } from 'three'

// ── GALAXY CORE (central glowing orb) ────────
function GalaxyCore() {
    const meshRef = useRef<THREE.Mesh>(null)
    const scroll = useScroll()

    useFrame(({ clock }) => {
        if (!meshRef.current) return
        const t = scroll.offset

        // Rotation based on time + scroll
        meshRef.current.rotation.x = clock.getElapsedTime() * 0.1 + t * 2
        meshRef.current.rotation.y = clock.getElapsedTime() * 0.15 + t * 4

        // Slight scale oscillation based on scroll
        const s = 1 + Math.sin(t * Math.PI) * 0.2
        meshRef.current.scale.set(s, s, s)
    })

    return (
        <group>
            {/* Outer glow sphere */}
            <Sphere ref={meshRef as any} args={[80, 64, 64]}>
                <MeshDistortMaterial
                    color="#e8ff47"
                    emissive="#e8ff47"
                    emissiveIntensity={0.4}
                    distort={0.4}
                    speed={2}
                    transparent
                    opacity={0.08}
                    side={THREE.BackSide}
                />
            </Sphere>

            {/* Core bright center */}
            <Sphere args={[18, 32, 32]}>
                <MeshDistortMaterial
                    color="#e8ff47"
                    emissive="#e8ff47"
                    emissiveIntensity={5}
                    distort={0.6}
                    speed={3}
                    transparent
                    opacity={0.9}
                />
            </Sphere>

            {/* Inner ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[35, 2, 16, 100]} />
                <meshStandardMaterial
                    color="#00d4ff"
                    emissive="#00d4ff"
                    emissiveIntensity={3}
                    transparent
                    opacity={0.8}
                />
            </mesh>

            {/* Outer ring */}
            <mesh rotation={[Math.PI / 2.3, 0.3, 0]}>
                <torusGeometry args={[60, 1, 16, 100]} />
                <meshStandardMaterial
                    color="#e8ff47"
                    emissive="#e8ff47"
                    emissiveIntensity={2}
                    transparent
                    opacity={0.4}
                />
            </mesh>
        </group>
    )
}

// ── FLOATING CRYSTALS ─────────────────────────
function Crystal({
    position,
    scale,
    color,
    speed,
}: {
    position: [number, number, number]
    scale: number
    color: string
    speed: number
}) {
    const meshRef = useRef<THREE.Mesh>(null)
    const scroll = useScroll()
    const initialPos = useMemo(() => new THREE.Vector3(...position), [position])

    useFrame(({ clock }) => {
        if (!meshRef.current) return
        const t = scroll.offset

        meshRef.current.rotation.x = clock.getElapsedTime() * speed * 0.5 + t * 5
        meshRef.current.rotation.y = clock.getElapsedTime() * speed + t * 3

        // Move towards camera or drift based on scroll
        meshRef.current.position.z = initialPos.z + t * 200
        meshRef.current.position.x = initialPos.x + Math.sin(t * Math.PI) * 50
    })

    return (
        <Float
            speed={speed}
            rotationIntensity={0.5}
            floatIntensity={1}
        >
            <mesh ref={meshRef as any} position={position}
                scale={scale}>
                <octahedronGeometry args={[1, 0]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={3}
                    metalness={0.8}
                    roughness={0.1}
                    transparent
                    opacity={0.85}
                    wireframe={false}
                />
            </mesh>
        </Float>
    )
}

// ── WIREFRAME PLANET ──────────────────────────
function WireframePlanet({
    position,
    radius,
    color,
}: {
    position: [number, number, number]
    radius: number
    color: string
}) {
    const meshRef = useRef<THREE.Mesh>(null)

    useFrame(({ clock }) => {
        if (!meshRef.current) return
        meshRef.current.rotation.y =
            clock.getElapsedTime() * 0.08
        meshRef.current.rotation.x =
            clock.getElapsedTime() * 0.04
    })

    return (
        <group position={position}>
            {/* Solid inner */}
            <Sphere args={[radius, 32, 32]}>
                <MeshWobbleMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={1.5}
                    factor={0.2}
                    speed={1}
                    transparent
                    opacity={0.15}
                />
            </Sphere>
            {/* Wireframe outer */}
            <mesh ref={meshRef as any}>
                <icosahedronGeometry
                    args={[radius + 2, 1]} />
                <meshBasicMaterial
                    color={color}
                    wireframe
                    transparent
                    opacity={0.25}
                />
            </mesh>
            {/* Ring */}
            <mesh rotation={[Math.PI / 2.5, 0, 0]}>
                <torusGeometry
                    args={[radius * 1.8, 0.8, 8, 80]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={1}
                    transparent
                    opacity={0.5}
                />
            </mesh>
        </group>
    )
}

// ── SCROLL DRIVEN CAMERA ──────────────────────
function ScrollCamera() {
    const scroll = useScroll()
    const { camera } = useThree()

    useFrame(() => {
        const t = scroll.offset // 0 to 1

        // Camera flies through the scene on scroll
        camera.position.x = THREE.MathUtils.lerp(
            0,
            t < 0.5
                ? t * 400 - 100
                : 200 - (t - 0.5) * 300,
            1
        )
        camera.position.y = THREE.MathUtils.lerp(
            0,
            Math.sin(t * Math.PI) * 150,
            1
        )
        camera.position.z = THREE.MathUtils.lerp(
            350,
            t < 0.5
                ? 350 - t * 400
                : 150 - (t - 0.5) * 200,
            1
        )

        // Look toward center with slight drift
        camera.lookAt(
            Math.sin(t * Math.PI) * 50,
            Math.cos(t * Math.PI * 2) * 30,
            0
        )
    })

    return null
}

// ── ASTEROID BELT ─────────────────────────────
function AsteroidBelt() {
    const count = 300
    const positions = useMemo(() => {
        const arr = []
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2
            const radius = 150 + Math.random() * 60
            const height = (Math.random() - 0.5) * 20
            arr.push([
                Math.cos(angle) * radius,
                height,
                Math.sin(angle) * radius,
            ])
        }
        return arr
    }, [])

    const groupRef = useRef<THREE.Group>(null)

    useFrame(({ clock }) => {
        if (!groupRef.current) return
        groupRef.current.rotation.y =
            clock.getElapsedTime() * 0.02
    })

    return (
        <group ref={groupRef as any}>
            {positions.map((pos, i) => (
                <mesh
                    key={i}
                    position={pos as [number, number, number]}
                    scale={Math.random() * 1.5 + 0.3}
                >
                    <dodecahedronGeometry
                        args={[1, 0]} />
                    <meshStandardMaterial
                        color={i % 3 === 0
                            ? '#e8ff47'
                            : i % 3 === 1
                                ? '#00d4ff'
                                : '#ffffff'}
                        emissive={i % 3 === 0
                            ? '#e8ff47'
                            : '#00d4ff'}
                        emissiveIntensity={2}
                        metalness={0.9}
                        roughness={0.1}
                        transparent
                        opacity={0.7}
                    />
                </mesh>
            ))}
        </group>
    )
}

// ── PARTICLE TRAILS ───────────────────────────
function SpaceDebris() {
    const count = 60
    const items = useMemo(() =>
        Array.from({ length: count }, (_, i) => ({
            position: [
                (Math.random() - 0.5) * 600,
                (Math.random() - 0.5) * 300,
                (Math.random() - 0.5) * 400,
            ] as [number, number, number],
            speed: Math.random() * 0.5 + 0.1,
            color: Math.random() > 0.5
                ? '#e8ff47' : '#00d4ff',
        })),
        [])

    return (
        <>
            {items.map((item, i) => (
                <MovingDebris key={i} {...item} />
            ))}
        </>
    )
}

function MovingDebris({
    position,
    speed,
    color,
}: {
    position: [number, number, number]
    speed: number
    color: string
}) {
    const meshRef = useRef<THREE.Mesh>(null)

    useFrame(({ clock }) => {
        if (!meshRef.current) return
        meshRef.current.position.z +=
            speed * 0.5
        meshRef.current.rotation.x +=
            0.01 * speed
        if (meshRef.current.position.z > 400) {
            meshRef.current.position.z = -400
        }
    })

    return (
        <Trail
            width={1}
            length={6}
            color={color}
            attenuation={(t) => t * t}
        >
            <mesh ref={meshRef as any} position={position}>
                <sphereGeometry args={[0.5, 4, 4]} />
                <meshBasicMaterial color={color} />
            </mesh>
        </Trail>
    )
}

// ── MAIN SCENE CONTENTS ───────────────────────
function SceneContents() {
    return (
        <>
            <ScrollCamera />

            {/* Lighting */}
            <ambientLight intensity={0.1} />
            <pointLight
                position={[0, 0, 0]}
                intensity={80}
                color="#e8ff47"
                distance={600}
            />
            <pointLight
                position={[200, 100, -100]}
                intensity={40}
                color="#00d4ff"
                distance={500}
            />
            <pointLight
                position={[-200, -100, 100]}
                intensity={30}
                color="#ffffff"
                distance={400}
            />

            {/* Deep star field */}
            <Stars
                radius={800}
                depth={200}
                count={7000}
                factor={4}
                saturation={0.5}
                fade
                speed={0.5}
            />

            {/* Accent sparkles floating */}
            <Sparkles
                count={500}
                scale={400}
                size={4}
                speed={0.6}
                color="#e8ff47"
                opacity={0.8}
            />
            <Sparkles
                count={250}
                scale={300}
                size={3}
                speed={0.5}
                color="#00d4ff"
                opacity={0.7}
            />

            {/* Central galaxy */}
            <GalaxyCore />

            {/* Asteroid belt around center */}
            <AsteroidBelt />

            {/* Floating crystals */}
            <Crystal position={[120, 40, 80]}
                scale={8} color="#e8ff47" speed={0.3} />
            <Crystal position={[-150, -60, 120]}
                scale={6} color="#00d4ff" speed={0.4} />
            <Crystal position={[200, 80, -60]}
                scale={10} color="#e8ff47" speed={0.2} />
            <Crystal position={[-80, 120, 60]}
                scale={5} color="#ffffff" speed={0.5} />
            <Crystal position={[60, -120, 180]}
                scale={7} color="#00d4ff" speed={0.35} />
            <Crystal position={[-200, 60, -80]}
                scale={9} color="#e8ff47" speed={0.25} />

            {/* Wireframe planets */}
            <WireframePlanet
                position={[280, -80, -120]}
                radius={45}
                color="#00d4ff"
            />
            <WireframePlanet
                position={[-250, 100, -200]}
                radius={35}
                color="#e8ff47"
            />
            <WireframePlanet
                position={[0, -180, -300]}
                radius={55}
                color="#ffffff"
            />

            {/* Space debris with trails */}
            <SpaceDebris />
        </>
    )
}

// ── EXPORTED COMPONENT ────────────────────────
export default function Universe3D() {
    return (
        <div
            style={{
                position: 'absolute',
                inset: 0,
                zIndex: 1,
                pointerEvents: 'none',
            }}
        >
            <Canvas
                camera={{
                    position: [0, 0, 350],
                    fov: 75,
                    near: 0.1,
                    far: 2000,
                }}
                gl={{
                    powerPreference: 'default',
                    alpha: true,
                    antialias: false,
                    stencil: false,
                    depth: true
                }}
                style={{
                    background: '#02020a',
                }}
            >
                <ScrollControls
                    pages={5}
                    damping={0.3}
                >
                    <SceneContents />
                </ScrollControls>

                {/* Ultra high intensity post processing for maximum glow */}
                <EffectComposer
                    multisampling={0}
                    frameBufferType={THREE.HalfFloatType}
                >
                    <Bloom
                        intensity={8.0}
                        luminanceThreshold={0}
                        luminanceSmoothing={1.0}
                        mipmapBlur
                    />
                    <ChromaticAberration
                        offset={new Vector2(0.0015, 0.0015)}
                    />
                    <Vignette
                        offset={0.3}
                        darkness={0.7}
                    />
                </EffectComposer>
            </Canvas>
        </div>
    )
}
