import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import { CONFIG } from '../config';

export default function Scene4Cake() {
  const containerRef = useRef<HTMLDivElement>(null);
  const flamesRef = useRef<(SVGPathElement | null)[]>([]);
  const smokeRef = useRef<(SVGPathElement | null)[]>([]);
  const [extinguished, setExtinguished] = useState(false);

  useEffect(() => {
    // Initial flame flicker animation loop
    if (extinguished) return;

    const ctx = gsap.context(() => {
      flamesRef.current.forEach((flame, i) => {
        if (!flame) return;
        gsap.to(flame, {
          scaleY: 1.2 + Math.random() * 0.3,
          scaleX: 0.9 + Math.random() * 0.2,
          y: -2,
          rotation: (Math.random() - 0.5) * 5,
          duration: 0.1 + Math.random() * 0.1,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          transformOrigin: "bottom center"
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [extinguished]);

  const blowOutCandles = () => {
    if (extinguished) return;
    setExtinguished(true);

    const tl = gsap.timeline({
      onComplete: () => {
        triggerFireworks();
      }
    });

    // Extinguish flames staggered
    tl.to(flamesRef.current, {
      scale: 0,
      opacity: 0,
      duration: 0.2,
      stagger: 0.05,
      ease: "power2.in"
    });

    // Smoke wisps up
    tl.fromTo(smokeRef.current,
      { opacity: 0, y: 0, scale: 0.5 },
      { 
        opacity: 0.6, 
        y: -50, 
        scale: 1.5, 
        duration: 1.5, 
        stagger: 0.05, 
        ease: "power1.out" 
      },
      "-=0.5"
    );
    tl.to(smokeRef.current, {
      opacity: 0,
      duration: 1,
      stagger: 0.05
    }, "-=1");
  };

  const triggerFireworks = () => {
    // Camera shake
    gsap.to(containerRef.current, {
      keyframes: [
        { x: -15, y: -10, rotation: -1, duration: 0.05 },
        { x: 15, y: 10, rotation: 1, duration: 0.05 },
        { x: -10, y: 15, rotation: -0.5, duration: 0.05 },
        { x: 10, y: -10, rotation: 0.5, duration: 0.05 },
        { x: 0, y: 0, rotation: 0, duration: 0.05 }
      ],
      ease: "power1.inOut"
    });

    // Confetti / Fireworks
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 15,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#D4AF37', '#F3E5AB', '#AA7C11']
      });
      confetti({
        particleCount: 15,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#D4AF37', '#F3E5AB', '#AA7C11']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  // Generate 15 candles
  const candles = Array.from({ length: CONFIG.age }).map((_, i) => i);

  return (
    <div id="scene4" ref={containerRef} className="min-h-screen flex flex-col items-center justify-center relative cursor-pointer" onClick={blowOutCandles}>
      
      <div className="text-center mb-16" style={{ opacity: extinguished ? 0 : 1, transition: 'opacity 0.5s' }}>
        <p className="font-sans text-sm tracking-[0.2em] uppercase text-gold-400 animate-pulse">
          Make a wish and click
        </p>
      </div>

      <div className="relative w-80 h-40">
        {/* Cake Base */}
        <svg viewBox="0 0 320 160" className="w-full h-full overflow-visible">
          {/* Main cake body */}
          <rect x="40" y="80" width="240" height="80" fill="#111" stroke="#D4AF37" strokeWidth="2" rx="4" />
          <path d="M40 80 Q 160 90 280 80" fill="none" stroke="#D4AF37" strokeWidth="2" />
          
          {/* Icing drip */}
          <path d="M40 80 Q 60 100 80 80 Q 100 110 120 80 Q 140 95 160 80 Q 180 105 200 80 Q 220 95 240 80 Q 260 100 280 80" fill="#0a0a0a" stroke="#D4AF37" strokeWidth="2" />

          {/* Candles */}
          {candles.map((i) => {
            const x = 50 + (220 / (CONFIG.age - 1)) * i;
            return (
              <g key={`candle-${i}`}>
                {/* Candle stick */}
                <rect x={x - 2} y="30" width="4" height="50" fill="#222" stroke="#AA7C11" strokeWidth="1" />
                {/* Flame */}
                <path 
                  ref={(el) => { flamesRef.current[i] = el; }}
                  d={`M${x} 10 C${x-5} 20, ${x-3} 30, ${x} 30 C${x+3} 30, ${x+5} 20, ${x} 10 Z`} 
                  fill="#F3E5AB" 
                />
                {/* Smoke path (hidden initially) */}
                <path
                  ref={(el) => { smokeRef.current[i] = el; }}
                  d={`M${x} 30 Q ${x-10} 15 ${x+5} 0 Q ${x-5} -15 ${x+10} -30`}
                  fill="none"
                  stroke="#555"
                  strokeWidth="2"
                  strokeLinecap="round"
                  style={{ opacity: 0 }}
                />
              </g>
            );
          })}
        </svg>
      </div>

    </div>
  );
}
