import React from 'react';
import { PORTFOLIO_DATA } from '../constants';

export const Footer: React.FC = () => {
  const socials = [
    { name: 'Upwork', url: PORTFOLIO_DATA.socials.upwork },
    { name: 'LinkedIn', url: PORTFOLIO_DATA.socials.linkedin },
    { name: 'TikTok', url: PORTFOLIO_DATA.socials.tiktok },
    { name: 'OnlineJobs', url: PORTFOLIO_DATA.socials.onlinejobs },
    { name: 'GitHub', url: PORTFOLIO_DATA.socials.github }
  ];

  return (
    <footer className="bg-slate-950 py-20 border-t border-white/5 relative overflow-hidden flex flex-col items-center justify-center">
      {/* Background Decor */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-blue-600/[0.03] rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
        <a href="#hero" className="mb-12 group transition-transform hover:scale-105">
          <div className="w-48 h-12 flex items-center justify-center">
            <img src="/benzsiangco.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
        </a>

        <div className="flex flex-wrap justify-center gap-x-10 gap-y-6 mb-12">
          {['About', 'Projects', 'Skills', 'Contact'].map(link => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-[0.4em] transition-colors"
            >
              {link}
            </a>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-6 mb-12">
          {socials.map(link => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="text-slate-600 hover:text-blue-500 text-[9px] font-black uppercase tracking-widest transition-all"
            >
              {link.name}
            </a>
          ))}
        </div>

        <div className="h-px w-24 bg-white/5 mb-12"></div>

        <p className="text-slate-700 text-[9px] font-black uppercase tracking-[0.4em] mb-6">&copy; 2026 Benz Siangco. All rights reserved.</p>

        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-slate-800 text-[8px] font-black uppercase tracking-[0.6em]">
          <span>Manila, Philippines</span>
          <div className="hidden md:block w-1.5 h-1.5 bg-slate-900 rounded-full"></div>
          <span>Short-Form Video Specialist</span>
        </div>
      </div>
    </footer>
  );
};