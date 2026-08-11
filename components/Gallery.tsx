"use client";

import { useState } from "react";
import Image from "next/image";

interface GalleryProps {
  images?: string[];
  productName: string;
}

export default function Gallery({ images = [], productName }: GalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-[3/4] bg-gray-100 flex items-center justify-center">
        <span className="text-xs uppercase tracking-[0.05em] text-gray-400">NO IMAGE</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row-reverse gap-4 w-full">
      {/* Main Image */}
      <div className="relative w-full aspect-[3/4] md:w-[calc(100%-80px)] bg-[#F9F9F9] overflow-hidden">
        <Image
          src={images[activeIndex]}
          alt={`${productName} - Image ${activeIndex + 1}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-center"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto md:w-[64px] scrollbar-hide">
          {images.map((image, idx) => (
            <button
              key={`${image}-${idx}`}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`relative shrink-0 w-16 aspect-[3/4] overflow-hidden bg-[#F9F9F9] border transition-colors ${
                activeIndex === idx ? "border-black" : "border-transparent hover:border-gray-300"
              }`}
              aria-label={`View image ${idx + 1}`}
            >
              <Image
                src={image}
                alt={`Thumbnail ${idx + 1}`}
                fill
                sizes="64px"
                className="object-cover object-center"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
