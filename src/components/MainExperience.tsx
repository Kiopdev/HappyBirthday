import { useEffect, useRef } from 'react';
import Scene2Title from './Scene2Title';
import Scene3Age from './Scene3Age';
import Scene4Cake from './Scene4Cake';
import Scene5Message from './Scene5Message';
import Scene6Vault from './Scene6Vault';
import Scene7Closing from './Scene7Closing';

export default function MainExperience() {
  const containerRef = useRef<HTMLDivElement>(null);

  // We rely on ScrollTrigger internally in the sub-components to handle animations.
  // The structure is stacked vertically.

  return (
    <div ref={containerRef} className="w-full relative z-10 text-gold-400">
      <Scene2Title />
      <Scene3Age />
      <Scene4Cake />
      <Scene5Message />
      <Scene6Vault />
      <Scene7Closing />
    </div>
  );
}
