import React from 'react';
import { Layers, Monitor, Image as ImageIcon, PenTool, Zap, Music, Video } from 'lucide-react';
import { SKILLS } from '../constants';

export const Skills: React.FC = () => {
  
  const getSkillStyle = (name: string) => {
    if (name.includes('After Effects')) return { icon: <Layers className="w-5 h-5" />, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' };
    if (name.includes('Premiere')) return { icon: <Video className="w-5 h-5" />, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' };
    if (name.includes('Photoshop')) return { icon: <ImageIcon className="w-5 h-5" />, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' };
    if (name.includes('Illustrator')) return { icon: <PenTool className="w-5 h-5" />, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' };
    if (name.includes('Sound')) return { icon: <Music className="w-5 h-5" />, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' };
    return { icon: <Zap className="w-5 h-5" />, color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20' };
  };

  const secondarySkills = ['Dynamic Linking', 'Keyframe Animation', 'Audio Mixing', 'Color Grading', 'Rotoscoping', '3D Camera Tracking'];

  return (
    <section id="skills" className="py-16 bg-slate-900/30 border-y border-white/5">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Software & Tools</h2>
            <p className="text-slate-400 text-sm font-light">
                My technical toolkit, built for speed and high-end delivery.
            </p>
        </div>

        {/* Main Skills Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
            {SKILLS.map((skill) => {
                const style = getSkillStyle(skill.name);
                return (
                    <div key={skill.name} className={`p-3 rounded-xl border ${style.border} ${style.bg} backdrop-blur-sm flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 hover:shadow-lg duration-300 group`}>
                        <div className={`p-2 rounded-lg bg-slate-950/50 ${style.color} group-hover:bg-slate-900 transition-colors`}>
                            {style.icon}
                        </div>
                        <span className="font-semibold text-xs text-slate-200 group-hover:text-white text-center whitespace-nowrap">{skill.name}</span>
                    </div>
                );
            })}
        </div>

        {/* Secondary Skills Pills */}
        <div className="flex flex-wrap justify-center gap-2">
            {secondarySkills.map((item, idx) => (
                <div key={idx} className="px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700/50 text-slate-400 text-xs font-medium hover:border-blue-500/30 hover:text-blue-300 transition-colors cursor-default">
                    {item}
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};
