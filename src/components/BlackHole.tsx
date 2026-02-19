"use client";

import React, { useRef } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";

// Vertex Shader
const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// Fragment Shader
// High-contrast, seamless black hole shader
const fragmentShader = `
uniform float uTime;
uniform vec2 uResolution;
varying vec2 vUv;

#define PI 3.14159265359

// Hash function
float hash(float n) { return fract(sin(n) * 43758.5453123); }

// 3D Noise for seamless animation
float noise(vec3 x) {
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    float n = p.x + p.y * 57.0 + 113.0 * p.z;
    return mix(mix(mix(hash(n + 0.0), hash(n + 1.0), f.x),
                   mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y),
               mix(mix(hash(n + 113.0), hash(n + 114.0), f.x),
                   mix(hash(n + 170.0), hash(n + 171.0), f.x), f.y), f.z);
}

// 2D rotation
mat2 rot2d(float a) {
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
}

// FBM Noise
float fbm(vec3 p) {
    float f = 0.0;
    f += 0.5000 * noise(p); p *= 2.02;
    f += 0.2500 * noise(p); p *= 2.03;
    f += 0.1250 * noise(p); p *= 2.01;
    f += 0.0625 * noise(p);
    return f;
}

void main() {
    // Normalizing coordinates to center
    vec2 uv = vUv * 2.0 - 1.0;
    
    // Distance from center
    float r = length(uv);
    
    // Event Horizon Radius
    float bhRadius = 0.22;
    float eventHorizon = smoothstep(bhRadius, bhRadius - 0.01, r);
    
    // Accretion Disk Physics Simulation (Visual Approximation)
    // To fix the seam, we don't rely on raw atan(y,x). 
    // Instead, we rotate the coordinate space itself over time.
    
    // Create a rotating coordinate system for the flow
    float rotationSpeed = 0.8;
    // The rotation increases closer to the black hole (conservation of angular momentum)
    float twist = 4.0 / (r + 0.1); 
    
    float angle = uTime * rotationSpeed + twist;
    vec2 rotatedUV = rot2d(angle) * uv;
    
    // We sample 3D noise using (x, y, time) to get seamless evolution + rotation
    // Strech the UVs along the flow direction to create streaks
    vec3 noisePos = vec3(rotatedUV * vec2(3.0, 0.5), uTime * 0.2);
    
    // Additional twist for detail
    float n = fbm(noisePos);
    
    // Sharpen noise for "plasma" look
    n = pow(n, 3.0); 
    
    // Disk Gradient
    // Fade out at edges, sharp cut at horizon
    float diskFade = smoothstep(1.2, bhRadius + 0.1, r); 
    float innerEdge = smoothstep(bhRadius, bhRadius + 0.05, r);
    
    // Color Palette - Matching Title Gradient (Blue-600 to Purple-600)
    // Blue-600: #2563EB -> (0.145, 0.388, 0.921)
    // Purple-600: #9333EA -> (0.576, 0.200, 0.917)
    
    vec3 colMsg = vec3(0.0);
    
    // Core (Photon Ring) - Bright Blue-White (Less intense to save text)
    vec3 cCore = vec3(0.6, 0.8, 1.0) * 2.0;
    
    // Inner Disk - Bright White-Blue (The "Rim" effect)
    // Mixing white with a slight touch of the title gradient blue
    vec3 cInner = vec3(0.8, 0.9, 1.0) * 3.0;
    
    // Outer Disk - Purple 600 (Cooler/Further) stays mostly the same for contrast
    vec3 cOuter = vec3(0.576, 0.200, 0.917); 
    
    // Compose colors based on radius and noise intensity
    vec3 col = mix(cOuter, cInner, n * 2.0 * smoothstep(0.8, 0.3, r));
    
    // Add the photon ring (bright thin circle)
    // "String-like" narrow but less blinding
    float photonRing = smoothstep(bhRadius + 0.005, bhRadius + 0.002, r);
    photonRing = pow(photonRing, 8.0); // Ultra-sharp curve
    col += cCore * photonRing * 8.0; // Reduced intensity (was 40.0)
    
    // Apply noise texture mask
    // We want the disk to be "clumpy" but the photon ring to be stable
    col *= (n * 1.5 + 0.2); // Base brightness
    
    // Apply geometric masks
    col *= diskFade;
    col *= innerEdge;
    
    // Final Black Hole shadow
    col = mix(col, vec3(0.0), eventHorizon);
    
    // Add gravitational lensing / star distortion (Subtle background glow)
    float glow = 0.05 / (r - bhRadius + 0.05);
    col += vec3(0.1, 0.2, 0.5) * glow * smoothstep(0.0, 0.5, r - bhRadius);

    // Vignette for dramatic effect
    float vignette = smoothstep(1.5, 0.5, r);
    col *= vignette;

    gl_FragColor = vec4(col, 1.0);
}
`;

// Create the custom ShaderMaterial
const BlackHoleMaterial = shaderMaterial(
    { uTime: 0, uResolution: new THREE.Vector2() },
    vertexShader,
    fragmentShader
);

// Extend Three.js with the custom material
extend({ BlackHoleMaterial });

// Add type for the custom element
declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
        interface IntrinsicElements {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            blackHoleMaterial: any;
        }
    }
}

function Scene() {
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
        }
    });

    return (
        <mesh position={[0, 0, 0]}>
            <planeGeometry args={[2, 2]} />
            {/* 
        // @ts-ignore */}
            <blackHoleMaterial ref={materialRef} transparent />
        </mesh>
    );
}

export function BlackHoleBackground() {
    return (
        <div className="fixed inset-0 -z-10 bg-black">
            <Canvas
                camera={{ position: [0, 0, 1] }}
                gl={{ alpha: false, antialias: false }}
                dpr={[1, 2]}
            >
                <Scene />
            </Canvas>
        </div>
    );
}
