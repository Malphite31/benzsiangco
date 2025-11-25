import React from 'react';
import { PlayCircle } from 'lucide-react';
import { Button } from './Button';
import { PORTFOLIO_DATA } from '../constants';

export const Hero: React.FC = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-10 md:pt-24 md:pb-12 bg-slate-950">
      {/* Background Elements */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] opacity-40"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[100px] opacity-30"></div>

        {/* Animated Grid */}
        <div className="absolute inset-0 bg-grid-pattern animate-grid opacity-50"></div>

        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-8 lg:gap-20">

          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 mb-4 md:mb-6 px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-950/30 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-blue-200 text-xs font-bold tracking-wide uppercase">Open for Commissions</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-4 md:mb-6 leading-tight text-white">
              {PORTFOLIO_DATA.heroHeadline}
            </h1>

            <p className="text-base sm:text-lg text-slate-400 mb-6 md:mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-light">
              {PORTFOLIO_DATA.heroSub}
            </p>

            <div className="flex flex-row flex-wrap items-center justify-center lg:justify-start gap-3 md:gap-4 mb-8 md:mb-12">
              <Button
                variant="primary"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Contact Me
              </Button>
              <Button
                variant="outline"
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                icon={<PlayCircle className="w-5 h-5" />}
              >
                View Latest Edits
              </Button>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-6 text-slate-500 font-medium text-sm">
              <a href={PORTFOLIO_DATA.socials.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                LinkedIn
              </a>
              <a href={PORTFOLIO_DATA.socials.tiktok} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                TikTok
              </a>
              <a href={`mailto:${PORTFOLIO_DATA.socials.email}`} className="hover:text-blue-400 transition-colors">
                Email
              </a>
            </div>
          </div>

          {/* Hero Image */}
          <div className="flex-1 relative mt-4 lg:mt-0">
            <div className="relative w-60 h-60 sm:w-80 sm:h-80 md:w-[400px] md:h-[400px] lg:w-[480px] lg:h-[480px] mx-auto">
              {/* Decorative shapes behind image */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-[2.5rem] opacity-20 blur-3xl animate-pulse"></div>
              <div className="absolute inset-0 border border-blue-500/20 rounded-[2.5rem] rotate-6"></div>

              <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden border-2 border-slate-800 shadow-2xl shadow-blue-500/20 z-10 bg-slate-900">
                <img
                  src="/hero-img.png"
                  alt="Benz Siangco"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  loading="eager"
                  draggable={false}
                />
              </div>

              {/* Floating badges */}

              {/* Premiere Pro - Bottom Left */}
              <div className="absolute -bottom-4 -left-4 md:bottom-4 md:-left-8 bg-slate-900/90 backdrop-blur-xl p-2 md:p-4 rounded-xl border border-slate-800 shadow-xl shadow-blue-900/10 animate-float z-20">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="bg-[#00005b]/80 p-1.5 md:p-2.5 rounded-lg text-blue-300 font-bold text-xs border border-blue-500/20">Pr</div>
                  <div>
                    <p className="text-white text-[10px] md:text-xs font-bold">Premiere Pro</p>
                    <p className="text-slate-500 text-[8px] md:text-[10px]">Expert</p>
                  </div>
                </div>
              </div>

              {/* After Effects - Top Right */}
              <div className="absolute -top-4 -right-4 md:top-8 md:-right-8 bg-slate-900/90 backdrop-blur-xl p-2 md:p-4 rounded-xl border border-slate-800 shadow-xl shadow-blue-900/10 animate-float z-20" style={{ animationDelay: '1.5s' }}>
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="bg-[#00005b]/80 p-1.5 md:p-2.5 rounded-lg text-purple-300 font-bold text-xs border border-purple-500/20">Ae</div>
                  <div>
                    <p className="text-white text-[10px] md:text-xs font-bold">After Effects</p>
                    <p className="text-slate-500 text-[8px] md:text-[10px]">VFX & Motion</p>
                  </div>
                </div>
              </div>

              {/* Photoshop - Bottom Right */}
              <div className="absolute bottom-8 -right-6 md:bottom-20 md:-right-12 bg-slate-900/90 backdrop-blur-xl p-2 md:p-4 rounded-xl border border-slate-800 shadow-xl shadow-blue-900/10 animate-float z-20" style={{ animationDelay: '0.8s' }}>
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="bg-[#001e36]/80 p-1.5 md:p-2.5 rounded-lg text-cyan-300 font-bold text-xs border border-cyan-500/20">Ps</div>
                  <div>
                    <p className="text-white text-[10px] md:text-xs font-bold">Photoshop</p>
                    <p className="text-slate-500 text-[8px] md:text-[10px]">Thumbnails</p>
                  </div>
                </div>
              </div>

              {/* Illustrator - Top Left */}
              <div className="absolute top-8 -left-6 md:top-20 md:-left-12 bg-slate-900/90 backdrop-blur-xl p-2 md:p-4 rounded-xl border border-slate-800 shadow-xl shadow-blue-900/10 animate-float z-20" style={{ animationDelay: '2.2s' }}>
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="bg-[#261000]/80 p-1.5 md:p-2.5 rounded-lg text-orange-400 font-bold text-xs border border-orange-500/20">Ai</div>
                  <div>
                    <p className="text-white text-[10px] md:text-xs font-bold">Illustrator</p>
                    <p className="text-slate-500 text-[8px] md:text-[10px]">Vector Assets</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};