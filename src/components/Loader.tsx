import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { CONFIG } from '../config';

export default function Loader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const textRef = useRef<SVGTextElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // 1. Draw the path (abstract monogram representation)
      tl.fromTo(pathRef.current, 
        { strokeDasharray: 1000, strokeDashoffset: 1000 },
        { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut' }
      )
      // 2. Morph to text or fade text in
      .to(pathRef.current, { opacity: 0, duration: 0.5 }, "-=0.2")
      .fromTo(textRef.current, 
        { opacity: 0, scale: 0.8 }, 
        { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.5)' }, 
        "-=0.5"
      )
      // 3. Hold
      .to({}, { duration: 0.5 })
      // 4. Shatter/Suck in
      .to(textRef.current, { scale: 0, opacity: 0, rotation: 15, duration: 0.6, ease: 'power4.in' })
      // 5. Flash
      .fromTo(flashRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.2, ease: 'power2.in' }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 z-50 flex items-center justify-center bg-charcoal-950">
      <svg ref={svgRef} viewBox="0 0 200 200" className="w-48 h-48 overflow-visible">
        <path 
          ref={pathRef}
          d="M50,150 L100,50 L150,150 M100,50 L125,100 L75,100" 
          fill="none" 
          stroke="var(--color-gold-400)" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        <text
          ref={textRef}
          x="100"
          y="115"
          textAnchor="middle"
          fill="var(--color-gold-400)"
          className="font-serif text-6xl tracking-tighter"
          style={{ opacity: 0 }}
        >
          {CONFIG.monogram}
        </text>
      </svg>
      <div ref={flashRef} className="absolute inset-0 bg-gold-300 opacity-0 pointer-events-none mix-blend-overlay"></div>
    </div>
  );
}
