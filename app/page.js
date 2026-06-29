"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Link from "next/link";
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
} from "lucide-react";

export default function Home() {
  useEffect(() => {
    AOS.init({ duration: 700, once: true });
  }, []);

  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-28 pb-14 sm:pb-24 text-center">
        {/* floating gradient blobs */}
        <div className="absolute -top-10 left-0 w-40 h-40 sm:w-72 sm:h-72 bg-indigo-300/30 rounded-full blur-3xl -z-10" />
        <div className="absolute top-20 right-0 w-40 h-40 sm:w-80 sm:h-80 bg-pink-300/30 rounded-full blur-3xl -z-10" />
        <div className="absolute top-32 left-1/3 w-32 h-32 sm:w-64 sm:h-64 bg-cyan-300/30 rounded-full blur-3xl -z-10" />

        {/* floating mini badges - desktop only */}
        <div data-aos="fade-down" data-aos-delay="300" className="hidden md:flex absolute top-10 left-2 items-center gap-2 bg-white shadow-lg rounded-full px-4 py-2 text-xs font-medium text-gray-700 rotate-[-6deg]">
          <Laptop size={14} className="text-primary" /> 500+ Devices
        </div>
        <div data-aos="fade-down" data-aos-delay="450" className="hidden md:flex absolute top-32 right-4 items-center gap-2 bg-white shadow-lg rounded-full px-4 py-2 text-xs font-medium text-gray-700 rotate-[5deg]">
          <Star size={14} className="text-amber-500" fill="currentColor" /> 4.8 Rating
        </div>
        <div data-aos="fade-down" data-aos-delay="600" className="hidden md:flex absolute top-2 right-1/4 items-center gap-2 bg-white shadow-lg rounded-full px-4 py-2 text-xs font-medium text-gray-700 rotate-[4deg]">
          <Zap size={14} className="text-cyan-500" /> Same-Day Delivery
        </div>

        <span
          data-aos="fade-up"
          className="inline-flex items-center gap-1.5 bg-white shadow-sm text-primary font-semibold text-xs uppercase tracking-wide px-4 py-1.5 rounded-full mb-5 sm:mb-6 border border-primary/10"
        >
          <Sparkles size={13} /> Delhi-NCR's Trusted Tech Rental
        </span>

        <h1
          data-aos="fade-up"
          data-aos-delay="100"
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-gray-900 leading-[1.05] tracking-tight"
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
          className="mt-5 sm:mt-7 text-base sm:text-xl text-gray-700 max-w-2xl mx-auto"
        >
          Laptops, monitors & more — delivered, serviced, and supported.
          Rentogram makes tech rental simple, affordable and reliable.
        </p>

        <div
          data-aos="fade-up"
          data-aos-delay="300"
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4"
        >
          <Link
            href="/products"
            className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-8 py-3.5 rounded-full font-semibold transition-soft hover:shadow-xl hover:-translate-y-0.5 shadow-lg"
          >
            Browse Products
            <ArrowRight size={17} className="transition-soft group-hover:translate-x-1" />
          </Link>
          <Link
            href="/servicing"
            className="bg-white text-primary border-2 border-primary/20 px-8 py-3.5 rounded-full font-semibold transition-soft hover:border-primary hover:-translate-y-0.5 shadow-sm"
          >
            Get Servicing
          </Link>
        </div>

        {/* trust stat strip */}
        <div
          data-aos="fade-up"
          data-aos-delay="400"
          className="mt-12 sm:mt-16 flex flex-wrap justify-center gap-x-8 sm:gap-x-14 gap-y-4 text-center"
        >
          {[
            { value: "500+", label: "Devices Rented" },
            { value: "6", label: "Cities Covered" },
            { value: "24-48h", label: "Servicing Time" },
            { value: "4.8★", label: "Customer Rating" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">{s.value}</p>
              <p className="text-xs sm:text-sm text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FEATURES (Bento style) ===== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
          <div
            data-aos="fade-up"
            className="sm:col-span-2 relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-white shadow-lg flex flex-col justify-between min-h-[180px] sm:min-h-[220px]"
          >
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
            <div>
              <Laptop className="mb-3 sm:mb-4" size={28} />
              <h3 className="font-bold text-lg sm:text-2xl mb-2">Latest Laptops & Monitors</h3>
              <p className="text-white/80 text-sm sm:text-base max-w-md">
                Dell, HP, Lenovo & Apple — pick from a wide, quality-checked inventory for every need.
              </p>
            </div>
            <Link href="/products" className="relative inline-flex items-center gap-1.5 text-sm font-semibold mt-4">
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

        <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-7 sm:gap-8">
          <div className="hidden sm:block absolute top-8 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-primary via-secondary to-accent opacity-30 z-0" />

          {[
            { icon: Search, step: "01", title: "Browse & Select", desc: "Pick the laptop or monitor that fits your needs from our catalog.", from: "from-indigo-500", to: "to-violet-500" },
            { icon: CalendarCheck, step: "02", title: "Choose Dates & Book", desc: "Select your rental duration and confirm your booking instantly.", from: "from-cyan-500", to: "to-blue-500" },
            { icon: Truck, step: "03", title: "Delivery & Servicing", desc: "We deliver to your doorstep — and handle any servicing along the way.", from: "from-pink-500", to: "to-rose-500" },
          ].map((item, i) => (
            <div
              key={item.step}
              data-aos="fade-up"
              data-aos-delay={i * 150}
              className="relative z-10 text-center"
            >
              <div className="relative w-16 h-16 sm:w-18 sm:h-18 mx-auto mb-5">
                <span className="absolute inset-0 flex items-center justify-center text-6xl sm:text-7xl font-extrabold text-gray-200/60 select-none -z-10 scale-150">
                  {item.step}
                </span>
                <div className={`relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br ${item.from} ${item.to} flex items-center justify-center shadow-lg transition-soft hover:scale-110 hover:rotate-6`}>
                  <item.icon className="text-white" size={28} />
                </div>
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">{item.title}</h3>
              <p className="text-sm text-gray-600 max-w-xs mx-auto">{item.desc}</p>
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
            We deliver our rental products and servicing support across the Delhi-NCR region.
          </p>
        </div>

        <div data-aos="fade-up" className="bg-white rounded-2xl p-6 sm:p-10 shadow-md border border-gray-100">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5">
            {[
              { city: "Delhi", from: "from-indigo-400", to: "to-indigo-600" },
              { city: "Faridabad", from: "from-cyan-400", to: "to-cyan-600" },
              { city: "Ghaziabad", from: "from-purple-400", to: "to-purple-600" },
              { city: "Gurugram", from: "from-pink-400", to: "to-pink-600" },
              { city: "Noida", from: "from-amber-400", to: "to-amber-600" },
              { city: "Meerut", from: "from-rose-400", to: "to-rose-600" },
            ].map((loc, i) => (
              <div
                key={loc.city}
                data-aos="fade-up"
                data-aos-delay={(i % 3) * 100}
                className="group flex items-center gap-3 bg-gray-50 hover:bg-white rounded-xl p-3 sm:p-4 border border-gray-100 transition-soft hover:shadow-md hover:-translate-y-0.5"
              >
                <div className={`w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-lg bg-gradient-to-br ${loc.from} ${loc.to} flex items-center justify-center shadow-sm transition-soft group-hover:scale-110`}>
                  <MapPin className="text-white" size={16} />
                </div>
                <span className="font-medium text-sm sm:text-base text-gray-800">{loc.city}</span>
              </div>
            ))}
          </div>

          <p className="text-center text-xs sm:text-sm text-gray-500 mt-6 sm:mt-8">
            Don't see your city listed?{" "}
            <a href="/contact" className="text-primary font-medium hover:underline">Get in touch</a> — we may still be able to help.
          </p>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        <h2 data-aos="fade-up" className="text-xl sm:text-3xl font-bold text-center mb-7 sm:mb-12 text-gray-900">
          What Our <span className="text-primary">Customers Say</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
          {[
            { name: "Aditi Sharma", role: "Freelance Designer", text: "Rented a monitor for a 2-month project — smooth delivery and great condition. Saved me from buying one outright." },
            { name: "Rohan Mehta", role: "College Student", text: "Needed a laptop for exam season. Affordable pricing and the servicing team fixed a minor issue same day." },
            { name: "Priya Nair", role: "Startup Founder", text: "We rent laptops for our interns through Rentogram — flexible terms and reliable support every time." },
          ].map((t, i) => (
            <div
              key={t.name}
              data-aos="fade-up"
              data-aos-delay={i * 150}
              className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md border border-gray-100 transition-soft hover-lift"
            >
              <div className="flex gap-1 text-secondary mb-2 sm:mb-3">
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="text-sm text-gray-700 mb-4">"{t.text}"</p>
              <p className="font-semibold text-sm text-gray-900">{t.name}</p>
              <p className="text-xs text-gray-500">{t.role}</p>
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
          <div className="absolute -top-16 -left-16 w-56 h-56 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-white/10 rounded-full blur-2xl" />
          <Clock className="text-white/80 mx-auto mb-4" size={30} />
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-white">Ready to Rent Smarter?</h2>
          <p className="text-white/85 mb-7 sm:mb-8 max-w-xl mx-auto text-sm sm:text-base">
            Join hundreds of students, freelancers & businesses using Rentogram for flexible,
            affordable tech access.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-full font-semibold transition-soft hover:-translate-y-0.5 shadow-lg"
          >
            Explore Products <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </div>
  );
}