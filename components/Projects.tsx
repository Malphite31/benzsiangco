import React, { useState, useEffect, useRef } from 'react';
import { Play, X } from 'lucide-react';
import { PROJECTS } from '../constants';

export const Projects: React.FC = () => {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="projects" ref={sectionRef} className="py-24 bg-slate-950 relative">
      {/* Background Gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-900/50 to-transparent"></div>

      <div className="container mx-auto px-6">
        <div className={`text-center mb-12 max-w-3xl mx-auto transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Recent Edits & Reels</h2>
            <p className="text-slate-400 text-lg font-light mb-6">
                A glimpse into my creative world.
            </p>
        </div>

        {/* Carousel on Mobile, Grid on Desktop */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-8 -mx-6 px-6 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 md:pb-0 md:overflow-visible md:mx-0 md:px-0 scrollbar-hide overscroll-x-contain">
          {PROJECTS.map((project, index) => (
            <div 
              key={project.id} 
              className={`flex-shrink-0 w-[85vw] sm:w-[60vw] md:w-auto snap-center group relative bg-slate-900 rounded-2xl overflow-hidden aspect-[9/16] border border-slate-800 hover:border-blue-500/50 transition-all duration-500 shadow-2xl hover:shadow-blue-500/10 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {activeVideoId === project.id && project.embedUrl ? (
                <div className="absolute inset-0 bg-black z-20">
                   <iframe 
                      width="100%" 
                      height="100%" 
                      src={project.embedUrl} 
                      title={project.title} 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                      className="w-full h-full object-cover"
                   ></iframe>
                   <button 
                    onClick={() => setActiveVideoId(null)}
                    className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-red-500 transition-colors backdrop-blur-sm"
                   >
                     <X className="w-4 h-4" />
                   </button>
                </div>
              ) : (
                <>
                  {/* Thumbnail */}
                  <img 
                    src={project.imageUrl} 
                    alt={project.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 filter brightness-[0.7] group-hover:brightness-100"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950/90 opacity-90 transition-opacity" />

                  {/* Play Button - Only if Embed URL exists */}
                  {project.embedUrl && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100 cursor-pointer"
                        onClick={() => setActiveVideoId(project.id)}
                    >
                        <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg group-active:scale-95 transition-transform hover:bg-blue-600/80 hover:border-blue-500/50">
                            <Play className="w-6 h-6 text-white fill-current ml-1" />
                        </div>
                    </div>
                  )}

                  {/* Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 pointer-events-none">
                      <div className="flex gap-2 mb-2 flex-wrap">
                          {project.tags.slice(0, 2).map((tag, i) => (
                              <span key={i} className="text-[10px] font-bold uppercase tracking-wider text-blue-200 bg-blue-600/30 px-2 py-1 rounded-md border border-blue-400/20 backdrop-blur-sm">
                                  {tag}
                              </span>
                          ))}
                      </div>
                      <h3 className="text-white font-bold text-lg leading-tight mb-1 group-hover:text-blue-100 transition-colors">{project.title}</h3>
                      <p className="text-slate-400 text-xs line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 leading-relaxed">
                          {project.description}
                      </p>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        
        <div className={`mt-8 text-center md:hidden transition-opacity duration-1000 delay-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
             <div className="text-slate-500 text-xs mb-4 animate-pulse">Swipe or scroll to explore →</div>
        </div>
      </div>
    </section>
  );
};