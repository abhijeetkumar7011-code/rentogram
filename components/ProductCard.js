"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Heart } from "lucide-react";

// Badge styling per tag type
const TAG_STYLES = {
  Premium:        "bg-violet-50 text-violet-600 border-violet-200",
  "New arrival":  "bg-blue-50 text-blue-600 border-blue-200",
  "New Arrival":  "bg-blue-50 text-blue-600 border-blue-200",
  Budget:         "bg-emerald-50 text-emerald-600 border-emerald-200",
  "Budget Friendly":"bg-emerald-50 text-emerald-600 border-emerald-200",
  Refurb:         "bg-amber-50 text-amber-600 border-amber-200",
};

function StarRating({ rating = 4.5, reviews = 0 }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="flex items-center gap-1">
      <div className="flex text-amber-400 text-[11px] leading-none">
        {"★".repeat(full)}
        {half && "½"}
        {"☆".repeat(5 - full - (half ? 1 : 0))}
      </div>
      {reviews > 0 && (
        <span className="text-[10px] text-gray-400">({reviews})</span>
      )}
    </div>
  );
}

// ── Grid card ────────────────────────────────────────────────────────────────
function GridCard({ product }) {
  const [liked, setLiked] = useState(false);
  const tagClass = TAG_STYLES[product.tag] || "bg-gray-50 text-gray-500 border-gray-200";

  return (
    <div className="group bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/70 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200">

      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-indigo-50 via-sky-50 to-purple-50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />

        {/* Tag badge */}
        {product.tag && (
          <span className={`absolute top-2.5 right-2.5 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${tagClass}`}>
            {product.tag}
          </span>
        )}

        {/* Wishlist */}
        <button
          onClick={() => setLiked((l) => !l)}
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute top-2.5 left-2.5 w-7 h-7 rounded-full flex items-center justify-center border transition-colors ${
            liked
              ? "bg-red-50 border-red-200 text-red-500"
              : "bg-white/80 border-gray-200 text-gray-400 hover:bg-red-50 hover:border-red-200 hover:text-red-400"
          }`}
        >
          <Heart size={13} fill={liked ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Body */}
      <div className="p-3.5 sm:p-4">
        {product.brand && (
          <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-0.5">{product.brand}</p>
        )}
        <h3 className="font-semibold text-sm text-gray-900 mb-1 leading-snug line-clamp-1">
          {product.name}
        </h3>
        <p className="text-[11px] text-gray-500 mb-2 line-clamp-2 leading-relaxed">
          {product.specs}
        </p>
        <StarRating rating={product.rating} reviews={product.reviews} />

        <div className="flex items-center justify-between mt-3 gap-2">
          <div>
            <span className="text-base font-bold text-primary">₹{product.pricePerDay}</span>
            <span className="text-[10px] text-gray-400 ml-0.5">/day</span>
          </div>
          <Link
            href={`/booking?product=${product.id}`}
            className="text-xs font-semibold bg-primary text-white px-3.5 py-1.5 rounded-full hover:opacity-90 active:scale-95 transition-all shrink-0"
          >
            Rent now
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── List card ────────────────────────────────────────────────────────────────
function ListCard({ product }) {
  const [liked, setLiked] = useState(false);
  const tagClass = TAG_STYLES[product.tag] || "bg-gray-50 text-gray-500 border-gray-200";

  return (
    <div className="group bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden border border-white/70 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200 flex items-center gap-0">

      {/* Image */}
      <div className="relative w-36 sm:w-48 shrink-0 h-28 sm:h-32 bg-gradient-to-br from-indigo-50 via-sky-50 to-purple-50 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="192px"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0 px-4 py-3">
        {product.brand && (
          <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-0.5">{product.brand}</p>
        )}
        <div className="flex items-start gap-2 mb-1">
          <h3 className="font-semibold text-sm sm:text-base text-gray-900 leading-snug">{product.name}</h3>
          {product.tag && (
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 mt-0.5 ${tagClass}`}>
              {product.tag}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 mb-2">{product.specs}</p>
        <StarRating rating={product.rating} reviews={product.reviews} />
      </div>

      {/* Right actions */}
      <div className="shrink-0 flex flex-col items-end gap-2 px-4 py-3">
        <div className="text-right">
          <span className="text-lg font-bold text-primary">₹{product.pricePerDay}</span>
          <span className="text-[10px] text-gray-400 ml-0.5">/day</span>
        </div>
        <Link
          href={`/booking?product=${product.id}`}
          className="text-xs font-semibold bg-primary text-white px-4 py-1.5 rounded-full hover:opacity-90 active:scale-95 transition-all whitespace-nowrap"
        >
          Rent now
        </Link>
        <button
          onClick={() => setLiked((l) => !l)}
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          className={`flex items-center gap-1 text-[10px] transition-colors ${liked ? "text-red-500" : "text-gray-400 hover:text-red-400"}`}
        >
          <Heart size={11} fill={liked ? "currentColor" : "none"} />
          {liked ? "Saved" : "Wishlist"}
        </button>
      </div>
    </div>
  );
}

// ── Export ───────────────────────────────────────────────────────────────────
export default function ProductCard({ product, viewMode = "grid" }) {
  if (viewMode === "list") return <ListCard product={product} />;
  return <GridCard product={product} />;
}