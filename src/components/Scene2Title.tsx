import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { CONFIG } from '../config';

export default function Scene2Title() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgTextRef = useRef<SVGTextElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const flareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top center",
          end: "bottom center",
          toggleActions: "play none none reverse"
        }
      });

      // SVG path writing effect is complex without converting fonts to paths.
      // Alternatively, we use stroke-dashoffset on text element.
      tl.fromTo(svgTextRef.current,
        { strokeDasharray: 500, strokeDashoffset: 500, fill: "rgba(212,175,55,0)" },
        { strokeDashoffset: 0, duration: 2, ease: "power2.inOut" }
      )
      .to(svgTextRef.current, {
        fill: "rgba(212,175,55,1)",
        duration: 1,
        ease: "power2.out"
      }, "-=0.5")
      // Name slams down
      .fromTo(nameRef.current,
        { y: -100, scale: 1.2, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 1.2, ease: "elastic.out(1, 0.4)" },
        "-=0.8"
      )
      // Light flare sweep across the text
      .fromTo(flareRef.current,
        { x: '-100%', opacity: 0 },
        { x: '200%', opacity: 0.8, duration: 1.5, ease: "power2.inOut" },
        "-=1"
      )
      .to(flareRef.current, { opacity: 0, duration: 0.2 }, "-=0.5");

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-[100vh] flex flex-col items-center justify-center relative px-4">
      <div className="relative mb-8 text-center max-w-4xl">
        <svg viewBox="0 0 800 120" className="w-full max-w-2xl mx-auto h-auto overflow-visible">
          <text
            ref={svgTextRef}
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            stroke="var(--color-gold-400)"
            strokeWidth="1.5"
            className="font-serif text-5xl md:text-7xl uppercase tracking-[0.2em]"
          >
            Happy Birthday
          </text>
        </svg>
      </div>

      <div className="relative overflow-hidden pt-4 pb-8">
        <h1 
          ref={nameRef}
          className="font-sans font-medium text-4xl md:text-7xl lg:text-8xl text-center uppercase tracking-widest text-gold-300 drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]"
        >
          {CONFIG.name}
        </h1>
        {/* Flare sweep element */}
        <div 
          ref={flareRef}
          className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-transparent via-white to-transparent mix-blend-overlay -skew-x-12 opacity-0 pointer-events-none transform -translate-x-full"
        />
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
        <div className="w-[1px] h-12 bg-gradient-to-b from-gold-400 to-transparent mx-auto"></div>
      </div>
    </div>
  );
}
