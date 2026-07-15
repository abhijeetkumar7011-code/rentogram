"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Eye, ArrowRight } from "lucide-react";

function QuickViewModal({ product, onClose }) {
  if (!product) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center"
        >
          <X size={16} className="text-gray-600" />
        </button>
        <div className="relative aspect-video bg-gray-50">
          <Image src={product.image} alt={product.name} fill sizes="400px" className="object-cover" />
        </div>
        <div className="p-5">
          {product.brand && <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">{product.brand}</p>}
          <h3 className="font-bold text-lg text-gray-900 mb-1">{product.name}</h3>
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.specs}</p>
          <p className="text-xl font-bold text-primary mb-4">
            ₹{product.pricePerDay}
            <span className="text-xs text-gray-400 font-normal">/day</span>
          </p>
          <div className="flex gap-2">
            <Link
              href={`/products/${product.slug}`}
              className="flex-1 text-center text-sm font-semibold bg-primary/10 text-primary py-2.5 rounded-full hover:bg-primary/20 transition-soft"
            >
              View Details
            </Link>
            <Link
              href={`/booking?product=${product.id}`}
              className="flex-1 text-center text-sm font-semibold bg-primary text-white py-2.5 rounded-full hover:opacity-90 transition-soft"
            >
              Rent Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SuggestedProducts({ products = [], title = "You May Also Like" }) {
  const scrollerRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [quickView, setQuickView] = useState(null);

  useEffect(() => {
    if (paused || !products.length) return;
    const el = scrollerRef.current;
    if (!el) return;
    const id = setInterval(() => {
      if (!el) return;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      el.scrollTo({ left: atEnd ? 0 : el.scrollLeft + 240, behavior: "smooth" });
    }, 3200);
    return () => clearInterval(id);
  }, [paused, products.length]);

  if (!products.length) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <h2 className="text-lg sm:text-2xl font-semibold text-gray-900">{title}</h2>
      </div>

      <div
        ref={scrollerRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((p) => (
          <div
            key={p.id}
            className="group shrink-0 w-40 sm:w-52 bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-soft overflow-hidden"
          >
            <Link href={`/products/${p.slug}`} className="block relative aspect-square bg-gray-50 overflow-hidden">
              <Image
                src={p.image}
                alt={p.name}
                fill
                sizes="(max-width: 640px) 160px, 208px"
                loading="lazy"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setQuickView(p);
                }}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-soft"
                title="Quick view"
              >
                <Eye size={13} className="text-gray-600" />
              </button>
            </Link>
            <div className="p-3">
              <h3 className="font-semibold text-xs sm:text-sm text-gray-900 line-clamp-1 mb-1">{p.name}</h3>
              <p className="text-sm sm:text-base font-bold text-primary mb-2">
                ₹{p.pricePerDay}
                <span className="text-[10px] text-gray-400 font-normal">/day</span>
              </p>
              <Link
                href={`/booking?product=${p.id}`}
                className="flex items-center justify-center gap-1 text-[11px] sm:text-xs font-semibold bg-primary/10 text-primary py-1.5 sm:py-2 rounded-full hover:bg-primary hover:text-white transition-soft"
              >
                Rent Now <ArrowRight size={11} />
              </Link>
            </div>
          </div>
        ))}
      </div>

      <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />
    </div>
  );
}