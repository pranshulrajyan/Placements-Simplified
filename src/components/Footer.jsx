import React from 'react';

export default function Footer() {
  return (
    <footer className="relative z-10 bg-[#1A1A1A] border-t border-[#4A0E0E]/30 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Column 1 — Brand */}
          <div className="space-y-4">
            <a href="#" className="inline-flex items-center gap-1">
              <span className="text-[#B08D3A] font-serif text-xl font-normal">Placements</span>
              <span className="text-[#FAF3E0] font-serif text-xl font-normal">Simplified</span>
            </a>
            <p className="text-[#8B7355] text-sm leading-relaxed max-w-sm">
              Curated, high-yield preparation resources to cut the crowd and secure your dream offer in technical placement cycles.
            </p>
          </div>

          {/* Column 2 — Connect & Contact */}
          <div className="space-y-4">
            <h3 className="text-[#FAF3E0] text-sm font-semibold uppercase tracking-widest font-sans">
              Connect &amp; Contact
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://www.linkedin.com/in/pranshul-rajyan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#B08D3A] hover:underline transition-colors"
                >
                  LinkedIn: pranshul-rajyan
                </a>
              </li>
              <li>
                <a
                  href="mailto:rajyanpranshul@gmail.com"
                  className="text-[#B08D3A] hover:underline transition-colors"
                >
                  Email: rajyanpranshul@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 — Legal */}
          <div className="space-y-4">
            <h3 className="text-[#FAF3E0] text-sm font-semibold uppercase tracking-widest font-sans">
              Legal &amp; Policy
            </h3>
            <p className="text-[#E8D5B7]/80 text-sm leading-relaxed">
              All preparation resources, roadmaps, and project templates provided on Placements Simplified are curated strictly for educational purposes to assist students in technical placement preparation.
            </p>
          </div>
        </div>

        {/* Bottom Copyright Row */}
        <div className="border-t border-[#4A0E0E]/20 mt-8 pt-6 text-center text-[#8B7355] text-xs">
          &copy; 2026 Placements Simplified. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
