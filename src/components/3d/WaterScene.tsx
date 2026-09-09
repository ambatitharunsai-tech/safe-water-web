import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const vertexShader = `
  uniform float uTime;
  varying vec2 vUv;
  varying float vElevation;
  varying float vIsWaterfall;

  void main() {
    vUv = uv;
    vec3 pos = position;
    
    // Base flow speed (faster for a more animated river)
    float flow = uTime * 2.0;
    
    // Waterfall logic: if y < 2.0, we start dropping z
    float drop = 0.0;
    float isWaterfall = 0.0;
    
    if (pos.y < 4.0) {
        float fallDist = 4.0 - pos.y;
        drop = pow(fallDist, 1.8) * 1.5; // Curve the drop
        isWaterfall = smoothstep(0.0, 6.0, fallDist);
        flow += fallDist * uTime * 4.0; // Accelerate water heavily on the fall
    }
    
    // Combine sine waves for natural water ripples
    float elevation = sin(pos.x * 2.5 + flow) * 0.2;
    elevation += cos(pos.y * 2.5 + flow) * 0.2;
    
    // Apply displacement
    pos.z += elevation - drop;
    
    vElevation = elevation;
    vIsWaterfall = isWaterfall;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform vec3 uColorWater;
  uniform vec3 uColorDeep;
  uniform vec3 uColorFoam;
  
  varying float vElevation;
  varying float vIsWaterfall;
  varying vec2 vUv;

  void main() {
    // Base color mix based on elevation (deep vs shallow)
    vec3 color = mix(uColorDeep, uColorWater, (vElevation + 0.4) * 1.5);
    
    // Foam at the peaks of the ripples
    if (vElevation > 0.15) {
        float foamIntensity = (vElevation - 0.15) * 15.0;
        color = mix(color, uColorFoam, clamp(foamIntensity, 0.0, 1.0));
    }
    
    // Intense foam on the waterfall
    if (vIsWaterfall > 0.05) {
        // Create vertical streaks for the waterfall foam
        float streaks = sin(vUv.x * 100.0) * 0.5 + 0.5;
        float waterfallFoam = (sin(vUv.y * 60.0) + 1.0) * 0.5 * vIsWaterfall * streaks;
        
        if (vElevation > -0.1) {
            color = mix(color, uColorFoam, clamp(vIsWaterfall * 1.2 + streaks * 0.3, 0.0, 1.0));
        }
    }
    
    gl_FragColor = vec4(color, 0.95);
  }
`;

function RiverMesh() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorWater: { value: new THREE.Color('#0ea5e9') }, // Light blue
      uColorDeep: { value: new THREE.Color('#0369a1') },  // Dark blue
      uColorFoam: { value: new THREE.Color('#ffffff') },  // White foam
    }),
    []
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <group position={[0, -1, -8]} rotation={[-Math.PI / 2.3, 0, 0]}>
      {/* The River/Waterfall Plane */}
      <mesh>
        <planeGeometry args={[40, 50, 256, 256]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent={true}
        />
      </mesh>
      
      {/* Decorative Riverbanks */}
      <mesh position={[-18, 0, -5]}>
        <boxGeometry args={[6, 50, 15]} />
        <meshStandardMaterial color="#022c22" />
      </mesh>
      <mesh position={[18, 0, -5]}>
        <boxGeometry args={[6, 50, 15]} />
        <meshStandardMaterial color="#022c22" />
      </mesh>
    </group>
  );
}

export function WaterScene() {
  return (
    <div className="absolute inset-0 z-0 bg-slate-900 pointer-events-none">
      <Canvas camera={{ position: [0, 4, 12], fov: 45 }}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 20, 10]} intensity={1.5} color="#fde047" /> {/* Warm sunset light */}
        <directionalLight position={[-10, 5, 5]} intensity={0.5} color="#38bdf8" />
        
        <RiverMesh />
        
        {/* Floating droplets / particles around the waterfall */}
        <Sparkles count={300} scale={20} size={4} speed={0.5} opacity={0.6} color="#7dd3fc" position={[0, -2, -5]} />
        <Sparkles count={150} scale={15} size={2} speed={0.8} opacity={0.8} color="#fef08a" position={[0, 2, -2]} />
        
        <Environment preset="sunset" />
      </Canvas>
    </div>
  );
}
