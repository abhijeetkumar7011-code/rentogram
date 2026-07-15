"use client";

import { useRef, useState } from "react";
import Image from "next/image";

export default function ImageGallery({ images = [], alt = "" }) {
  const [active, setActive] = useState(0);
  const [zoomStyle, setZoomStyle] = useState({});
  const [zoomed, setZoomed] = useState(false);
  const containerRef = useRef(null);

  const list = images.length ? images : ["/images/laptop-placeholder.svg"];

  function handleMouseMove(e) {
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomStyle({ transformOrigin: `${x}% ${y}%` });
  }

  return (
    <div>
      <div
        ref={containerRef}
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
        onMouseMove={handleMouseMove}
        className="relative aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm cursor-zoom-in mb-3 sm:mb-4"
      >
        <Image
          src={list[active]}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
          className="object-cover transition-transform duration-300 ease-out"
          style={zoomed ? { transform: "scale(1.8)", ...zoomStyle } : {}}
        />
      </div>

      {list.length > 1 && (
        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {list.map((src, i) => (
            <button
              key={src + i}
              onClick={() => setActive(i)}
              className={`relative shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl overflow-hidden border-2 transition-soft ${
                active === i ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={src} alt={`${alt} thumbnail ${i + 1}`} fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}