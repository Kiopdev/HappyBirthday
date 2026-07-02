import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { CONFIG } from '../config';

export default function Scene5Message() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pin the section
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=200%",
          pin: true,
          scrub: 1
        }
      });

      // We have multiple lines. We want a mask/spotlight to sweep down or reveal them one by one.
      const lines = gsap.utils.toArray('.message-line') as HTMLElement[];
      
      lines.forEach((line, i) => {
        // Spotlight effect via gradient mask or simple opacity + blur
        tl.fromTo(line,
          { opacity: 0, filter: 'blur(10px)', y: 20 },
          { opacity: 1, filter: 'blur(0px)', y: 0, duration: 1 },
          i * 0.5
        )
        .to(line, { opacity: 0.3, filter: 'blur(2px)', duration: 1 }, (i + 1) * 0.5 + 0.5);
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div id="scene5" ref={containerRef} className="h-screen flex items-center justify-center relative overflow-hidden bg-charcoal-950">
      
      {/* Background Parallax - basic CSS implementation for elegance */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute top-[10%] left-[20%] w-32 h-32 rounded-full bg-gold-500 blur-[100px]"></div>
        <div className="absolute bottom-[20%] right-[10%] w-48 h-48 rounded-full bg-gold-400 blur-[120px]"></div>
      </div>

      <div ref={textContainerRef} className="relative z-10 max-w-3xl px-6 text-center space-y-16">
        {CONFIG.messageLines.map((line, idx) => (
          <h2 
            key={idx} 
            className="message-line font-serif text-3xl md:text-5xl lg:text-6xl text-gold-300 leading-snug"
            style={{ opacity: 0 }}
          >
            {line}
          </h2>
        ))}
      </div>
      
    </div>
  );
}
