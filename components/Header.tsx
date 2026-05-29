import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header className="fixed top-2 md:top-6 left-0 right-0 z-50 flex justify-center px-4 md:px-6 pointer-events-none">
      <nav className={`flex items-center justify-between md:justify-start gap-4 md:gap-8 px-5 py-2 md:py-3 rounded-full border border-white/10 transition-all duration-700 w-full max-w-4xl pointer-events-auto ${isScrolled ? 'bg-slate-900/90 backdrop-blur-2xl shadow-2xl scale-[0.98]' : 'bg-slate-900/20 backdrop-blur-md'
        }`}>
        <a href="#hero" className="flex items-center md:pr-6 md:border-r border-white/10 shrink-0 gap-3">
          <div className="w-20 md:w-32 h-5 md:h-8 flex items-center justify-center transition-transform hover:scale-105 active:scale-95">
            <img src="/benzsiangco.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          {/* Audio Wave Visualizer */}
          <div className="flex items-end gap-[2px] h-3.5 w-4 pb-[1px]" title="Audio Timeline Active">
            <div className="w-[2px] h-3 bg-blue-500 rounded-full audio-bar" style={{ animationDelay: '0.1s' }} />
            <div className="w-[2px] h-3 bg-blue-400 rounded-full audio-bar" style={{ animationDelay: '0.4s' }} />
            <div className="w-[2px] h-3 bg-blue-500 rounded-full audio-bar" style={{ animationDelay: '0.2s' }} />
            <div className="w-[2px] h-3 bg-cyan-400 rounded-full audio-bar" style={{ animationDelay: '0.6s' }} />
          </div>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-slate-400 hover:text-blue-400 transition-all text-[11px] font-black uppercase tracking-[0.3em]"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Desktop Action & Mobile Toggle */}
        <div className="flex gap-2 items-center md:pl-6 md:border-l border-white/10 ml-auto">
          <a
            href="#contact"
            className="hidden sm:inline-block text-[10px] font-black px-6 py-2.5 rounded-full bg-blue-600 hover:bg-white hover:text-blue-600 text-white transition-all shadow-xl shadow-blue-600/20 uppercase tracking-widest whitespace-nowrap"
          >
            Get Started
          </a>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-white hover:bg-white/5 rounded-full transition-colors"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-950/98 backdrop-blur-3xl z-[60] md:hidden flex flex-col items-center justify-center gap-8 p-8 pointer-events-auto">
          <button onClick={() => setMobileMenuOpen(false)} className="absolute top-6 right-6 text-white p-2">
            <X size={24} />
          </button>
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-white text-2xl font-black uppercase tracking-[0.3em] hover:text-blue-500 transition-colors"
            >
              {link.name}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full text-center text-xs font-black py-4 bg-blue-600 rounded-2xl text-white uppercase tracking-widest shadow-2xl shadow-blue-600/30 mt-6"
          >
            Start Your Project
          </a>
        </div>
      )}
    </header>
  );
};