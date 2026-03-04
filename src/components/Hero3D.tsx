'use client';

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from './ThemeProvider';

/**
 * Antigravity 3D design principles applied here:
 * - Objects don't float randomly. They orbit an implied center of mass (origin).
 * - Each object has a defined orbital radius, inclination, and angular velocity.
 * - The "gravity" of the center pulls the camera eye subtly — mouse = perturbation force.
 * - Smaller objects move faster (conservation of angular momentum at smaller radii).
 * - The ring defines the orbital plane — the "ecliptic" of the composition.
 */

/* ── Orbital body — a single object on a defined elliptical path ── */
function OrbitalBody({
    radius,
    inclination,
    angularSpeed,
    phase,
    scale,
    color,
}: {
    radius: number;
    inclination: number;
    angularSpeed: number;
    phase: number;
    scale: number;
    color: string;
}) {
    const ref = useRef<THREE.Mesh>(null!);

    const timer = useMemo(() => new THREE.Timer(), []);

    useFrame((_, delta) => {
        timer.update();
        const t = timer.getElapsed() * angularSpeed + phase;
        // Orbital position: ellipse in the inclined plane
        ref.current.position.x = Math.cos(t) * radius;
        ref.current.position.y = Math.sin(t) * radius * 0.55 * Math.cos(inclination);
        ref.current.position.z = Math.sin(t) * radius * 0.55 * Math.sin(inclination) - 0.5;
        // Self-rotation tracks orbital velocity
        ref.current.rotation.x = t * 0.4;
        ref.current.rotation.y = t * 0.6;
    });

    return (
        <mesh ref={ref} scale={scale}>
            <icosahedronGeometry args={[1, 1]} />
            <MeshDistortMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.2}
                roughness={0.05}
                metalness={0.9}
                distort={0.3}
                speed={2}
                transparent
                opacity={0.85}
            />
        </mesh>
    );
}

/* ── Orbital plane ring ── */
function OrbitalRing({ radius, inclination, color }: { radius: number; inclination: number; color: string }) {
    const ref = useRef<THREE.Mesh>(null!);
    const timer = useMemo(() => new THREE.Timer(), []);
    useFrame((_, delta) => {
        timer.update();
        ref.current.rotation.x = inclination + Math.sin(timer.getElapsed() * 0.1) * 0.05;
        ref.current.rotation.y = timer.getElapsed() * 0.05;
    });
    return (
        <mesh ref={ref}>
            <torusGeometry args={[radius, 0.005, 16, 120]} />
            <meshBasicMaterial color={color} transparent opacity={0.18} />
        </mesh>
    );
}

/* ── Particle field — "pressurized" space, not decoration ── */
function PressurizedSpace({ count = 200, color }: { count?: number; color: string }) {
    const ref = useRef<THREE.Points>(null!);

    const { positions, sizes } = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            const r = 3 + Math.random() * 3;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi) - 1;
            sizes[i] = Math.random() > 0.85 ? 0.06 : 0.025;
        }
        return { positions, sizes };
    }, [count]);

    const timer = useMemo(() => new THREE.Timer(), []);
    useFrame((_, delta) => {
        timer.update();
        if (ref.current) {
            ref.current.rotation.y = timer.getElapsed() * 0.025;
            ref.current.rotation.x = Math.sin(timer.getElapsed() * 0.015) * 0.08;
        }
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
                <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
            </bufferGeometry>
            <pointsMaterial
                size={0.04}
                color={color}
                transparent
                opacity={0.5}
                sizeAttenuation
            />
        </points>
    );
}

/* ── Central mass — the attractor (barely visible, structurally important) ── */
function CentralMass({ color }: { color: string }) {
    const ref = useRef<THREE.Mesh>(null!);
    const timer = useMemo(() => new THREE.Timer(), []);
    useFrame((_, delta) => {
        timer.update();
        const s = 1 + Math.sin(timer.getElapsed() * 0.7) * 0.04;
        ref.current.scale.setScalar(s);
    });
    return (
        <mesh ref={ref}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial color={color} transparent opacity={0.5} />
        </mesh>
    );
}

/* ── Mouse-perturbation camera rig ── */
function CameraRig() {
    const { camera } = useThree();
    const mouse = useRef({ x: 0, y: 0 });
    const vel = useRef({ x: 0, y: 0 }); // velocity carries between frames

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 1.2;
            mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 0.8;
        };
        window.addEventListener('mousemove', handler);
        return () => window.removeEventListener('mousemove', handler);
    }, []);

    useFrame(() => {
        // Spring physics: camera velocity bleeds into next frame (momentum)
        vel.current.x += (mouse.current.x * 0.6 - camera.position.x - vel.current.x) * 0.06;
        vel.current.y += (mouse.current.y * 0.4 - camera.position.y - vel.current.y) * 0.06;
        camera.position.x += vel.current.x * 0.08;
        camera.position.y += vel.current.y * 0.08;
        camera.lookAt(0, 0, 0);
    });

    return null;
}

/* ── Main ── */
export default function Hero3D() {
    const { theme } = useTheme();
    const accentColor = theme === 'light' ? '#2A4D14' : '#E8FF47';

    return (
        <div
            style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                zIndex: 0,
            }}
        >
            <Canvas
                camera={{ position: [0, 0, 5], fov: 50 }}
                gl={{ antialias: true, alpha: true }}
                style={{ width: '100%', height: '100%' }}
            >
                <ambientLight intensity={0.1} />
                <pointLight position={[0, 0, 0]} intensity={2} color={accentColor} distance={8} decay={2} />
                <directionalLight position={[4, 4, 4]} intensity={0.4} color="#ffffff" />

                {/* Center of mass */}
                <CentralMass color={accentColor} />

                {/* Orbital plane rings */}
                <OrbitalRing radius={1.6} inclination={Math.PI * 0.15} color={accentColor} />
                <OrbitalRing radius={2.4} inclination={Math.PI * 0.42} color={accentColor} />

                {/* Orbital bodies — smaller = faster (angular momentum conservation) */}
                <OrbitalBody radius={1.6} inclination={Math.PI * 0.15} angularSpeed={0.55} phase={0} scale={0.18} color={accentColor} />
                <OrbitalBody radius={1.6} inclination={Math.PI * 0.15} angularSpeed={0.55} phase={Math.PI} scale={0.12} color={accentColor} />
                <OrbitalBody radius={2.4} inclination={Math.PI * 0.42} angularSpeed={0.32} phase={1.2} scale={0.28} color={accentColor} />

                {/* Pressurized space */}
                <PressurizedSpace count={220} color={accentColor} />

                {/* Mouse-reactive camera with momentum */}
                <CameraRig />
            </Canvas>
        </div>
    );
}
