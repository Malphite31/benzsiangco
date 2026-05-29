import React, { useEffect, useState } from 'react';
import { Play, Sparkles } from 'lucide-react';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  const phases = [
    'Importing raw log footage...',
    'Analyzing frame composition...',
    'Syncing sound design spikes...',
    'Applying dynamic color grading...',
    'Calibrating narrative rhythm...',
    'Finalizing attention hook...',
    'Exporting viral timeline...'
  ];

  useEffect(() => {
    let start = Date.now();
    const duration = 1600; // 1.6s

    const update = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min(elapsed / duration, 1);
      
      // Curved progress speed
      const easedPct = Math.sin((pct * Math.PI) / 2);
      setProgress(Math.floor(easedPct * 100));

      // Phase changes
      const currentPhase = Math.floor(pct * (phases.length - 1));
      setPhaseIndex(currentPhase);

      if (pct < 1) {
        requestAnimationFrame(update);
      } else {
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(() => {
            onComplete();
          }, 600); // match CSS fade transition
        }, 300);
      }
    };

    requestAnimationFrame(update);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[99999] bg-[#020617] flex flex-col items-center justify-center transition-all duration-700 ease-out-expo ${
      fadeOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100'
    }`}>
      {/* Decorative Glow background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="relative flex flex-col items-center max-w-sm w-full px-6 text-center z-10">
        
        {/* Animated Brand Emblem */}
        <div className="mb-8 relative flex items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.15)] animate-pulse">
            <Play className="w-6 h-6 fill-blue-500/20 text-blue-400" />
          </div>
          <Sparkles className="w-4 h-4 text-blue-400 absolute -top-1 -right-1 animate-bounce" />
        </div>

        {/* Counter */}
        <div className="mb-4">
          <span className="text-5xl md:text-6xl font-black tracking-tighter text-white font-mono">
            {progress.toString().padStart(3, '0')}
            <span className="text-blue-500 text-3xl">%</span>
          </span>
        </div>

        {/* Dynamic task status */}
        <div className="h-6 mb-6">
          <p className="text-[10px] uppercase font-black tracking-[0.3em] text-blue-400/80 transition-all duration-300">
            {phases[phaseIndex]}
          </p>
        </div>

        {/* Render bar container */}
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full transition-all duration-75 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="mt-8 text-[8px] font-black uppercase tracking-[0.4em] text-slate-600">
          Render Timeline engine v1.0
        </span>
      </div>
    </div>
  );
};
