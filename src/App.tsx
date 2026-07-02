/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Loader from './components/Loader';
import Invitation from './components/Invitation';
import MainExperience from './components/MainExperience';
import CustomCursor from './components/CustomCursor';
import BackgroundParticles from './components/BackgroundParticles';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [stage, setStage] = useState<'loading' | 'invitation' | 'main'>('loading');

  useEffect(() => {
    // Simulate initial asset loading for Scene 0
    const timer = setTimeout(() => {
      setStage('invitation');
    }, 4500); // Loader animation takes about 4s
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-charcoal-950 overflow-hidden font-sans text-gold-400 selection:bg-gold-500 selection:text-charcoal-950 cursor-none">
      <CustomCursor />
      <div className="film-grain"></div>
      
      {/* Global Particles behind everything */}
      <BackgroundParticles active={stage === 'main'} />

      {stage === 'loading' && <Loader />}
      
      {stage === 'invitation' && (
        <Invitation onOpen={() => setStage('main')} />
      )}
      
      {stage === 'main' && (
        <MainExperience />
      )}
    </div>
  );
}
