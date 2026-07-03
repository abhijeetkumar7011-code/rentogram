"use client";

import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Link from "next/link";
import Image from "next/image";
import {
  Laptop,
  Monitor,
  Wrench,
  Search,
  CalendarCheck,
  Truck,
  Star,
  Server,
  Printer,
  Tv,
  Apple,
  ArrowRight,
  MapPin,
  ShieldCheck,
  Clock,
  Sparkles,
  Zap,
  BadgeCheck,
  Quote,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

const AVATAR_COLORS = [
  "from-indigo-500 to-violet-500",
  "from-cyan-500 to-blue-500",
  "from-pink-500 to-rose-500",
  "from-amber-500 to-orange-500",
];

function initials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const BRANDS = ["Dell", "HP", "Lenovo", "Apple", "Samsung", "LG", "Acer", "ASUS"];

const FEATURED_DEVICES = [
  { name: "MacBook Pro 14\"", tag: "Premium", image: "/images/macbook.jpg" },
  { name: "Dell Business Laptop", tag: "Popular", image: "/images/normal_laptop.jpg" },
  { name: "Samsung 4K 32\" Monitor", tag: "4K HDR", image: "/images/Samsung_4K_32.jpg" },
  { name: "LG UltraWide 27\"", tag: "Productivity", image: "/images/LG_UltraWide_27.jpg" },
];

const CITIES = [
  { city: "Delhi", from: "from-indigo-400", to: "to-indigo-600", desc: "Our home base — the fastest delivery times and the widest device selection in the network.", highlights: ["Same-day delivery", "Full servicing support", "Widest inventory"] },
  { city: "Noida", from: "from-amber-400", to: "to-amber-600", desc: "Quick doorstep delivery across all major sectors, from residential towers to tech parks.", highlights: ["Next-day delivery", "Corporate bulk rentals", "On-site servicing"] },
  { city: "Ghaziabad", from: "from-purple-400", to: "to-purple-600", desc: "Reliable rental and servicing support for homes, students and growing businesses.", highlights: ["Flexible rental terms", "Doorstep pickup", "Quick support response"] },
  { city: "Faridabad", from: "from-cyan-400", to: "to-cyan-600", desc: "Dependable coverage for laptops, monitors and office setups across the city.", highlights: ["Affordable plans", "Free delivery", "Repair support"] },
  { city: "Gurugram", from: "from-pink-400", to: "to-pink-600", desc: "Fast turnaround for corporate hubs, co-working spaces and tech parks.", highlights: ["Priority corporate support", "Bulk device rentals", "Same-day setup"] },
  { city: "Meerut", from: "from-rose-400", to: "to-rose-600", desc: "One of our newest zones — expanding fast with reliable doorstep delivery.", highlights: ["Growing inventory", "Doorstep delivery", "Local support team"] },
];

const STEPS = [
  { icon: Search, step: "01", title: "Browse & Select", desc: "Pick the laptop or monitor that fits your needs from our catalog.", time: "~2 min", from: "from-indigo-500", to: "to-violet-500" },
  { icon: CalendarCheck, step: "02", title: "Choose Dates & Book", desc: "Select your rental duration and confirm your booking instantly.", time: "Instant", from: "from-cyan-500", to: "to-blue-500" },
  { icon: Truck, step: "03", title: "Delivery & Servicing", desc: "We deliver to your doorstep — and handle any servicing along the way.", time: "Same day", from: "from-pink-500", to: "to-rose-500" },
];

const TESTIMONIALS = [
  { name: "Aditi Sharma", role: "Freelance Designer", text: "Rented a monitor for a 2-month project — smooth delivery and great condition. Saved me from buying one outright." },
  { name: "Rohan Mehta", role: "College Student", text: "Needed a laptop for exam season. Affordable pricing and the servicing team fixed a minor issue same day." },
  { name: "Priya Nair", role: "Startup Founder", text: "We rent laptops for our interns through Rentogram — flexible terms and reliable support every time." },
];

export default function Home() {
  const [activeCity, setActiveCity] = useState(0);

  useEffect(() => {
    AOS.init({ duration: 700, once: true, disableMutationObserver: false });
    const refresh = () => AOS.refreshHard();
    window.addEventListener("load", refresh);
    return () => window.removeEventListener("load", refresh);
  }, []);

  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-24 pb-10 sm:pb-24">
        {/* floating gradient blobs */}
        <div className="absolute -top-10 left-0 w-32 h-32 sm:w-72 sm:h-72 bg-indigo-300/30 rounded-full blur-3xl -z-10" />
        <div className="absolute top-20 right-0 w-32 h-32 sm:w-80 sm:h-80 bg-pink-300/30 rounded-full blur-3xl -z-10" />
        <div className="absolute top-32 left-1/3 w-28 h-28 sm:w-64 sm:h-64 bg-cyan-300/30 rounded-full blur-3xl -z-10" />

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-8 items-center">
          {/* ---- left: copy ---- */}
          <div className="text-center lg:text-left">
            <span
              data-aos="fade-up"
              className="inline-flex items-center gap-1.5 bg-white shadow-sm text-primary font-semibold text-[11px] sm:text-xs uppercase tracking-wide px-3.5 sm:px-4 py-1.5 rounded-full mb-4 sm:mb-6 border border-primary/10"
            >
              <Sparkles size={12} /> Delhi-NCR's Trusted Tech Rental
            </span>

            <h1
              data-aos="fade-up"
              data-aos-delay="100"
              className="text-[2.35rem] leading-[1.1] sm:text-6xl sm:leading-[1.05] lg:text-6xl font-extrabold text-gray-900 tracking-tight"
            >
              Rent Tech,
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-violet-500 to-pink-500 bg-clip-text text-transparent">
                Not Headaches.
              </span>
            </h1>

            <p
              data-aos="fade-up"
              data-aos-delay="200"
              className="mt-4 sm:mt-7 text-sm sm:text-xl text-gray-700 max-w-xs sm:max-w-xl mx-auto lg:mx-0"
            >
              Laptops, monitors & more — delivered, serviced, and supported.
              Rentogram makes tech rental simple, affordable and reliable.
            </p>

            <div
              data-aos="fade-up"
              data-aos-delay="300"
              className="mt-6 sm:mt-10 flex flex-col sm:flex-row justify-center lg:justify-start gap-2.5 sm:gap-4"
            >
              <Link
                href="/products"
                className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-full font-semibold text-sm sm:text-base transition-soft hover:shadow-xl hover:-translate-y-0.5 shadow-lg w-full sm:w-auto"
              >
                Browse Products
                <ArrowRight size={17} className="transition-soft group-hover:translate-x-1" />
              </Link>
              <Link
                href="/servicing"
                className="inline-flex items-center justify-center bg-white text-primary border-2 border-primary/20 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full font-semibold text-sm sm:text-base transition-soft hover:border-primary hover:-translate-y-0.5 shadow-sm w-full sm:w-auto"
              >
                Get Servicing
              </Link>
            </div>

            {/* trust stat strip — always a single row, even on the smallest screens */}
            <div
              data-aos="fade-up"
              data-aos-delay="400"
              className="mt-8 sm:mt-14 grid grid-cols-4 gap-x-1.5 sm:gap-x-8 justify-items-center lg:justify-items-start text-center lg:text-left border-t border-gray-200/70 sm:border-0 pt-5 sm:pt-0"
            >
              {[
                { value: "500+", label: "Devices" },
                { value: "6", label: "Cities" },
                { value: "24-48h", label: "Service" },
                { value: "4.8★", label: "Rating" },
              ].map((s) => (
                <div key={s.label} className="min-w-0">
                  <p className="text-sm xs:text-base sm:text-3xl font-extrabold text-gray-900 whitespace-nowrap">{s.value}</p>
                  <p className="text-[8.5px] sm:text-sm text-gray-500 whitespace-nowrap">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ---- right: hero visual ---- */}
          <div data-aos="fade-up" data-aos-delay="150" className="relative mx-auto max-w-[260px] sm:max-w-md lg:max-w-none w-full mt-4 sm:mt-0">
            <div className="absolute -inset-4 sm:-inset-6 bg-gradient-to-br from-indigo-400/20 via-violet-400/20 to-pink-400/20 rounded-[2rem] sm:rounded-[2.5rem] blur-2xl -z-10" />

            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/60 aspect-[4/3]">
              <Image
                src="/images/macbook.jpg"
                alt="Laptop available for rent on Rentogram"
                fill
                sizes="(max-width: 1024px) 90vw, 40vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
            </div>

            {/* floating badge: verified quality */}
            <div className="z-20 flex absolute -top-4 -left-3 sm:-top-5 sm:-left-5 items-center gap-1.5 sm:gap-2 bg-white shadow-lg rounded-xl sm:rounded-2xl px-2.5 py-1.5 sm:px-4 sm:py-2.5 text-[9px] sm:text-xs font-semibold text-gray-700 rotate-[-4deg]">
              <ShieldCheck size={13} className="text-emerald-500 shrink-0" /> Quality Checked
            </div>

            {/* floating badge: delivery */}
            <div className="z-20 flex absolute top-1/2 -right-2 sm:-right-6 items-center gap-1.5 sm:gap-2 bg-white shadow-lg rounded-xl sm:rounded-2xl px-2.5 py-1.5 sm:px-4 sm:py-2.5 text-[9px] sm:text-xs font-semibold text-gray-700 rotate-[3deg]">
              <Zap size={13} className="text-cyan-500 shrink-0" /> Same-Day
            </div>

            {/* floating badge: rating */}
            <div className="z-20 flex absolute -bottom-4 left-3 sm:left-1/4 sm:-bottom-5 items-center gap-1.5 sm:gap-2 bg-white shadow-lg rounded-xl sm:rounded-2xl px-2.5 py-1.5 sm:px-4 sm:py-2.5 text-[9px] sm:text-xs font-semibold text-gray-700 rotate-[-2deg]">
              <Star size={13} className="text-amber-500 shrink-0" fill="currentColor" /> 4.8 Rating
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRUSTED BRANDS MARQUEE ===== */}
      <section className="py-8 sm:py-10 border-y border-gray-100/80 bg-white/40">
        <p data-aos="fade-up" className="text-center text-xs uppercase tracking-widest text-gray-400 font-semibold mb-5">
          Devices from brands you trust
        </p>
        <div className="max-w-6xl mx-auto overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex w-max animate-marquee gap-12 sm:gap-16">
            {[...BRANDS, ...BRANDS].map((b, i) => (
              <span key={`${b}-${i}`} className="text-lg sm:text-2xl font-bold text-gray-400/80 whitespace-nowrap select-none">
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES (Bento style) ===== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
          <div
            data-aos="fade-up"
            className="sm:col-span-2 relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-lg flex flex-col justify-between min-h-[220px] sm:min-h-[260px]"
          >
            <Image
              src="/images/normal_laptop.jpg"
              alt="Latest laptops and monitors available for rent"
              fill
              sizes="(max-width: 640px) 100vw, 66vw"
              className="object-cover -z-20"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 via-violet-800/80 to-purple-900/70 -z-10" />
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
            <div className="p-6 sm:p-10">
              <Laptop className="mb-3 sm:mb-4 text-white" size={28} />
              <h3 className="font-bold text-lg sm:text-2xl mb-2 text-white">Latest Laptops & Monitors</h3>
              <p className="text-white/80 text-sm sm:text-base max-w-md">
                Dell, HP, Lenovo & Apple — pick from a wide, quality-checked inventory for every need.
              </p>
            </div>
            <Link href="/products" className="relative inline-flex items-center gap-1.5 text-sm font-semibold mt-4 px-6 sm:px-10 pb-6 sm:pb-10 text-white">
              Explore Catalog <ArrowRight size={15} />
            </Link>
          </div>

          <div
            data-aos="fade-up"
            data-aos-delay="100"
            className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-md border border-gray-100 flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center mb-3 sm:mb-4 shadow-sm">
                <Wrench className="text-white" size={20} />
              </div>
              <h3 className="font-bold text-base sm:text-lg mb-1.5 text-gray-900">Expert Servicing</h3>
              <p className="text-gray-600 text-xs sm:text-sm">
                Repairs & maintenance handled by certified technicians, fast.
              </p>
            </div>
          </div>

          <div
            data-aos="fade-up"
            className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-md border border-gray-100"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center mb-3 sm:mb-4 shadow-sm">
              <Truck className="text-white" size={20} />
            </div>
            <h3 className="font-bold text-base sm:text-lg mb-1.5 text-gray-900">Doorstep Delivery</h3>
            <p className="text-gray-600 text-xs sm:text-sm">
              Free delivery & pickup across Delhi-NCR, on your schedule.
            </p>
          </div>

          <div
            data-aos="fade-up"
            data-aos-delay="100"
            className="sm:col-span-2 relative overflow-hidden bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-md border border-gray-100 flex items-center gap-4 sm:gap-6"
          >
            <div className="w-11 h-11 sm:w-14 sm:h-14 shrink-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-sm">
              <ShieldCheck className="text-white" size={22} />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg mb-1 text-gray-900">100% Quality Checked</h3>
              <p className="text-gray-600 text-xs sm:text-sm">
                Every device inspected and tested before it reaches your doorstep — no surprises.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURED DEVICES ===== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-7 sm:mb-10">
          <div>
            <span data-aos="fade-up" className="inline-block bg-primary/10 text-primary font-semibold text-xs uppercase tracking-wide px-4 py-1.5 rounded-full mb-3">
              Popular Right Now
            </span>
            <h2 data-aos="fade-up" data-aos-delay="100" className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              Featured <span className="text-primary">Devices</span>
            </h2>
          </div>
          <Link href="/products" data-aos="fade-up" className="hidden sm:inline-flex items-center gap-1.5 text-primary font-semibold text-sm hover:gap-2.5 transition-soft">
            View all products <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {FEATURED_DEVICES.map((d, i) => (
            <Link
              href="/products"
              key={d.name}
              data-aos="fade-up"
              data-aos-delay={i * 100}
              className="group bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 transition-soft hover:-translate-y-1.5 hover:shadow-xl flex flex-col"
            >
              <div className="relative aspect-square overflow-hidden bg-gray-50">
                <Image
                  src={d.image}
                  alt={d.name}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2.5 left-2.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/90 text-primary border border-primary/10">
                  {d.tag}
                </span>
              </div>
              <div className="p-3 sm:p-4">
                <h3 className="font-semibold text-xs sm:text-sm text-gray-900 leading-snug line-clamp-1 mb-1.5">
                  {d.name}
                </h3>
                <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-primary group-hover:gap-1.5 transition-soft">
                  Check Availability <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <Link href="/products" className="sm:hidden mt-6 flex items-center justify-center gap-1.5 text-primary font-semibold text-sm">
          View all products <ArrowRight size={15} />
        </Link>
      </section>

      {/* ===== WHAT WE OFFER ===== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-20">
        <div className="text-center max-w-2xl mx-auto mb-7 sm:mb-14">
          <span data-aos="fade-up" className="inline-block bg-primary/10 text-primary font-semibold text-xs uppercase tracking-wide px-4 py-1.5 rounded-full mb-3">
            What We Offer
          </span>
          <h2 data-aos="fade-up" data-aos-delay="100" className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Our IT Rental Solutions for Corporates
          </h2>
          <p data-aos="fade-up" data-aos-delay="150" className="text-gray-700 text-sm sm:text-base">
            From laptops to servers, we provide a complete range of IT hardware rentals so you can
            set up a fully equipped, high-performance workplace with speed, flexibility and
            reliable support.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
          {[
            { icon: Laptop, title: "Laptop Rentals", desc: "Business laptops from Dell, HP, Lenovo & Apple — for every kind of work.", link: "/services/laptop-rentals", from: "from-indigo-400", to: "to-indigo-600" },
            { icon: Monitor, title: "Desktop Rentals", desc: "Standard & high-performance desktops for offices and studios.", link: "/services/desktop-rentals", from: "from-cyan-400", to: "to-cyan-600" },
            { icon: Apple, title: "Apple Device Rentals", desc: "Premium MacBooks and iMacs for creative professionals.", link: "/services/apple-rentals", from: "from-gray-500", to: "to-gray-800" },
            { icon: Server, title: "Server Rentals", desc: "Enterprise-grade servers for hosting & infrastructure needs.", link: "/services/server-rentals", from: "from-purple-400", to: "to-purple-600" },
            { icon: Printer, title: "Printer Rentals", desc: "High-speed multifunction printers for business environments.", link: "/services/printer-rentals", from: "from-pink-400", to: "to-pink-600" },
            { icon: Tv, title: "Smart TV Rentals", desc: "Large-format displays for conferences & exhibitions.", link: "/services/smart-tv-rentals", from: "from-amber-400", to: "to-amber-600" },
          ].map((item, i) => (
            <Link
              href={item.link}
              key={item.title}
              data-aos="fade-up"
              data-aos-delay={(i % 3) * 150}
              className="group relative bg-white rounded-xl sm:rounded-2xl p-3 sm:p-7 shadow-md border border-gray-100 transition-soft hover:-translate-y-2 hover:shadow-xl flex flex-col overflow-hidden"
            >
              <div className={`absolute -top-10 -right-10 w-28 h-28 bg-gradient-to-br ${item.from} ${item.to} opacity-0 group-hover:opacity-15 rounded-full blur-2xl transition-soft`} />
              <div className={`relative w-9 h-9 sm:w-14 sm:h-14 rounded-lg sm:rounded-2xl bg-gradient-to-br ${item.from} ${item.to} flex items-center justify-center mb-2.5 sm:mb-5 shadow-md transition-soft group-hover:scale-110 group-hover:rotate-3`}>
                <item.icon className="text-white" size={16} />
              </div>
              <h3 className="font-semibold text-xs sm:text-lg mb-1 sm:mb-2 text-gray-900">{item.title}</h3>
              <p className="text-[11px] sm:text-sm text-gray-600 mb-2.5 sm:mb-5 flex-1 line-clamp-3 sm:line-clamp-none">{item.desc}</p>
              <span className="relative inline-flex items-center gap-1 text-primary font-semibold text-[11px] sm:text-sm transition-soft group-hover:gap-2.5">
                Know More <ArrowRight size={13} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-20">
        <div className="text-center max-w-xl mx-auto mb-9 sm:mb-16">
          <span data-aos="fade-up" className="inline-block bg-secondary/10 text-secondary font-semibold text-xs uppercase tracking-wide px-4 py-1.5 rounded-full mb-3">
            Simple Process
          </span>
          <h2 data-aos="fade-up" data-aos-delay="100" className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            How It <span className="text-primary">Works</span>
          </h2>
        </div>

        {/* ---- desktop: horizontal flow with connecting arrows ---- */}
        <div className="hidden md:flex items-stretch gap-3">
          {STEPS.map((item, i) => (
            <div key={item.step} className="flex items-stretch flex-1">
              <div
                data-aos="fade-up"
                data-aos-delay={i * 150}
                className="group relative flex-1 bg-white rounded-3xl border border-gray-100 shadow-md p-7 pt-8 overflow-hidden transition-soft hover:-translate-y-2 hover:shadow-xl"
              >
                <div className={`absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br ${item.from} ${item.to} opacity-0 group-hover:opacity-10 rounded-full blur-2xl transition-soft`} />

                <div className="relative flex items-center justify-between mb-5">
                  <div className="relative">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.from} ${item.to} flex items-center justify-center shadow-lg transition-soft group-hover:scale-110 group-hover:rotate-6`}>
                      <item.icon className="text-white" size={26} />
                    </div>
                    <span className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-xs font-extrabold text-gray-900">
                      {i + 1}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">
                    <Clock size={11} /> {item.time}
                  </span>
                </div>
                <h3 className="relative font-bold text-lg mb-2 text-gray-900 flex items-baseline gap-2">
                  <span className={`font-mono text-sm font-bold bg-gradient-to-r ${item.from} ${item.to} bg-clip-text text-transparent`}>
                    0{i + 1}
                  </span>
                  {item.title}
                </h3>
                <p className="relative text-sm text-gray-600">{item.desc}</p>
              </div>

              {i < STEPS.length - 1 && (
                <div data-aos="zoom-in" data-aos-delay={i * 150 + 100} className="flex items-center justify-center px-2 shrink-0">
                  <div className="w-9 h-9 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-primary">
                    <ChevronRight size={18} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ---- mobile: connected vertical timeline ---- */}
        <div className="md:hidden relative pl-[52px]">
          <div className="absolute left-[23px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent opacity-25" />
          {STEPS.map((item, i) => (
            <div
              key={item.step}
              data-aos="fade-up"
              data-aos-delay={i * 120}
              className="relative mb-6 last:mb-0"
            >
              <div className={`absolute -left-[52px] top-0 w-12 h-12 rounded-2xl bg-gradient-to-br ${item.from} ${item.to} flex items-center justify-center shadow-lg ring-4 ring-white`}>
                <item.icon className="text-white" size={20} />
              </div>
              <span className="absolute -left-[18px] -top-1 w-5 h-5 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-[10px] font-extrabold text-gray-900">
                {i + 1}
              </span>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 ml-1">
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`font-mono text-xs font-bold bg-gradient-to-r ${item.from} ${item.to} bg-clip-text text-transparent tracking-wide`}>
                    0{i + 1}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-gray-500 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
                    <Clock size={10} /> {item.time}
                  </span>
                </div>
                <h3 className="font-semibold text-sm mb-1 text-gray-900">{item.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== WHERE WE ARE AVAILABLE ===== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-20">
        <div className="text-center max-w-xl mx-auto mb-9 sm:mb-14">
          <span data-aos="fade-up" className="inline-flex items-center gap-1.5 bg-secondary/10 text-secondary font-semibold text-xs uppercase tracking-wide px-3.5 py-1.5 rounded-full mb-3">
            <MapPin size={13} /> Service Coverage
          </span>
          <h2 data-aos="fade-up" data-aos-delay="100" className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Where We Are <span className="text-primary">Available</span>
          </h2>
          <p data-aos="fade-up" data-aos-delay="150" className="text-gray-700 text-sm sm:text-base">
            Tap a city to see what Rentogram offers there.
          </p>
        </div>

        <div data-aos="fade-up" className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl border border-white/60 bg-white/40 backdrop-blur-xl">
          {/* fancy glass decoration */}
          <div className="absolute -top-16 -left-16 w-56 h-56 bg-indigo-300/30 rounded-full blur-3xl -z-10" />
          <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-pink-300/30 rounded-full blur-3xl -z-10" />
          <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-cyan-300/20 rounded-full blur-3xl -z-10" />

          {/* city tab strip */}
          <div className="flex gap-2 sm:gap-2.5 overflow-x-auto pb-1 mb-4 sm:mb-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {CITIES.map((loc, i) => (
              <button
                key={loc.city}
                onClick={() => setActiveCity(i)}
                className={`shrink-0 inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold border transition-soft ${
                  activeCity === i
                    ? `bg-gradient-to-r ${loc.from} ${loc.to} text-white border-transparent shadow-md scale-105`
                    : "bg-white/70 text-gray-600 border-gray-200 hover:border-primary/30 hover:text-primary"
                }`}
              >
                <MapPin size={13} />
                {loc.city}
              </button>
            ))}
          </div>

          {/* active city detail panel */}
          <div
            key={activeCity}
            data-aos="fade-up"
            className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg"
          >
            <div className={`relative bg-gradient-to-br ${CITIES[activeCity].from} ${CITIES[activeCity].to} p-5 sm:p-8`}>
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -left-6 -bottom-10 w-32 h-32 bg-black/10 rounded-full blur-2xl" />

              <div className="relative flex items-start gap-3 sm:gap-4 mb-4 sm:mb-5">
                <div className="w-11 h-11 sm:w-14 sm:h-14 shrink-0 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                  <MapPin className="text-white" size={22} />
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs uppercase tracking-wide text-white/70 font-semibold mb-0.5">Now Serving</p>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">{CITIES[activeCity].city}</h3>
                </div>
              </div>

              <p className="relative text-white/90 text-sm sm:text-base max-w-xl mb-5 sm:mb-6">
                {CITIES[activeCity].desc}
              </p>

              <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                {CITIES[activeCity].highlights.map((h) => (
                  <div key={h} className="flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-lg sm:rounded-xl px-3 py-2 sm:py-2.5">
                    <CheckCircle2 className="text-white shrink-0" size={15} />
                    <span className="text-xs sm:text-sm font-medium text-white">{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="relative text-center text-xs sm:text-sm text-gray-600 mt-4 sm:mt-6">
            Don't see your city listed?{" "}
            <a href="/contact" className="text-primary font-medium hover:underline">Get in touch</a> — we may still be able to help.
          </p>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        <span data-aos="fade-up" className="hidden sm:flex justify-center mb-3">
          <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary font-semibold text-xs uppercase tracking-wide px-3.5 py-1.5 rounded-full">
            <Quote size={13} /> Testimonials
          </span>
        </span>
        <h2 data-aos="fade-up" className="text-xl sm:text-3xl font-bold text-center mb-7 sm:mb-12 text-gray-900">
          What Our <span className="text-primary">Customers Say</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.name}
              data-aos="fade-up"
              data-aos-delay={i * 150}
              className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md border border-gray-100 transition-soft hover-lift flex flex-col"
            >
              <div className="flex gap-1 text-secondary mb-2 sm:mb-3">
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="text-sm text-gray-700 mb-4 flex-1">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-3 border-t border-gray-50">
                <div className={`w-9 h-9 shrink-0 rounded-full bg-gradient-to-br ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
                  {initials(t.name)}
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900 flex items-center gap-1">
                    {t.name} <BadgeCheck size={13} className="text-cyan-500" />
                  </p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-20 text-center">
        <div
          data-aos="fade-up"
          className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-pink-600 rounded-3xl p-8 sm:p-14 shadow-xl"
        >
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{ backgroundImage: "url('/images/bg-pattern.svg')", backgroundSize: "180px 180px" }}
          />
          <div className="absolute -top-16 -left-16 w-56 h-56 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-white/10 rounded-full blur-2xl" />
          <Clock className="relative text-white/80 mx-auto mb-4" size={30} />
          <h2 className="relative text-2xl sm:text-3xl font-bold mb-3 text-white">Ready to Rent Smarter?</h2>
          <p className="relative text-white/85 mb-7 sm:mb-8 max-w-xl mx-auto text-sm sm:text-base">
            Join hundreds of students, freelancers & businesses using Rentogram for flexible,
            affordable tech access.
          </p>
          <Link
            href="/products"
            className="relative inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-full font-semibold transition-soft hover:-translate-y-0.5 shadow-lg"
          >
            Explore Products <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </div>
  );
}