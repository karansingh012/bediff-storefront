"use client";

import Image from "next/image";
import Link from "next/link";

interface HeroProps {
  className?: string;
}

export default function Hero({ className = "" }: HeroProps) {

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
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-end items-center pb-12 md:pb-16 gap-6">
        <h1 className="text-white text-4xl md:text-6xl font-bold uppercase tracking-[0.15em] pointer-events-auto">
          DELHI
        </h1>
        <Link
          href="/shop"
          className="text-black bg-white text-xs font-bold uppercase tracking-[0.05em] px-8 py-3 hover:bg-gray-200 transition-colors pointer-events-auto"
        >
          SHOP
        </Link>
      </div>
    </section>
  );
}

