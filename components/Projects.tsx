import React, { useState, useEffect, useRef } from 'react';
import { Play, X } from 'lucide-react';
import { PROJECTS } from '../constants';
import { supabase } from '../lib/supabase';

export const Projects: React.FC = () => {
  const [activeProject, setActiveProject] = useState<typeof PROJECTS[0] | null>(null);
  const [projects, setProjects] = useState(PROJECTS);
  const paralaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('sort_order', { ascending: true });

      if (!error && data && data.length > 0) {
        setProjects(data as any);
      }
    };
    fetchProjects();

    const handleMouseMove = (e: MouseEvent) => {
      if (!paralaxRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 10;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      paralaxRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section id="projects" className="py-20 md:py-24 bg-[#020617] relative">
      <div ref={paralaxRef} className="parallax-bg opacity-20">
        <div className="absolute top-1/2 left-0 w-64 md:w-96 h-64 md:h-96 bg-blue-600/10 rounded-full blur-[80px] md:blur-[100px]"></div>
        <div className="absolute bottom-1/2 right-0 w-64 md:w-96 h-64 md:h-96 bg-cyan-600/10 rounded-full blur-[80px] md:blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-6 text-center md:text-left">
          <div className="animate-fade-in-up">
            <span className="text-blue-500 font-black text-[9px] md:text-[10px] uppercase tracking-[0.4em] md:tracking-[0.5em] mb-4 block text-center md:text-left">PORTFOLIO</span>
            <h2 className="text-[2.5rem] md:text-8xl font-bold text-white leading-[1.1] md:leading-[1] tracking-tighter uppercase mb-2 text-center md:text-left">
              Selected <span className="instrument-serif text-blue-500 italic font-normal normal-case">Works</span>
            </h2>
          </div>
          <p className="text-slate-500 text-[8px] md:text-[10px] font-bold uppercase tracking-widest max-w-[200px] leading-relaxed mx-auto md:mx-0 opacity-60 text-center md:text-left">
            Engineering attention through cinematic rhythm.
          </p>
        </div>

        <div className="relative w-full overflow-hidden">
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full overflow-x-auto md:overflow-x-visible pb-12 md:pb-0 snap-x snap-mandatory scrollbar-hide scroll-smooth">
            <div className="min-w-[5%] md:hidden shrink-0"></div>

            {projects.map((project) => (
              <div
                key={project.id}
                className="group relative min-w-[300px] sm:min-w-0 md:w-full aspect-[9/16] bg-slate-900 rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-blue-500/30 transition-all duration-700 shadow-2xl hover:shadow-blue-500/20 cursor-pointer snap-center will-change-transform"
                onClick={() => setActiveProject(project)}
              >
                <div className="absolute inset-0 z-0 transition-transform duration-1000 group-hover:scale-110">
                  <img src={(project as any).thumbnail_url || project.thumbnail} alt={project.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent group-hover:via-slate-900/40" />
                </div>

                <div className="absolute inset-x-0 bottom-0 p-8 z-10 transform translate-y-2 md:translate-y-4 group-hover:translate-y-0 transition-transform duration-500 text-left">
                  <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[8px] font-black uppercase tracking-widest mb-4 inline-block backdrop-blur-md">{project.category}</span>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-tight group-hover:text-blue-400 transition-colors uppercase tracking-tight">{project.title}</h3>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-600/30 group-hover:scale-110 transition-transform ripple">
                      <Play className="w-5 h-5 fill-white" />
                    </div>
                    <div className="h-px flex-1 bg-white/10 group-hover:bg-blue-500/30 transition-colors" />
                  </div>
                </div>
              </div>
            ))}

            <div className="min-w-[5%] md:hidden shrink-0"></div>
          </div>

          <div className="absolute -bottom-2 font-black text-[7px] text-blue-500/40 uppercase tracking-[0.5em] w-full text-center md:hidden pointer-events-none">
            Swipe to Discover
          </div>
        </div>
      </div>

      {activeProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/98 backdrop-blur-3xl animate-fade-in" onClick={() => setActiveProject(null)}></div>

          <div className="relative w-full max-w-[400px] lg:max-w-6xl bg-[#0a101f] rounded-[2.5rem] md:rounded-[3.5rem] border border-white/10 shadow-3xl flex flex-col lg:flex-row p-2 animate-bounce-in max-h-[85vh] lg:max-h-[95vh] overflow-y-auto lg:overflow-hidden scrollbar-hide">

            <button
              onClick={() => setActiveProject(null)}
              className="absolute top-4 right-4 z-[120] p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 transition-all hover:scale-110 active:scale-90"
            >
              <X size={20} />
            </button>

            {/* Video Container */}
            <div className="relative w-full lg:w-1/2 aspect-[9/16] lg:aspect-video rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden bg-black shadow-2xl flex-shrink-0">
              {(() => {
                const url = (activeProject as any).video_url || activeProject.videoUrl;
                const isYoutube = url.includes('youtube.com') || url.includes('youtu.be');

                if (isYoutube) {
                  return (
                    <iframe
                      src={`https://www.youtube.com/embed/${url.split('v=')[1]}?autoplay=1&controls=1&rel=0&modestbranding=1&iv_load_policy=3&showinfo=0`}
                      className="absolute inset-0 w-full h-full"
                      title={activeProject.title}
                      allowFullScreen
                    ></iframe>
                  );
                } else {
                  return (
                    <video
                      src={url}
                      className="absolute inset-0 w-full h-full object-cover"
                      controls
                      autoPlay
                      playsInline
                    />
                  );
                }
              })()}
            </div>

            {/* Content Container */}
            <div className="p-6 md:p-12 lg:w-1/2 flex flex-col justify-start lg:justify-center text-center lg:text-left h-auto lg:h-full">
              <div className="pb-4 lg:pb-0">
                <span className="text-blue-500 font-black text-[9px] uppercase tracking-[0.4em] mb-4 block mt-6 lg:mt-0">GALLERY SHOWCASE</span>
                <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-white mb-6 leading-tight uppercase tracking-tight">{activeProject.title}</h2>
                <div className="w-12 h-1 bg-blue-600 mb-8 mx-auto lg:mx-0 hidden lg:block"></div>

                <p className="text-slate-400 text-xs md:text-sm lg:text-lg leading-relaxed mb-8 max-w-[280px] lg:max-w-none mx-auto lg:mx-0 opacity-70">
                  {activeProject.description}
                </p>

                <div className="hidden lg:grid grid-cols-2 gap-4 mb-8">
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                    <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Category</span>
                    <span className="text-sm font-bold text-white">{activeProject.category}</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                    <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Format</span>
                    <span className="text-sm font-bold text-white">9:16 Vertical</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveProject(null)}
                className="w-full lg:w-auto py-4 px-8 rounded-2xl bg-white/[0.04] border border-white/10 text-white text-[10px] lg:text-xs font-black uppercase tracking-widest hover:bg-white/10 hover:border-blue-500/20 transition-all font-bold group mt-auto lg:mt-0"
              >
                Return to Gallery
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};