"use client";

import React, { useRef } from "react";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";

// Fullscreen vertex shader
const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

// Fragment Shader — Flowing photon streams / light trails
const fragmentShader = `
uniform float uTime;
uniform vec2 uResolution;
varying vec2 vUv;

#define PI 3.14159265359

// --- Hash functions ---
float hash21(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float hash11(float n) {
    return fract(sin(n) * 43758.5453);
}

vec3 hash33(vec3 p) {
    p = vec3(
        dot(p, vec3(127.1, 311.7, 74.7)),
        dot(p, vec3(269.5, 183.3, 246.1)),
        dot(p, vec3(113.5, 271.9, 124.6))
    );
    return fract(sin(p) * 43758.5453);
}

float hash31(vec3 p) {
    return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
}

// --- 3D value noise ---
float vnoise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);

    return mix(
        mix(mix(hash31(i), hash31(i + vec3(1,0,0)), f.x),
            mix(hash31(i + vec3(0,1,0)), hash31(i + vec3(1,1,0)), f.x), f.y),
        mix(mix(hash31(i + vec3(0,0,1)), hash31(i + vec3(1,0,1)), f.x),
            mix(hash31(i + vec3(0,1,1)), hash31(i + vec3(1,1,1)), f.x), f.y),
        f.z
    );
}

// --- FBM ---
float fbm(vec3 p) {
    float f = 0.0;
    float amp = 0.5;
    mat3 rot = mat3(0.0, 0.8, 0.6, -0.8, 0.36, -0.48, -0.6, -0.48, 0.64);
    for (int i = 0; i < 5; i++) {
        f += amp * vnoise(p);
        p = rot * p * 2.02;
        amp *= 0.5;
    }
    return f;
}

// --- Single photon beam ---
// High-contrast, condensed beam with tight core and minimal spread
float photonBeam(vec2 uv, float time, float seed, float aspect) {
    // Slow, deliberate movement
    float speed = 0.02 + hash11(seed * 13.7) * 0.025;
    float yCenter = (hash11(seed * 7.3) - 0.5) * 1.6;
    float amplitude = 0.06 + hash11(seed * 23.1) * 0.12;
    float frequency = 0.25 + hash11(seed * 31.9) * 0.35;
    float phase = hash11(seed * 47.3) * PI * 2.0;
    // Very thin, condensed beam
    float thickness = 0.0015 + hash11(seed * 53.7) * 0.0025;

    // Slight angle variation
    float angle = (hash11(seed * 67.1) - 0.5) * 0.3;
    float ca = cos(angle);
    float sa = sin(angle);
    vec2 ruv = vec2(ca * uv.x + sa * uv.y, -sa * uv.x + ca * uv.y);

    // Gentle wavy path
    float wave1 = sin(ruv.x * frequency + phase + time * 0.06);
    float wave2 = sin(ruv.x * frequency * 1.7 + phase * 1.3 + time * 0.04) * 0.3;
    float curve = yCenter + amplitude * (wave1 + wave2);

    // Distance from the beam centerline
    float d = abs(ruv.y - curve);

    // Sharp bright core — high contrast, very tight falloff
    float core = exp(-d * d / (thickness * thickness));
    // Tiny close halo only — NOT wide spread
    float tightHalo = exp(-d * d / (thickness * 4.0));

    // Head position — slow traverse
    float headX = mod(time * speed + hash11(seed * 91.3), 1.0);
    headX = headX * (aspect * 2.0 + 3.0) - (aspect + 1.0);

    // Clean trail fade
    float trailLen = 0.5 + hash11(seed * 103.1) * 0.7;
    float headDist = ruv.x - headX;
    float trailFade = smoothstep(-trailLen, -0.02, headDist) * smoothstep(0.05, 0.0, headDist);

    // Core-dominant: bright center, barely any spread
    float beam = (core * 1.0 + tightHalo * 0.15) * trailFade;

    return beam;
}

void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    float aspect = uResolution.x / uResolution.y;
    uv.x *= aspect;

    float t = uTime;

    // === DEEP DARK BASE ===
    vec3 col = vec3(0.005, 0.005, 0.014);

    // === PHOTON BEAMS — high contrast, condensed, slow ===
    vec3 colors[8];
    colors[0] = vec3(0.0, 0.7, 0.9);     // Bright teal
    colors[1] = vec3(0.4, 0.15, 0.8);    // Vivid purple
    colors[2] = vec3(0.0, 0.8, 0.65);    // Cyan-green
    colors[3] = vec3(0.8, 0.35, 0.05);   // Bright amber
    colors[4] = vec3(0.15, 0.35, 0.85);  // Blue
    colors[5] = vec3(0.6, 0.1, 0.55);    // Magenta
    colors[6] = vec3(0.0, 0.6, 0.8);     // Ocean
    colors[7] = vec3(0.35, 0.1, 0.7);    // Violet

    for (int i = 0; i < 8; i++) {
        float fi = float(i);
        float intensity = photonBeam(uv, t, fi + 1.0, aspect);

        vec3 beamCol = colors[i];
        // White-hot core that transitions to color at edges
        vec3 photonColor = mix(beamCol, vec3(1.0), pow(intensity, 0.3) * 0.5);
        col += photonColor * intensity * 0.8;
    }

    // === STAR FIELD — sparse, tiny ===
    vec2 starUV = vUv * vec2(aspect, 1.0) * 130.0;
    vec2 starCell = floor(starUV);
    vec2 starLocal = fract(starUV) - 0.5;
    vec2 starPos = (hash33(vec3(starCell, 0.0)).xy - 0.5) * 0.8;
    float starDist = length(starLocal - starPos);
    float starBright = hash21(starCell);
    starBright = step(0.985, starBright) * (starBright - 0.985) * 66.0;
    float starVal = starBright * smoothstep(0.02, 0.001, starDist);
    starVal *= 0.75 + 0.25 * sin(t * 0.8 + hash21(starCell + 0.5) * 6.283);
    col += vec3(0.5, 0.55, 0.7) * starVal * 0.2;

    // === GENTLE VIGNETTE ===
    vec2 vigUV = vUv * 2.0 - 1.0;
    float vigDist = length(vigUV);
    col *= 1.0 - pow(vigDist * 0.45, 3.0) * 0.1;

    gl_FragColor = vec4(col, 1.0);
}
`;

// Create the custom ShaderMaterial
const PhotonMaterial = shaderMaterial(
    { uTime: 0, uResolution: new THREE.Vector2(1, 1) },
    vertexShader,
    fragmentShader
);

extend({ PhotonMaterial });

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
        interface IntrinsicElements {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            photonMaterial: any;
        }
    }
}

function Scene() {
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const { size } = useThree();

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
            materialRef.current.uniforms.uResolution.value.set(size.width, size.height);
        }
    });

    return (
        <mesh>
            <planeGeometry args={[2, 2]} />
            <photonMaterial ref={materialRef} />
        </mesh>
    );
}

export function BlackHoleBackground() {
    return (
        <div className="fixed inset-0 -z-10 bg-black">
            <Canvas
                gl={{ alpha: false, antialias: false }}
                dpr={[1, 1.5]}
            >
                <Scene />
            </Canvas>
        </div>
    );
}
