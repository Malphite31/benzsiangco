import React, { useEffect, useRef } from 'react';
import { Video, Scissors, Layers, Zap, ArrowDown, PlayCircle } from 'lucide-react';
import { Button } from './Button';

const TextReveal = ({ text, mode = 'char', className = '', delay = 0, speed = 0.03 }: { text: string, mode?: 'char' | 'word', className?: string, delay?: number, speed?: number }) => {
  const items = mode === 'char' ? text.split('') : text.split(' ');
  return (
    <span className={className} aria-label={text}>
      {items.map((item, i) => (
        <span
          key={i}
          className="inline-block opacity-0 animate-apple-reveal"
          style={{
            animationDelay: `${delay + (i * speed)}s`,
            whiteSpace: 'pre'
          }}
        >
          {item}{mode === 'word' && i < items.length - 1 ? ' ' : ''}
        </span>
      ))}
    </span>
  );
};

export const Hero: React.FC = () => {
  const paralaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!paralaxRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 15;
      const y = (e.clientY / window.innerHeight - 0.5) * 15;
      paralaxRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center bg-[#020617] overflow-hidden pt-32 md:pt-40">
      {/* Background Decor */}
      <div ref={paralaxRef} className="parallax-bg transition-transform duration-500 ease-out will-change-transform">
        <div className="absolute inset-0 hero-grid" style={{
          maskImage: 'linear-gradient(to bottom, black 20%, transparent 95%), radial-gradient(circle at center, black 40%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 20%, transparent 95%), radial-gradient(circle at center, black 40%, transparent 100%)',
          WebkitMaskComposite: 'destination-in'
        }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] md:w-[1500px] h-[800px] md:h-[1400px] bg-blue-600/[0.15] rounded-full blur-[120px] md:blur-[180px] pointer-events-none"></div>

        {/* Corner Ambient Glows - Boosted Visibility */}
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-blue-600/[0.25] rounded-full blur-[140px] pointer-events-none mix-blend-screen"></div>
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-cyan-500/[0.25] rounded-full blur-[140px] pointer-events-none mix-blend-screen"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 mb-8 md:mb-10 px-5 py-2.5 rounded-full border border-blue-500/20 bg-blue-500/5 backdrop-blur-xl animate-apple-reveal shadow-[0_0_20px_rgba(59,130,246,0.1)]">
          <Zap className="w-3 h-3 text-blue-400 fill-blue-400" />
          <span className="text-blue-300 text-[8px] md:text-[10px] font-black tracking-[0.5em] uppercase">Ready for Capture</span>
        </div>

        {/* Premium Headline */}
        <h1 className="text-[3.2rem] sm:text-6xl md:text-[7.5rem] lg:text-[100px] font-bold tracking-tight mb-8 md:mb-10 leading-[0.9] text-white group pointer-events-none">
          <TextReveal text="Editing Videos" delay={0.1} /> <br className="hidden md:block" />
          <TextReveal text="that Go " delay={0.5} />
          <span className="instrument-serif text-blue-500 italic font-normal normal-case group-hover:text-blue-400 transition-colors duration-700">
            <TextReveal text="Viral" delay={0.8} />
          </span>
        </h1>

        {/* Cinematic Subtext */}
        <p className="text-slate-400 text-sm md:text-xl lg:text-2xl font-medium max-w-xl md:max-w-3xl mb-12 md:mb-16 opacity-100 leading-relaxed mx-auto px-6">
          <TextReveal text="Transforming raw footage into scroll-stopping stories. I engineer " mode="word" delay={1.0} speed={0.05} />
          <span className="text-white">
            <TextReveal text="attention and retention" mode="word" delay={1.4} speed={0.05} />
          </span>
          <TextReveal text=" through high-end cinematic editing." mode="word" delay={1.6} speed={0.05} />
        </p>

        {/* Action Buttons - Size Fixed */}
        <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-8 mb-20 md:mb-24 w-full sm:w-auto px-8 sm:px-0 opacity-0 animate-apple-reveal" style={{ animationDelay: '1.8s' }}>
          <Button
            variant="primary"
            className="w-full sm:w-auto"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            START YOUR PROJECT
          </Button>
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            icon={<PlayCircle size={18} className="text-blue-500" />}
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
          >
            EXPLORE WORKS
          </Button>
        </div>

        {/* Subtle Brand Elements */}
        <div className="flex items-center gap-10 md:gap-20 text-slate-600 opacity-60 mt-auto pb-10 opacity-0 animate-apple-reveal" style={{ animationDelay: '2s' }}>
          <div className="group transition-all hover:opacity-100 hover:scale-110">
            <Video size={18} className="md:w-8 md:h-8 transition-colors group-hover:text-blue-500" />
          </div>
          <div className="group transition-all hover:opacity-100 hover:scale-110">
            <Scissors size={18} className="md:w-8 md:h-8 transition-colors group-hover:text-blue-500" />
          </div>
          <div className="group transition-all hover:opacity-100 hover:scale-110">
            <Layers size={18} className="md:w-8 md:h-8 transition-colors group-hover:text-blue-500" />
          </div>
          <div className="group transition-all hover:opacity-100 hover:scale-110">
            <Zap size={18} className="md:w-8 md:h-8 transition-colors group-hover:text-blue-500" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-20 hidden lg:block">
        <ArrowDown className="w-8 h-8 text-white" />
      </div>
    </section>
  );
};