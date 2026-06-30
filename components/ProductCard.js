"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Heart } from "lucide-react";

const TAG_STYLES = {
  Premium:          "bg-violet-50 text-violet-600 border-violet-200",
  "New arrival":    "bg-blue-50 text-blue-600 border-blue-200",
  "New Arrival":    "bg-blue-50 text-blue-600 border-blue-200",
  Budget:           "bg-emerald-50 text-emerald-600 border-emerald-200",
  "Budget Friendly":"bg-emerald-50 text-emerald-600 border-emerald-200",
  Refurb:           "bg-amber-50 text-amber-600 border-amber-200",
};

function StarRating({ rating = 4.5, reviews = 0 }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="flex items-center gap-1">
      <span className="text-amber-400 text-[11px] leading-none tracking-tight">
        {"★".repeat(full)}{half ? "½" : ""}{"☆".repeat(5 - full - (half ? 1 : 0))}
      </span>
      {reviews > 0 && (
        <span className="text-[10px] text-gray-400">({reviews})</span>
      )}
    </div>
  );
}

function WishButton({ liked, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
      className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-200 ${
        liked
          ? "bg-red-50 border-red-200 text-red-500 scale-110"
          : "bg-white/80 border-gray-200 text-gray-400 hover:bg-red-50 hover:border-red-200 hover:text-red-400"
      }`}
    >
      <Heart size={13} fill={liked ? "currentColor" : "none"} />
    </button>
  );
}

// ── Grid card ─────────────────────────────────────────────────────────────────
function GridCard({ product }) {
  const [liked, setLiked] = useState(false);
  const tagClass = TAG_STYLES[product.tag] || "bg-gray-50 text-gray-500 border-gray-200";

  return (
    <div className="group flex flex-col rounded-2xl overflow-hidden border border-white/60 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 bg-white/40">
      {/* Image */}
      <div className="relative h-36 sm:h-44 overflow-hidden bg-gradient-to-br from-indigo-50 via-sky-50 to-purple-50 shrink-0">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
        {product.tag && (
          <span className={`absolute top-2.5 right-2.5 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${tagClass}`}>
            {product.tag}
          </span>
        )}
        <div className="absolute top-2.5 left-2.5">
          <WishButton liked={liked} onToggle={() => setLiked(l => !l)} />
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-3 sm:p-4">
        {product.brand && (
          <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-0.5">{product.brand}</p>
        )}
        <h3 className="font-semibold text-sm sm:text-[15px] text-gray-900 leading-snug line-clamp-1 mb-1">
          {product.name}
        </h3>
        <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2 mb-2">
          {product.specs}
        </p>
        <StarRating rating={product.rating} reviews={product.reviews} />

        <div className="flex items-center justify-between mt-auto pt-3 gap-2">
          <div className="leading-tight">
            <span className="text-base sm:text-lg font-bold text-primary">₹{product.pricePerDay}</span>
            <span className="text-[10px] text-gray-400 ml-0.5">/day</span>
          </div>
          <Link
            href={`/booking?product=${product.id}`}
            className="text-[11px] sm:text-xs font-semibold bg-primary text-white px-3 sm:px-4 py-1.5 rounded-full hover:opacity-90 active:scale-95 transition-all shrink-0 shadow-sm"
          >
            Rent now
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── List card ─────────────────────────────────────────────────────────────────
// Works on BOTH mobile and desktop
function ListCard({ product }) {
  const [liked, setLiked] = useState(false);
  const tagClass = TAG_STYLES[product.tag] || "bg-gray-50 text-gray-500 border-gray-200";

  return (
    <div className="group flex flex-row rounded-2xl overflow-hidden border border-white/60 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-200 bg-white/40">
      {/* Image — fixed width on all screens */}
      <div className="relative w-28 sm:w-44 shrink-0 bg-gradient-to-br from-indigo-50 via-sky-50 to-purple-50 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 112px, 176px"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
        {product.tag && (
          <span className={`absolute top-2 left-2 text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${tagClass}`}>
            {product.tag}
          </span>
        )}
      </div>

      {/* Middle — content */}
      <div className="flex flex-col flex-1 min-w-0 px-3 sm:px-4 py-3">
        {product.brand && (
          <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-gray-400 mb-0.5">{product.brand}</p>
        )}
        <h3 className="font-semibold text-sm sm:text-base text-gray-900 leading-snug mb-1 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-[11px] sm:text-xs text-gray-500 mb-1.5 line-clamp-2 leading-relaxed">
          {product.specs}
        </p>
        <StarRating rating={product.rating} reviews={product.reviews} />
      </div>

      {/* Right — price + actions */}
      <div className="flex flex-col items-end justify-between px-3 sm:px-4 py-3 shrink-0">
        <WishButton liked={liked} onToggle={() => setLiked(l => !l)} />
        <div className="flex flex-col items-end gap-1.5">
          <div className="text-right leading-tight">
            <div className="text-base sm:text-lg font-bold text-primary">₹{product.pricePerDay}</div>
            <div className="text-[9px] text-gray-400">/day</div>
          </div>
          <Link
            href={`/booking?product=${product.id}`}
            className="text-[11px] sm:text-xs font-semibold bg-primary text-white px-3 sm:px-4 py-1.5 rounded-full hover:opacity-90 active:scale-95 transition-all whitespace-nowrap shadow-sm"
          >
            Rent now
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ProductCard({ product, viewMode = "grid" }) {
  if (viewMode === "list") return <ListCard product={product} />;
  return <GridCard product={product} />;
}