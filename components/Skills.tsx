import React, { useEffect, useRef } from 'react';
import { Cpu, Layers, Volume2, Sparkles } from 'lucide-react';
import { SKILLS } from '../constants';

export const Skills: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0', 'blur-0');
            entry.target.classList.remove('opacity-0', 'translate-y-10', 'blur-sm');
          }
        });
      },
      { threshold: 0.1 }
    );

    const cards = containerRef.current?.querySelectorAll('.skill-card');
    cards?.forEach((card, index) => {
      // Add staggered delay
      (card as HTMLElement).style.transitionDelay = `${index * 50}ms`;
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  const getToolConfig = (name: string) => {
    switch (name.toLowerCase()) {
      case 'after effects':
        return { icon: 'Ae', color: 'text-[#9b8df2]', glow: 'shadow-[0_0_30px_-5px_rgba(155,141,242,0.3)]', border: 'border-[#9b8df2]/20' };
      case 'premiere pro':
        return { icon: 'Pr', color: 'text-[#9999ff]', glow: 'shadow-[0_0_30px_-5px_rgba(153,153,255,0.3)]', border: 'border-[#9999ff]/20' };
      case 'photoshop':
        return { icon: 'Ps', color: 'text-[#31a8ff]', glow: 'shadow-[0_0_30px_-5px_rgba(49,168,255,0.3)]', border: 'border-[#31a8ff]/20' };
      case 'illustrator':
        return { icon: 'Ai', color: 'text-[#ff9a00]', glow: 'shadow-[0_0_30px_-5px_rgba(255,154,0,0.3)]', border: 'border-[#ff9a00]/20' };
      default:
        return { icon: <Cpu size={20} />, color: 'text-blue-400', glow: 'shadow-[0_0_30px_-5px_rgba(96,165,250,0.3)]', border: 'border-blue-400/20' };
    }
  };

  return (
    <section id="skills" className="relative py-16 md:py-24 bg-[#020617] overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10" ref={containerRef}>

        {/* Section Header */}
        <div className="flex flex-col items-center justify-center text-center mb-10 md:mb-16">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
            <Sparkles size={12} className="text-blue-400" />
            <span className="text-[10px] font-bold tracking-[0.3em] text-slate-300 uppercase">My Arsenal</span>
          </div>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tighter mb-4 leading-[0.9]">
            TECHNICAL <br />
            <span className="instrument-serif italic font-normal text-blue-500">Proficiency</span>
          </h2>

          <p className="max-w-md text-slate-400 text-xs md:text-sm leading-relaxed font-medium">
            A curated suite of high-precision tools for crafting award-winning digital narratives.
          </p>
        </div>

        {/* Skills Grid - Balanced 3-Column Layout */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5 max-w-5xl mx-auto">
          {SKILLS.map((skill) => {
            const config = getToolConfig(skill.name);
            return (
              <div
                key={skill.name}
                className="skill-card group relative p-5 md:p-6 rounded-[1.5rem] bg-[#0f172a]/40 border border-white/5 hover:border-white/10 transition-all duration-700 opacity-0 translate-y-10 blur-sm hover:-translate-y-2"
              >
                {/* Hover Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[1.5rem]" />

                <div className="relative z-10 flex flex-col items-center text-center">
                  {/* Icon Container - Smaller */}
                  <div className={`w-12 h-12 md:w-16 md:h-16 mb-4 rounded-xl bg-[#020617] border border-white/10 flex items-center justify-center text-xl md:text-2xl font-bold ${config.color} ${config.glow} shadow-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                    {config.icon}
                  </div>

                  {/* Text Content */}
                  <h3 className="text-xs md:text-sm font-bold text-white mb-2 uppercase tracking-wide group-hover:text-blue-400 transition-colors">
                    {skill.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[9px] md:text-[10px] font-bold text-slate-500 bg-white/5 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {skill.level}% Mastery
                    </span>
                  </div>

                  {/* Progress Line */}
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-current ${config.color} transition-all duration-1000 ease-out`}
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
