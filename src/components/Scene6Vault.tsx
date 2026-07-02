import { useState, useRef } from 'react';
import gsap from 'gsap';
import { Canvas, useFrame } from '@react-three/fiber';
import { Center } from '@react-three/drei';
import * as THREE from 'three';

function Rings({ unlocked }: { unlocked: boolean }) {
  const group1 = useRef<THREE.Group>(null);
  const group2 = useRef<THREE.Group>(null);
  const group3 = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!unlocked) {
      if (group1.current) group1.current.rotation.z = state.clock.elapsedTime * 0.2;
      if (group2.current) group2.current.rotation.z = -state.clock.elapsedTime * 0.3;
      if (group3.current) group3.current.rotation.z = state.clock.elapsedTime * 0.5;
    } else {
      // Lock into place
      if (group1.current) {
        gsap.to(group1.current.rotation, { z: 0, duration: 1.5, ease: "back.out(1.5)" });
      }
      if (group2.current) {
        gsap.to(group2.current.rotation, { z: 0, duration: 1.5, ease: "back.out(1.5)" });
      }
      if (group3.current) {
        gsap.to(group3.current.rotation, { z: 0, duration: 1.5, ease: "back.out(1.5)" });
      }
    }
  });

  return (
    <group rotation={[Math.PI / 4, Math.PI / 4, 0]}>
      <group ref={group1}>
        <mesh>
          <torusGeometry args={[2, 0.05, 16, 100]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Notch */}
        <mesh position={[0, 2, 0]}>
          <boxGeometry args={[0.2, 0.2, 0.2]} />
          <meshStandardMaterial color="#F3E5AB" metalness={1} />
        </mesh>
      </group>
      
      <group ref={group2}>
        <mesh>
          <torusGeometry args={[1.5, 0.05, 16, 100]} />
          <meshStandardMaterial color="#AA7C11" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, -1.5, 0]}>
          <boxGeometry args={[0.2, 0.2, 0.2]} />
          <meshStandardMaterial color="#F3E5AB" metalness={1} />
        </mesh>
      </group>

      <group ref={group3}>
        <mesh>
          <torusGeometry args={[1, 0.05, 16, 100]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[1, 0, 0]}>
          <boxGeometry args={[0.2, 0.2, 0.2]} />
          <meshStandardMaterial color="#F3E5AB" metalness={1} />
        </mesh>
      </group>
    </group>
  );
}

export default function Scene6Vault() {
  const [unlocked, setUnlocked] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);

  const handleUnlock = () => {
    if (unlocked) return;
    setUnlocked(true);
    
    setTimeout(() => {
      if (messageRef.current) {
        gsap.fromTo(messageRef.current,
          { opacity: 0, scale: 0.8, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 1, ease: "back.out(1.2)" }
        );
      }
    }, 1500); // Wait for rings to align
  };

  return (
    <div id="scene6" className="min-h-[80vh] flex flex-col items-center justify-center relative my-20">
      
      {!unlocked && (
        <div className="absolute top-0 right-10 md:right-32 cursor-pointer z-20 group" onClick={handleUnlock}>
          <div className="w-4 h-4 rotate-45 bg-gold-400 group-hover:bg-gold-300 transition-colors shadow-[0_0_15px_rgba(212,175,55,0.8)] animate-pulse"></div>
          <div className="absolute -inset-2 border border-gold-400 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500 rounded-full"></div>
        </div>
      )}

      {unlocked && (
        <div className="w-full h-96 relative">
          <Canvas camera={{ position: [0, 0, 6] }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <Center>
              <Rings unlocked={unlocked} />
            </Center>
          </Canvas>

          <div 
            ref={messageRef} 
            className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0"
          >
            <div className="bg-charcoal-900/80 backdrop-blur-md p-8 border border-gold-500/30 rounded-lg max-w-md text-center">
              <h3 className="font-serif text-2xl text-gold-300 mb-4">A Secret Gift</h3>
              <p className="font-sans text-sm text-gold-400/80 leading-relaxed">
                "Keep shining, keep growing. The best is yet to come."
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
