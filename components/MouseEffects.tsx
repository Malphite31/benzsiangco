import React, { useEffect, useRef, useState } from 'react';

export const MouseEffects: React.FC = () => {
  const [clicks, setClicks] = useState<{id: number, x: number, y: number}[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hide custom cursor on touch devices to prevent lag/visual issues
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Immediate update for the dot
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      
      const isInteractive = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') || 
        target.closest('.project-card') ||
        target.closest('.skill-card') ||
        target.closest('[role="button"]');

      setIsHovered(!!isInteractive);
    };

    const loop = () => {
      // Linear interpolation for the ring (lag effect)
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }
      requestAnimationFrame(loop);
    };
    
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    const frameId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const id = Date.now();
      // Add click to state
      setClicks(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);
      
      // Cleanup after animation finishes
      setTimeout(() => {
        setClicks(prev => prev.filter(c => c.id !== id));
      }, 700);
    };

    window.addEventListener('mousedown', onClick);
    return () => window.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Custom Cursor - Hidden on mobile via media query in JS return, but double checked with md:block class convention */}
      <div className="hidden md:block">
          <div 
            ref={cursorRef} 
            className={`absolute top-0 left-0 w-3 h-3 bg-blue-400 rounded-full -ml-1.5 -mt-1.5 shadow-[0_0_10px_rgba(96,165,250,0.8)] mix-blend-screen will-change-transform backdrop-blur-sm transition-all duration-300 ${
              isHovered ? 'cursor-hover-active' : ''
            }`} 
          />
          <div 
            ref={ringRef} 
            className={`absolute top-0 left-0 w-10 h-10 border border-blue-400/30 rounded-full -ml-5 -mt-5 will-change-transform mix-blend-screen transition-all duration-300 ${
              isHovered ? 'ring-hover-active' : ''
            }`} 
          />
      </div>

      {/* Click Explosions */}
      {clicks.map(click => (
        <React.Fragment key={click.id}>
             {/* Expanding Ripple */}
            <div 
                className="animate-click-ripple"
                style={{ left: click.x, top: click.y }}
            />
            
            {/* Burst Particles */}
            {[...Array(8)].map((_, i) => (
                <div 
                    key={i}
                    className="animate-click-particle"
                    style={{ 
                        left: click.x, 
                        top: click.y,
                        '--angle': `${i * 45}deg` 
                    } as React.CSSProperties}
                />
            ))}
        </React.Fragment>
      ))}
    </div>
  );
};