"use client";

import Image from "next/image";
import { useUiStore } from "@/lib/uiStore";

interface HeroProps {
  className?: string;
}

export default function Hero({ className = "" }: HeroProps) {
  const openFilter = useUiStore((state) => state.openFilter);

  // NOTE: Assets are currently pointing to fallbacks. 
  // A final /hero-desktop.jpg and /hero-mobile.mp4 should be added to the public folder.
  const desktopImageSrc = "/products/placeholder.svg"; 
  const mobileVideoSrc = "/hero-mobile.mp4"; 
  const mobileVideoPoster = "/products/placeholder.svg"; 

  return (
    <section className={`relative w-full bg-black overflow-hidden ${className}`}>
      {/* 
        Mobile Video Hero (below md).
        Cinematic vertical composition filling a large portion of the viewport.
      */}
      <div className="relative w-full h-[80vh] min-h-[500px] md:hidden">
        <Image
          src={desktopImageSrc}
          alt="BEDIFF Summer 26 Campaign Mobile"
          fill
          priority
          className="object-cover object-center"
        />
      </div>

      {/* 
        Desktop Image Hero (md and above).
        Height matches design specs (approx 500px).
      */}
      <div className="relative hidden md:block w-full md:h-[500px]">
        <Image
          src={desktopImageSrc}
          alt="BEDIFF Summer 26 Campaign"
          fill
          priority
          className="object-cover object-center"
        />
      </div>

      {/* 
        Overlays
        pointer-events-none on the container ensures the media underneath could be interacted with,
        while pointer-events-auto on the children makes the button clickable.
      */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Bottom Left: Wordmark & Season */}
        <div className="absolute bottom-0 left-0 p-4 md:p-6 pointer-events-auto">
          <div className="flex flex-col text-white text-xs font-medium uppercase tracking-[0.05em]">
            <span>BEDIFF</span>
            <span>SUMMER 26</span>
          </div>
        </div>

        {/* Bottom Right: Filter Control */}
        <div className="absolute bottom-0 right-0 p-4 md:p-6 pointer-events-auto">
          <button
            type="button"
            onClick={openFilter}
            className="text-white text-xs font-medium uppercase tracking-[0.05em] hover:text-gray-300 transition-colors"
            aria-label="Open filters"
          >
            FILTER
          </button>
        </div>
      </div>
    </section>
  );
}

