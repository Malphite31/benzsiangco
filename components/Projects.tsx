import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Play, X, ChevronsRight } from 'lucide-react';
import { PROJECTS } from '../constants';
import { supabase } from '../lib/supabase';

export const Projects: React.FC = () => {
  const [activeProject, setActiveProject] = useState<typeof PROJECTS[0] | null>(null);
  const [projects, setProjects] = useState(PROJECTS);
  const [activeFilter, setActiveFilter] = useState('All');
  const paralaxRef = useRef<HTMLDivElement>(null);

  // Extract categories dynamically
  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))];

  // Lock both html and body scroll when activeProject modal is open
  useEffect(() => {
    if (activeProject) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [activeProject]);

  useEffect(() => {
    if (activeProject && activeProject.id) {
      const logView = async () => {
        try {
          await supabase.from('project_views').insert([{
            project_id: activeProject.id
          }]);
        } catch (err) {
          console.warn('Failed to log view', err);
        }
      };
      logView();
    }
  }, [activeProject]);

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

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-scale-up-fade');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, [projects, activeFilter]);

  // Interactive 3D Card Tilt Functionality
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    
    const angleX = (yc - y) / 10;
    const angleY = (x - xc) / 10;
    
    card.style.setProperty('--rx', `${angleX}deg`);
    card.style.setProperty('--ry', `${angleY}deg`);
    card.style.setProperty('--scale', `1.03`);
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.setProperty('--rx', `0deg`);
    card.style.setProperty('--ry', `0deg`);
    card.style.setProperty('--scale', `1`);
  };

  const filteredProjects = activeFilter === 'All'
    ? projects
    : projects.filter(p => p.category === activeFilter);

  return (
    <section id="projects" className="py-20 md:py-24 bg-[#020617] relative">
      <div ref={paralaxRef} className="parallax-bg opacity-20">
        <div className="absolute top-1/2 left-0 w-64 md:w-96 h-64 md:h-96 bg-blue-600/10 rounded-full blur-[80px] md:blur-[100px] animate-drift-slow"></div>
        <div className="absolute bottom-1/2 right-0 w-64 md:w-96 h-64 md:h-96 bg-cyan-600/10 rounded-full blur-[80px] md:blur-[100px] animate-drift-reverse"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 w-full">
        {/* Section Title & Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-6 text-center md:text-left">
          <div className="project-card opacity-0">
            <span className="text-blue-500 font-black text-[9px] md:text-[10px] uppercase tracking-[0.4em] md:tracking-[0.5em] mb-4 block text-center md:text-left">PORTFOLIO</span>
            <h2 className="text-[2.5rem] md:text-8xl font-bold text-white leading-[1.1] md:leading-[1] tracking-tighter uppercase mb-2 text-center md:text-left">
              Selected <span className="instrument-serif italic font-normal normal-case text-sweep-glow">Works</span>
            </h2>
          </div>
          <p className="project-card opacity-0 text-slate-500 text-[8px] md:text-[10px] font-bold uppercase tracking-widest max-w-[200px] leading-relaxed mx-auto md:mx-0 opacity-60 text-center md:text-left" style={{ animationDelay: '0.2s' }}>
            Engineering attention through cinematic rhythm.
          </p>
        </div>

        {/* Fluid Category Filter Bar */}
        <div className="flex justify-center mb-10 md:mb-12">
          <div className="inline-flex items-center gap-1 p-1 bg-slate-950/60 rounded-full border border-white/5 backdrop-blur-md relative overflow-hidden">
            {categories.map((cat) => {
              const isActive = activeFilter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`relative px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-full transition-all duration-500 cursor-pointer ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/35 scale-[1.03]' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid List */}
        <div className="relative w-full overflow-hidden">
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full overflow-x-auto md:overflow-x-visible pb-12 md:pb-0 snap-x snap-mandatory scrollbar-hide scroll-smooth tilt-container">
            <div className="min-w-[5%] md:hidden shrink-0"></div>

            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                style={{ animationDelay: `${0.1 + (index * 0.1)}s` } as React.CSSProperties}
                className="project-card opacity-0 group relative min-w-[300px] sm:min-w-0 md:w-full aspect-[9/16] bg-slate-900 rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-blue-500/30 transition-all duration-700 shadow-2xl hover:shadow-blue-500/20 cursor-pointer snap-center will-change-transform tilt-element"
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
                onClick={() => setActiveProject(project)}
              >
                 {/* Thumbnail */}
                <div className="absolute inset-0 z-0 transition-transform duration-1000 group-hover:scale-110 tilt-inner">
                  <img src={encodeURI((project as any).thumbnail_url || project.thumbnail)} alt={project.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent group-hover:via-slate-900/40" />
                </div>

                {/* Footer Details inside Card */}
                <div className="absolute inset-x-0 bottom-0 p-8 z-10 transform translate-y-2 md:translate-y-4 group-hover:translate-y-0 transition-transform duration-500 text-left tilt-inner">
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

          {/* Swipe indicator for mobile */}
          <div className="absolute bottom-4 left-0 w-full flex justify-center md:hidden pointer-events-none z-20">
            <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg">
              <span className="text-[9px] font-bold text-white uppercase tracking-widest mr-1">Swipe</span>
              <div className="flex relative">
                <ChevronsRight className="w-4 h-4 text-blue-500 opacity-50 absolute animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]" />
                <ChevronsRight className="w-4 h-4 text-blue-500 relative z-10" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {activeProject && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          {/* Overlay mask */}
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md animate-fade-in" onClick={() => setActiveProject(null)}></div>

          {/* Centered card container - rendering at document.body level via React Portal */}
          <div className="relative w-full max-w-sm lg:max-w-5xl bg-[#0a101f] rounded-[2rem] lg:rounded-[3.5rem] border border-white/10 shadow-3xl flex flex-col lg:flex-row p-6 md:p-8 lg:p-8 animate-bounce-in z-10 overflow-y-auto max-h-[82vh] lg:max-h-[90vh] gap-6 lg:gap-4">

            {/* Glowing Aura Backdrop */}
            <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[500px] bg-gradient-to-tr from-blue-600/20 to-purple-600/20 rounded-full blur-[80px] opacity-70 animate-pulse pointer-events-none z-0 hidden lg:block" />

            {/* Close Button top-right */}
            <button
              onClick={() => setActiveProject(null)}
              className="absolute top-4 right-4 z-[130] p-2 rounded-full bg-black/40 lg:bg-black/60 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 transition-all hover:scale-110 active:scale-90"
            >
              <X size={20} />
            </button>

            {/* Video Container in Phone Frame */}
            <div className="relative w-[190px] sm:w-[220px] lg:w-[280px] aspect-[9/16] mx-auto lg:mx-0 bg-slate-950 border-[6px] lg:border-[12px] border-slate-900 rounded-[1.8rem] lg:rounded-[3rem] shadow-2xl flex-shrink-0 overflow-hidden z-10 ring-1 ring-white/10">
              
              {/* Dynamic Island Screen Notch */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-3 bg-slate-900 rounded-full z-30"></div>
              
              {(() => {
                const rawUrl = (activeProject as any).video_url || activeProject.videoUrl;
                if (!rawUrl) return null;

                const isYoutube = rawUrl.includes('youtube.com') || rawUrl.includes('youtu.be');

                if (isYoutube) {
                  let videoId = '';
                  if (rawUrl.includes('youtu.be')) videoId = rawUrl.split('/').pop()?.split('?')[0] || '';
                  else if (rawUrl.includes('v=')) videoId = rawUrl.split('v=')[1]?.split('&')[0] || '';

                  return (
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&rel=0&modestbranding=1&iv_load_policy=3&showinfo=0`}
                      className="absolute inset-0 w-full h-full rounded-[1.3rem] lg:rounded-[2.2rem]"
                      title={activeProject.title}
                      allowFullScreen
                    ></iframe>
                  );
                } else {
                  return (
                    <video
                      src={encodeURI(rawUrl)}
                      className="absolute inset-0 w-full h-full object-cover rounded-[1.3rem] lg:rounded-[2.2rem]"
                      controls
                      autoPlay
                      playsInline
                    />
                  );
                }
              })()}
            </div>

            {/* Content Container */}
            <div className="w-full lg:flex-1 px-1 lg:pl-8 flex flex-col relative z-10 text-left justify-center">
              <div className="space-y-4 lg:space-y-6">
                <div>
                  <span className="text-blue-500 font-black text-[9px] uppercase tracking-[0.4em] mb-1 block">GALLERY SHOWCASE</span>
                  <h2 className="text-xl md:text-3xl lg:text-5xl font-bold text-white leading-tight uppercase tracking-tight">{activeProject.title}</h2>
                  <div className="w-12 h-[3px] bg-blue-600 my-2"></div>
                </div>

                <p className="text-slate-400 text-xs lg:text-base leading-relaxed opacity-85">
                  {activeProject.description}
                </p>

                {/* Info grids hidden on mobile */}
                <div className="hidden lg:grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="block text-[7px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Category</span>
                    <span className="text-xs font-bold text-white">{activeProject.category}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="block text-[7px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Format</span>
                    <span className="text-xs font-bold text-white">9:16 Vertical</span>
                  </div>
                </div>

                {/* Close Button only shown on desktop */}
                <button
                  onClick={() => setActiveProject(null)}
                  className="hidden lg:block w-full lg:w-auto py-3 px-8 rounded-xl bg-blue-600 text-white text-xs font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
};