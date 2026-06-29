"use client";

import { useState } from "react";
import Link from "next/link";
import { Laptop, Mail, Phone, MapPin, Instagram, Linkedin, Twitter, Send } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(e) {
    e.preventDefault();
    // TODO: send email to Supabase `newsletter_subscribers` table
    setSubscribed(true);
    setEmail("");
  }

  return (
    <footer className="relative mt-20 overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#312E81] text-gray-300 w-full max-w-full">
      {/* Decorative gradient accent divider */}
      <div className="relative flex items-center justify-center pt-7 sm:pt-10 pb-2">
        <div className="h-px w-24 bg-gradient-to-r from-transparent to-cyan-400/40" />
        <div className="mx-3 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-cyan-400 to-pink-400 flex items-center justify-center shadow-lg rotate-3">
          <Laptop className="text-white" size={18} />
        </div>
        <div className="h-px w-24 bg-gradient-to-l from-transparent to-indigo-400/40" />
      </div>

      {/* Soft glowing orbs for depth */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-10 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl -translate-x-1/2" />

      <div className="relative max-w-6xl mx-auto px-5 sm:px-6 py-8 sm:py-14">
        {/* Newsletter Strip */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-5 sm:p-8 mb-8 sm:mb-14 flex flex-col md:flex-row items-center md:items-center text-center md:text-left justify-between gap-4 sm:gap-6">
          <div>
            <h3 className="font-semibold text-lg text-white">Stay in the loop</h3>
            <p className="text-sm text-gray-400">Get rental deals & servicing tips in your inbox.</p>
          </div>
          {subscribed ? (
            <p className="text-cyan-300 font-medium text-sm">Thanks for subscribing! 🎉</p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex w-full md:w-auto gap-2">
              <input
                required
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 md:w-64 px-4 py-2.5 rounded-full bg-white/10 border border-white/20 text-sm text-white placeholder:text-gray-400 focus:outline-cyan-400"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-indigo-500 to-cyan-400 text-white p-2.5 rounded-full transition-soft hover-lift shadow-lg"
                aria-label="Subscribe"
              >
                <Send size={18} />
              </button>
            </form>
          )}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10 text-sm">
          <div className="col-span-2 sm:col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-base sm:text-lg text-white mb-2.5 sm:mb-3">
              <Laptop size={20} className="text-cyan-300" />
              Rentogram
            </Link>
            <p className="text-gray-400 text-xs sm:text-sm">Rent. Use. Return.<br />Tech made easy and affordable.</p>
            <div className="flex gap-3 mt-3 sm:mt-4">
              <a href="#" aria-label="Instagram" className="p-2 bg-white/10 rounded-full transition-soft hover-lift hover:bg-white/20 text-cyan-300">
                <Instagram size={16} />
              </a>
              <a href="#" aria-label="LinkedIn" className="p-2 bg-white/10 rounded-full transition-soft hover-lift hover:bg-white/20 text-cyan-300">
                <Linkedin size={16} />
              </a>
              <a href="#" aria-label="Twitter" className="p-2 bg-white/10 rounded-full transition-soft hover-lift hover:bg-white/20 text-cyan-300">
                <Twitter size={16} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm sm:text-base mb-2 sm:mb-3">Explore</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-gray-400 text-xs sm:text-sm">
              <li><Link href="/products" className="hover:text-cyan-300 transition-soft">Products</Link></li>
              <li><Link href="/servicing" className="hover:text-cyan-300 transition-soft">Servicing</Link></li>
              <li><Link href="/booking" className="hover:text-cyan-300 transition-soft">Booking</Link></li>
              <li><Link href="/about" className="hover:text-cyan-300 transition-soft">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm sm:text-base mb-2 sm:mb-3">Categories</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-gray-400 text-xs sm:text-sm">
              <li><Link href="/products" className="hover:text-cyan-300 transition-soft">Laptops</Link></li>
              <li><Link href="/products" className="hover:text-cyan-300 transition-soft">Monitors</Link></li>
              <li><Link href="/servicing" className="hover:text-cyan-300 transition-soft">Repair & Maintenance</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm sm:text-base mb-2 sm:mb-3">Contact</h4>
            <ul className="space-y-2 sm:space-y-3 text-gray-400 text-xs sm:text-sm">
              <li className="flex items-center gap-2">
                <Mail size={15} className="text-cyan-300" /> support@rentogram.com
              </li>
              <li className="flex items-center gap-2">
                <Phone size={15} className="text-cyan-300" /> +91 98765 43210
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={15} className="text-cyan-300" /> Delhi, India
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10 py-5">
        <p className="text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Rentogram | Developed by Abhijeet Verma
        </p>
      </div>
    </footer>
  );
}