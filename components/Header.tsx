import React, { useState, useEffect } from 'react';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-20 flex items-center ${isScrolled ? 'bg-slate-950/90 backdrop-blur-md border-b border-white/5' : 'bg-transparent'
        }`}
    >
      <div className="container mx-auto px-6 relative flex items-center justify-end h-full">
        <a href="#" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:left-0 md:translate-x-0 block w-24 h-24 md:w-32 md:h-32 hover:opacity-80 transition-opacity">
          <img src="/benzsiangco.png" alt="Benz Siangco Logo" className="w-full h-full object-contain" />
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-slate-300 hover:text-white transition-colors text-sm font-medium hover:text-blue-400"
            >
              {link.name}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
};