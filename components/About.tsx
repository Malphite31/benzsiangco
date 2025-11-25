import React from 'react';
import { Video, Zap, Layers, Scissors } from 'lucide-react';
import { PORTFOLIO_DATA } from '../constants';

export const About: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-slate-950 relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          
          {/* Left Column: Bio */}
          <div>
            <div className="inline-flex items-center gap-2 text-blue-400 font-bold uppercase tracking-wider text-xs mb-4">
                <Scissors className="w-4 h-4" />
                <span>The Workflow</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-6">
              {PORTFOLIO_DATA.aboutTitle}
            </h2>
            <div className="space-y-4 text-slate-400 leading-relaxed text-lg font-light">
              <p>{PORTFOLIO_DATA.aboutText}</p>
              <div className="h-4"></div>
              {PORTFOLIO_DATA.longBio.split('\n').map((paragraph, idx) => (
                <p key={idx} className="text-base">{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Right Column: Key Pillars */}
          <div className="grid gap-6">
             <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-8 rounded-2xl hover:border-blue-500/30 hover:bg-slate-900 transition-all duration-300 group">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors border border-blue-500/10">
                    <Video className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Narrative Pacing</h3>
                <p className="text-slate-400 leading-relaxed text-sm">
                    Knowing when to cut is just as important as knowing when to hold. I focus on rhythm and flow to ensure every second serves the story.
                </p>
             </div>

             <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-8 rounded-2xl hover:border-cyan-500/30 hover:bg-slate-900 transition-all duration-300 group">
                <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-cyan-500/20 transition-colors border border-cyan-500/10">
                    <Layers className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Motion & VFX</h3>
                <p className="text-slate-400 leading-relaxed text-sm">
                    Leveraging After Effects to add polish. From subtle parallax effects to complex compositing, I elevate production value beyond simple cuts.
                </p>
             </div>

             <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-8 rounded-2xl hover:border-blue-500/30 hover:bg-slate-900 transition-all duration-300 group">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors border border-blue-500/10">
                    <Zap className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Retention Optimization</h3>
                <p className="text-slate-400 leading-relaxed text-sm">
                    Strategic use of visual hooks, sound design, and pattern interrupts to maintain viewer engagement and boost algorithmic performance.
                </p>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};