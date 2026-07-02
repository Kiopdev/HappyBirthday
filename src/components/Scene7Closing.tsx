import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { CONFIG } from '../config';
import { Volume2, VolumeX } from 'lucide-react';

export default function Scene7Closing() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const [muted, setMuted] = useState(true);

  // In a real app we'd attach an audio element. For now, we'll just toggle state for UI.

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
          toggleActions: "play none none reverse"
        }
      });

      // Scale-out effect on the container to simulate camera pull-back
      tl.fromTo(containerRef.current,
        { scale: 1.2, opacity: 0 },
        { scale: 1, opacity: 1, duration: 2, ease: "power2.out" }
      )
      // Reveal text
      .fromTo(textRef.current,
        { opacity: 0, y: 30, filter: 'blur(10px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.5, ease: "power2.out" },
        "-=0.5"
      );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div id="scene7" ref={containerRef} className="h-screen flex flex-col items-center justify-center relative overflow-hidden bg-charcoal-950">
      
      {/* Ambient glowing orb in the center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] rounded-full bg-gold-500/10 blur-[100px] animate-pulse pointer-events-none"></div>

      <div className="relative z-10 max-w-4xl px-8 text-center">
        <h2 
          ref={textRef}
          className="font-serif italic text-3xl md:text-5xl lg:text-6xl text-gold-300 font-light leading-relaxed"
          style={{ opacity: 0 }}
        >
          {CONFIG.closing}
        </h2>
      </div>

      <div className="absolute bottom-10 right-10 z-50">
        <button 
          onClick={() => setMuted(!muted)}
          className="text-gold-400 hover:text-gold-300 transition-colors p-3 border border-gold-400/30 rounded-full bg-charcoal-900/50 backdrop-blur-md cursor-pointer"
        >
          {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>

    </div>
  );
}
