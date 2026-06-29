"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Laptop,
  Menu,
  X,
  Package,
  Wrench,
  Info,
  Phone,
  ArrowRight,
} from "lucide-react";

const links = [
  { href: "/products", label: "Products", icon: Package },
  { href: "/servicing", label: "Servicing", icon: Wrench },
  { href: "/about", label: "About", icon: Info },
  { href: "/contact", label: "Contact", icon: Phone },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 shadow-sm">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2 font-bold text-lg sm:text-xl text-primary"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-cyan-400 to-pink-400 flex items-center justify-center shadow-sm">
            <Laptop size={16} className="text-white" />
          </div>
          Rentogram
        </Link>

        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-700">
          {links.map((l) => (
            <Link key={l.href} className="transition-soft hover:text-primary" href={l.href}>
              {l.label}
            </Link>
          ))}
        </div>

        <Link
          href="/booking"
          className="hidden md:inline-flex items-center gap-1.5 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white px-5 py-2 rounded-full text-sm font-medium transition-soft hover-lift shadow-md"
        >
          Rent Now <ArrowRight size={15} />
        </Link>

        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          className="md:hidden text-gray-700 p-1.5 rounded-lg transition-soft hover:bg-primary/10"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile dropdown panel */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="bg-gradient-to-br from-indigo-50 via-cyan-50 to-pink-50 border-t border-gray-100 px-4 py-4 space-y-1.5">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/80 text-sm font-medium text-gray-700 transition-soft hover:bg-white hover:text-primary shadow-sm"
            >
              <l.icon size={17} className="text-primary" />
              {l.label}
            </Link>
          ))}
          <Link
            href="/booking"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-1.5 mt-2 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white px-5 py-3 rounded-xl text-sm font-semibold shadow-md transition-soft"
          >
            Rent Now <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </header>
  );
}
