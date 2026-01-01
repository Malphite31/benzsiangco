import React, { useEffect, useRef } from 'react';
import { Video, Zap, Layers, BadgeCheck } from 'lucide-react';
import { PORTFOLIO_DATA } from '../constants';

export const About: React.FC = () => {
  const paralaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!paralaxRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * -15;
      const y = (e.clientY / window.innerHeight - 0.5) * -15;
      paralaxRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const pillars = [
    { icon: Video, title: 'NARRATIVE', desc: 'STORY' },
    { icon: Layers, title: 'VFX', desc: 'COMP' },
    { icon: Zap, title: 'RETENTION', desc: 'HOOKS' }
  ];

  return (
    <section id="about" className="py-12 md:py-32 bg-[#020617] relative">
      <div className="container mx-auto px-4 relative z-10">

        {/* Main Ultra-Rounded Glass Card */}
        <div className="bg-[#0a101f]/80 backdrop-blur-3xl rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-14 lg:p-20 border border-white/5 relative overflow-hidden shadow-3xl flex flex-col items-center">

          {/* Decorative Glows */}
          <div ref={paralaxRef} className="absolute inset-0 pointer-events-none opacity-30">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px]"></div>
          </div>

          <div className="relative z-10 w-full">
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center lg:items-start">

              {/* Profile Image - Perfectly Centered on Mobile */}
              <div className="w-full max-w-[220px] md:max-w-[400px] shrink-0 mx-auto lg:mx-0">
                <div className="relative animate-float">
                  <div className="absolute -inset-2 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 rounded-[2.5rem] md:rounded-[4rem] blur-2xl opacity-40"></div>
                  <div className="relative z-10 aspect-square rounded-[2.2rem] md:rounded-[3.8rem] overflow-hidden border border-white/10 shadow-2xl p-1.5 md:p-2 bg-[#020617]">
                    <div className="w-full h-full rounded-[1.8rem] md:rounded-[3.4rem] overflow-hidden relative bg-gradient-to-br from-blue-900/40 to-indigo-950">
                      <img
                        src="/hero-img.png"
                        alt="Benz Siangco"
                        className="w-full h-full object-cover object-top"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-950/60 via-transparent to-transparent"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Column */}
              <div className="flex-1 w-full text-center lg:text-left mt-6 lg:mt-0">
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                  <BadgeCheck className="w-4 h-4 text-blue-500" />
                  <span className="text-blue-400 font-black text-[9px] uppercase tracking-[0.4em]">EXPERT EDITOR</span>
                </div>

                <h2 className="text-[2.5rem] md:text-8xl font-bold text-white leading-[1.1] mb-6 tracking-tighter uppercase px-2 sm:px-0">
                  Workflow <span className="instrument-serif text-blue-500 italic font-normal normal-case block sm:inline">Essential</span>
                </h2>

                <p className="text-slate-400 text-sm md:text-xl font-medium leading-relaxed mb-8 md:mb-10 opacity-70 max-w-xl mx-auto lg:mx-0 px-4 lg:px-0">
                  {PORTFOLIO_DATA.aboutText}
                </p>

                {/* Grid Bio Cards - Now Balanced for Mobile */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5 mb-10">
                  {PORTFOLIO_DATA.longBio.split('\n').filter(p => p.trim()).map((paragraph, idx) => (
                    <div key={idx} className="p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-white/[0.03] border border-white/[0.05] text-left lg:text-left shadow-lg">
                      <p className="text-slate-400 text-[11px] md:text-sm leading-relaxed">{paragraph}</p>
                    </div>
                  ))}
                </div>

                {/* Mastery Pillars - Symmetrical Grid for Mobile */}
                <div className="grid grid-cols-3 lg:flex lg:flex-row gap-4 md:gap-12 pt-8 border-t border-white/5 w-full">
                  {pillars.map((item, i) => (
                    <div key={i} className="flex flex-col items-center lg:items-start text-center lg:text-left">
                      <div className="w-9 h-9 md:w-12 md:h-12 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500 border border-blue-500/10 mb-2">
                        <item.icon size={16} />
                      </div>
                      <div>
                        <h4 className="text-white font-black text-[8px] md:text-[10px] uppercase tracking-wider mb-0.5">{item.title}</h4>
                        <p className="text-slate-600 text-[6px] md:text-[8px] font-black uppercase tracking-widest">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};