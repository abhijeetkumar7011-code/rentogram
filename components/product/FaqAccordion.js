"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FaqAccordion({ faqs = [] }) {
  const [open, setOpen] = useState(null);
  if (!faqs.length) return null;

  return (
    <div className="space-y-2.5">
      {faqs.map((f, i) => (
        <div key={f.q} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 text-left"
          >
            <span className="text-sm font-medium text-gray-900">{f.q}</span>
            <ChevronDown
              size={16}
              className={`text-primary shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`}
            />
          </button>
          <div
            className={`px-4 sm:px-5 overflow-hidden transition-all duration-300 ${
              open === i ? "max-h-40 pb-3 sm:pb-4" : "max-h-0"
            }`}
          >
            <p className="text-xs sm:text-sm text-gray-600">{f.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}