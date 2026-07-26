"use client";

import React, { useRef } from "react";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import { useTheme } from "next-themes";

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
uniform float uIsDark;
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

// --- Single photon beam ---
float photonBeam(vec2 uv, float time, float seed, float aspect) {
    float speed = 0.02 + hash11(seed * 13.7) * 0.025;
    float yCenter = (hash11(seed * 7.3) - 0.5) * 1.6;
    float amplitude = 0.06 + hash11(seed * 23.1) * 0.12;
    float frequency = 0.25 + hash11(seed * 31.9) * 0.35;
    float phase = hash11(seed * 47.3) * PI * 2.0;
    float thickness = 0.0015 + hash11(seed * 53.7) * 0.0025;

    float angle = (hash11(seed * 67.1) - 0.5) * 0.3;
    float ca = cos(angle);
    float sa = sin(angle);
    vec2 ruv = vec2(ca * uv.x + sa * uv.y, -sa * uv.x + ca * uv.y);

    float wave1 = sin(ruv.x * frequency + phase + time * 0.06);
    float wave2 = sin(ruv.x * frequency * 1.7 + phase * 1.3 + time * 0.04) * 0.3;
    float curve = yCenter + amplitude * (wave1 + wave2);

    float d = abs(ruv.y - curve);

    float core = exp(-d * d / (thickness * thickness));
    float tightHalo = exp(-d * d / (thickness * 4.0));

    float headX = mod(time * speed + hash11(seed * 91.3), 1.0);
    headX = headX * (aspect * 2.0 + 3.0) - (aspect + 1.0);

    float trailLen = 0.5 + hash11(seed * 103.1) * 0.7;
    float headDist = ruv.x - headX;
    float trailFade = smoothstep(-trailLen, -0.02, headDist) * smoothstep(0.05, 0.0, headDist);

    float beam = (core * 1.0 + tightHalo * 0.15) * trailFade;

    return beam;
}

void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    float aspect = uResolution.x / uResolution.y;
    uv.x *= aspect;

    float t = uTime;

    // === BASE COLOR — depends on mode ===
    vec3 darkBase = vec3(0.005, 0.005, 0.014);
    vec3 lightBase = vec3(0.96, 0.96, 0.97);
    vec3 col = mix(lightBase, darkBase, uIsDark);

    // === PHOTON BEAMS ===
    vec3 darkColors[8];
    darkColors[0] = vec3(0.0, 0.7, 0.9);     // Bright teal
    darkColors[1] = vec3(0.4, 0.15, 0.8);    // Vivid purple
    darkColors[2] = vec3(0.0, 0.8, 0.65);    // Cyan-green
    darkColors[3] = vec3(0.8, 0.35, 0.05);   // Bright amber
    darkColors[4] = vec3(0.15, 0.35, 0.85);  // Blue
    darkColors[5] = vec3(0.6, 0.1, 0.55);    // Magenta
    darkColors[6] = vec3(0.0, 0.6, 0.8);     // Ocean
    darkColors[7] = vec3(0.35, 0.1, 0.7);    // Violet

    vec3 lightColors[8];
    lightColors[0] = vec3(0.0, 0.5, 0.65);   // Rich teal
    lightColors[1] = vec3(0.4, 0.2, 0.7);    // Rich purple
    lightColors[2] = vec3(0.0, 0.55, 0.45);   // Sage green
    lightColors[3] = vec3(0.75, 0.35, 0.05);  // Warm amber
    lightColors[4] = vec3(0.15, 0.35, 0.7);   // Rich blue
    lightColors[5] = vec3(0.55, 0.15, 0.5);   // Magenta
    lightColors[6] = vec3(0.0, 0.45, 0.6);    // Ocean
    lightColors[7] = vec3(0.35, 0.15, 0.6);   // Violet

    for (int i = 0; i < 8; i++) {
        float fi = float(i);
        float intensity = photonBeam(uv, t, fi + 1.0, aspect);

        if (uIsDark > 0.5) {
            vec3 beamCol = darkColors[i];
            vec3 photonColor = mix(beamCol, vec3(1.0), pow(intensity, 0.3) * 0.5);
            col += photonColor * intensity * 0.8;
        } else {
            vec3 beamCol = lightColors[i];
            col = mix(col, beamCol, intensity * 0.18);
        }
    }

    // === STAR FIELD — dark mode only ===
    if (uIsDark > 0.5) {
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
    }

    // === GENTLE VIGNETTE ===
    vec2 vigUV = vUv * 2.0 - 1.0;
    float vigDist = length(vigUV);
    float vigStrength = mix(0.03, 0.1, uIsDark);
    col *= 1.0 - pow(vigDist * 0.45, 3.0) * vigStrength;

    gl_FragColor = vec4(col, 1.0);
}
`;

// Create the custom ShaderMaterial
const PhotonMaterial = shaderMaterial(
    { uTime: 0, uResolution: new THREE.Vector2(1, 1), uIsDark: 1.0 },
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

function Scene({ isDark }: { isDark: boolean }) {
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const { size } = useThree();
    const targetIsDark = useRef(isDark ? 1.0 : 0.0);

    targetIsDark.current = isDark ? 1.0 : 0.0;

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
            materialRef.current.uniforms.uResolution.value.set(size.width, size.height);
            const current = materialRef.current.uniforms.uIsDark.value;
            materialRef.current.uniforms.uIsDark.value += (targetIsDark.current - current) * 0.05;
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
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';

    return (
        <div className={`fixed inset-0 -z-10 ${isDark ? 'bg-black' : 'bg-[#f5f5f7]'}`}>
            <Canvas
                gl={{ alpha: false, antialias: false }}
                dpr={[1, 1.5]}
            >
                <Scene isDark={isDark} />
            </Canvas>
        </div>
    );
}
