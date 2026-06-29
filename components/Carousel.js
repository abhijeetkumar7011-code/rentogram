"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Carousel({ slides, interval = 4000 }) {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % slides.length);
  }, [slides.length]);

  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);

  useEffect(() => {
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [next, interval]);

  return (
    <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-gray-100 bg-white">
      <div className="relative h-48 sm:h-72 md:h-80">
        {slides.map((slide, i) => (
          <div
            key={slide.title}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${slide.from} ${slide.to} opacity-10`} />
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-contain p-6 sm:p-10"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 sm:p-5">
              <h3 className="text-white font-semibold text-sm sm:text-lg">{slide.title}</h3>
              <p className="text-white/80 text-xs sm:text-sm">{slide.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* arrows */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 p-1.5 sm:p-2 rounded-full shadow-md transition-soft"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 p-1.5 sm:p-2 rounded-full shadow-md transition-soft"
      >
        <ChevronRight size={18} />
      </button>

      {/* dots */}
      <div className="absolute bottom-2 sm:bottom-3 right-3 sm:right-5 flex gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-soft ${
              i === index ? "w-6 bg-white" : "w-1.5 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
