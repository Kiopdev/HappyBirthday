import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { CONFIG } from '../config';

export default function Scene3Age() {
  const containerRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
          toggleActions: "play none none reverse"
        }
      });

      // 1. Number builds up / converges
      tl.fromTo(numberRef.current,
        { scale: 3, opacity: 0, filter: 'blur(20px)', rotationX: 45 },
        { 
          scale: 1, 
          opacity: 1, 
          filter: 'blur(0px)', 
          rotationX: 0, 
          duration: 1.5, 
          ease: "expo.out",
          onComplete: () => {
            // Screen shake effect on container using keyframes
            gsap.to(containerRef.current, {
              keyframes: [
                { x: -10, y: -5, duration: 0.05 },
                { x: 10, y: 5, duration: 0.05 },
                { x: -5, y: 10, duration: 0.05 },
                { x: 5, y: -5, duration: 0.05 },
                { x: 0, y: 0, duration: 0.05 }
              ],
              ease: "power1.inOut"
            });
          }
        }
      )
      // 2. Label fades in
      .fromTo(labelRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
        "-=0.5"
      )
      // 3. Line draws
      .fromTo(lineRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 1, ease: "power3.inOut" },
        "-=0.8"
      );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div id="scene3" ref={containerRef} className="min-h-screen flex flex-col items-center justify-center relative perspective-[1000px]">
      <div 
        ref={numberRef}
        className="text-[15rem] md:text-[25rem] font-serif font-bold text-gold-400 leading-none drop-shadow-[0_20px_50px_rgba(212,175,55,0.3)] select-none"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {CONFIG.age}
      </div>
      
      <div className="relative mt-8 text-center">
        <p ref={labelRef} className="font-sans text-2xl md:text-4xl tracking-[0.3em] uppercase text-gold-300">
          Turning {CONFIG.age}
        </p>
        <div 
          ref={lineRef}
          className="h-[2px] bg-gold-400 w-full mt-4 transform origin-left"
        ></div>
      </div>
    </div>
  );
}
