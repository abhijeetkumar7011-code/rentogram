"use client";

import { useState } from "react";
import { Share2, Link2, Check, MessageCircle } from "lucide-react";

export default function ShareBar({ title }) {
  const [copied, setCopied] = useState(false);

  function getUrl() {
    return typeof window !== "undefined" ? window.location.href : "";
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(getUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked — no-op, button just won't show the "copied" state
    }
  }

  async function handleShare() {
    const url = getUrl();
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // user cancelled share — no-op
      }
    } else {
      handleCopy();
    }
  }

  function handleWhatsapp() {
    const url = getUrl();
    window.open(`https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`, "_blank");
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleShare}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-3 py-2 rounded-full transition-soft"
      >
        <Share2 size={13} /> Share
      </button>
      <button
        onClick={handleWhatsapp}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-3 py-2 rounded-full transition-soft"
      >
        <MessageCircle size={13} /> WhatsApp
      </button>
      <button
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-3 py-2 rounded-full transition-soft"
      >
        {copied ? <Check size={13} className="text-emerald-500" /> : <Link2 size={13} />}
        {copied ? "Copied!" : "Copy link"}
      </button>
    </div>
  );
}