import React, { useState, useEffect } from 'react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 border-b border-[#4A0E0E]/30 backdrop-blur-xl ${
        scrolled ? 'bg-[#1C1008]/95 py-3 shadow-lg shadow-black/40' : 'bg-[#1C1008]/90 py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-row items-center justify-between px-6">
        <a href="#" className="flex items-center gap-1 group">
          <span className="text-[#B08D3A] font-serif text-xl font-normal">Placements</span>
          <span className="text-[#FAF3E0] font-serif text-xl font-normal">Simplified</span>
        </a>

        <nav className="hidden md:flex items-center gap-6">
          <a
            href="#domains"
            className="text-[#8B7355] hover:text-[#D4A956] transition-colors text-sm font-medium font-sans tracking-wide"
          >
            Domains &amp; Plans
          </a>
          <a
            href="#projects"
            className="text-[#8B7355] hover:text-[#D4A956] transition-colors text-sm font-medium font-sans tracking-wide"
          >
            Projects Lab
          </a>
        </nav>
      </div>
    </header>
  );
}
