import { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Center, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

function GiftBox({ isOpened }: { isOpened: boolean }) {
  const group = useRef<THREE.Group>(null);
  const lid = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (group.current && !isOpened) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      group.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  useEffect(() => {
    if (isOpened && lid.current) {
      gsap.to(lid.current.position, { y: 2, duration: 1, ease: 'power2.out' });
      gsap.to(lid.current.rotation, { x: -Math.PI / 4, z: Math.PI / 8, duration: 1, ease: 'power2.out' });
      if (group.current) {
        gsap.to(group.current.rotation, { y: Math.PI * 2, duration: 2, ease: 'power3.inOut' });
      }
    }
  }, [isOpened]);

  return (
    <group ref={group} dispose={null}>
      {/* Box Base */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[2, 1, 2]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.1} metalness={0.8} />
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(2, 1, 2)]} />
          <lineBasicMaterial color="#D4AF37" linewidth={2} />
        </lineSegments>
      </mesh>
      
      {/* Lid */}
      <mesh ref={lid} position={[0, 0.05, 0]}>
        <boxGeometry args={[2.1, 0.2, 2.1]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.1} metalness={0.8} />
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(2.1, 0.2, 2.1)]} />
          <lineBasicMaterial color="#D4AF37" linewidth={2} />
        </lineSegments>
        
        {/* Ribbon cross */}
        <mesh position={[0, 0.11, 0]}>
          <boxGeometry args={[0.2, 0.02, 2.1]} />
          <meshStandardMaterial color="#D4AF37" metalness={1} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.11, 0]}>
          <boxGeometry args={[2.1, 0.02, 0.2]} />
          <meshStandardMaterial color="#D4AF37" metalness={1} roughness={0.2} />
        </mesh>
      </mesh>
    </group>
  );
}

export default function Invitation({ onOpen }: { onOpen: () => void }) {
  const [isOpened, setIsOpened] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (isOpened) return;
    setIsOpened(true);
    
    // Animate transition to main site
    if (lightRef.current && containerRef.current) {
      const tl = gsap.timeline({
        onComplete: onOpen
      });
      
      tl.to(lightRef.current, {
        opacity: 1,
        scale: 50,
        duration: 1.5,
        ease: 'power2.in',
        delay: 0.5
      })
      .to(containerRef.current, {
        opacity: 0,
        duration: 0.5
      }, "-=0.5");
    }
  };

  return (
    <div ref={containerRef} className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-charcoal-950">
      <div className="w-full h-[60vh] cursor-pointer" onClick={handleClick}>
        <Canvas camera={{ position: [0, 2, 5], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[5, 5, 5]} angle={0.15} penumbra={1} intensity={1} castShadow />
          <pointLight position={[-5, -5, -5]} intensity={0.5} />
          <Center>
            <GiftBox isOpened={isOpened} />
          </Center>
          {isOpened && (
            <Sparkles count={100} scale={5} size={4} speed={2} color="#D4AF37" />
          )}
        </Canvas>
      </div>
      
      <div className="mt-8 text-center" style={{ opacity: isOpened ? 0 : 1, transition: 'opacity 0.5s' }}>
        <p className="font-serif italic text-gold-400 text-xl tracking-widest cursor-pointer hover:text-gold-300 transition-colors" onClick={handleClick}>
          A Celebration Awaits
        </p>
        <p className="font-sans text-xs uppercase tracking-[0.3em] text-gray-500 mt-4">
          Click to Begin
        </p>
      </div>
      
      {/* Light Flood Element */}
      <div 
        ref={lightRef} 
        className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full bg-gold-300 blur-2xl opacity-0 pointer-events-none -translate-x-1/2 -translate-y-1/2 mix-blend-screen"
      />
    </div>
  );
}
