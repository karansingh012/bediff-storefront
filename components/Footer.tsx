"use client";

import Link from "next/link";

interface FooterProps {
  className?: string;
}

export default function Footer({ className = "" }: FooterProps) {
  return (
    <footer className={`w-full bg-white border-t border-border pt-16 pb-8 px-4 md:px-6 md:pt-24 md:pb-12 ${className}`}>
      <div className="mx-auto max-w-content">
        {/* Top Section: Brand + Navigation Columns */}
        <div className="flex flex-col md:flex-row justify-between gap-12 md:gap-8">
          
          {/* Brand Block */}
          <div className="flex flex-col md:max-w-xs">
            <span className="text-lg font-bold uppercase tracking-[0.18em] text-black mb-4">
              BEDIFF
            </span>
            <p className="text-sm text-gray-500 leading-relaxed">
              Independent performance athletic wear. Merging extreme functional requirements with pristine editorial design.
            </p>
          </div>

          {/* Navigation Columns */}
          <div className="flex flex-col md:flex-row gap-12 md:gap-24">
            
            {/* HELP Column */}
            <div className="flex flex-col gap-5">
              <h4 className="text-xs font-medium uppercase tracking-[0.05em] text-black">HELP</h4>
              <nav className="flex flex-col gap-4" aria-label="Help navigation">
                <Link href="#" onClick={(e) => e.preventDefault()} className="text-sm text-gray-500 hover:text-black transition-colors focus:outline-none focus:text-black">FAQ</Link>
                <Link href="#" onClick={(e) => e.preventDefault()} className="text-sm text-gray-500 hover:text-black transition-colors focus:outline-none focus:text-black">Shipping</Link>
                <Link href="#" onClick={(e) => e.preventDefault()} className="text-sm text-gray-500 hover:text-black transition-colors focus:outline-none focus:text-black">Returns</Link>
                <Link href="#" onClick={(e) => e.preventDefault()} className="text-sm text-gray-500 hover:text-black transition-colors focus:outline-none focus:text-black">Contact</Link>
              </nav>
            </div>

            {/* INFO Column */}
            <div className="flex flex-col gap-5">
              <h4 className="text-xs font-medium uppercase tracking-[0.05em] text-black">INFO</h4>
              <nav className="flex flex-col gap-4" aria-label="Info navigation">
                <Link href="#" onClick={(e) => e.preventDefault()} className="text-sm text-gray-500 hover:text-black transition-colors focus:outline-none focus:text-black">About Us</Link>
                <Link href="#" onClick={(e) => e.preventDefault()} className="text-sm text-gray-500 hover:text-black transition-colors focus:outline-none focus:text-black">Sustainability</Link>
                <Link href="#" onClick={(e) => e.preventDefault()} className="text-sm text-gray-500 hover:text-black transition-colors focus:outline-none focus:text-black">Careers</Link>
                <Link href="#" onClick={(e) => e.preventDefault()} className="text-sm text-gray-500 hover:text-black transition-colors focus:outline-none focus:text-black">Atelier</Link>
              </nav>
            </div>

            {/* SOCIAL Column */}
            <div className="flex flex-col gap-5">
              <h4 className="text-xs font-medium uppercase tracking-[0.05em] text-black">SOCIAL</h4>
              <nav className="flex flex-col gap-4" aria-label="Social navigation">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-black transition-colors focus:outline-none focus:text-black">Instagram</a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-black transition-colors focus:outline-none focus:text-black">Twitter</a>
                <a href="https://strava.com" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-black transition-colors focus:outline-none focus:text-black">Strava</a>
              </nav>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-20 md:mt-32 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <span className="text-xs font-medium uppercase tracking-[0.05em] text-black">
            MADE FOR ATYPICAL PERFORMANCE
          </span>
          <span className="text-[11px] uppercase tracking-[0.05em] text-gray-400">
            © 2026 BEDIFF. ALL RIGHTS RESERVED.
          </span>
        </div>
      </div>
    </footer>
  );
}
