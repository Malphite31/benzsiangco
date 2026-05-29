import React, { useEffect, useState } from 'react';

export const ScrollIndicator: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const [isVisible, setIsVisible] = useState(false);

  const sections = [
    { id: 'hero', label: 'Top' },
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'contact', label: 'Contact' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      // Visible after scrolling 100px
      setIsVisible(window.scrollY > 100);

      // Scroll Progress calculation
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }

      // Check active section
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= window.innerHeight * 0.4) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={`fixed right-6 top-1/2 -translate-y-1/2 z-[100] hidden lg:flex flex-col items-center gap-6 pointer-events-none transition-all duration-700 ease-out-expo ${
      isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
    }`}>
      
      {/* Scroll track with filled progress */}
      <div className="relative w-[2px] h-32 bg-white/5 rounded-full overflow-hidden pointer-events-auto">
        <div 
          className="absolute top-0 left-0 w-full bg-blue-500 rounded-full transition-all duration-75 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
          style={{ height: `${scrollProgress}%` }}
        />
      </div>

      {/* Nav dots */}
      <div className="flex flex-col gap-5 pointer-events-auto">
        {sections.map((sec) => {
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => scrollTo(sec.id)}
              className="group relative flex items-center justify-center w-6 h-6 focus:outline-none"
              aria-label={`Scroll to ${sec.label}`}
            >
              {/* Dot visual */}
              <span className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                isActive 
                  ? 'bg-blue-400 scale-[1.5] shadow-[0_0_10px_rgba(96,165,250,0.8)]' 
                  : 'bg-slate-600 group-hover:bg-slate-400 group-hover:scale-125'
              }`} />

              {/* Tooltip */}
              <span className="absolute right-8 px-3 py-1.5 rounded-lg bg-slate-900 border border-white/5 text-[9px] font-black text-slate-300 uppercase tracking-widest opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-xl">
                {sec.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
