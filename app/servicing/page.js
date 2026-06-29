"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import {
  Wrench,
  ShieldCheck,
  Clock,
  Truck,
  CheckCircle2,
  Laptop,
  Monitor,
  Server,
  Printer,
  ClipboardList,
  Search,
  PackageCheck,
  ChevronDown,
  Star,
} from "lucide-react";

const features = [
  { icon: Wrench, title: "Expert Repairs", desc: "Certified technicians for hardware & software issues.", from: "from-indigo-400", to: "to-indigo-600" },
  { icon: ShieldCheck, title: "Genuine Parts", desc: "Only quality-checked, genuine replacement parts used.", from: "from-cyan-400", to: "to-cyan-600" },
  { icon: Clock, title: "Fast Turnaround", desc: "Most issues resolved within 24-48 hours.", from: "from-pink-400", to: "to-pink-600" },
  { icon: Truck, title: "Pickup & Drop", desc: "Free doorstep pickup and drop for serviced devices.", from: "from-amber-400", to: "to-amber-600" },
];

const deviceTypes = [
  { icon: Laptop, label: "Laptops" },
  { icon: Monitor, label: "Desktops & Monitors" },
  { icon: Server, label: "Servers" },
  { icon: Printer, label: "Printers" },
];

const process = [
  { icon: ClipboardList, step: "01", title: "Raise a Request", desc: "Tell us your device & issue through our simple form.", from: "from-indigo-500", to: "to-violet-500" },
  { icon: Search, step: "02", title: "Diagnosis", desc: "Our technician inspects and diagnoses the issue, free of cost.", from: "from-cyan-500", to: "to-blue-500" },
  { icon: Wrench, step: "03", title: "Repair", desc: "We fix it using genuine parts — onsite or at our service center.", from: "from-pink-500", to: "to-rose-500" },
  { icon: PackageCheck, step: "04", title: "Delivery", desc: "Your serviced device is delivered back, fully tested.", from: "from-amber-500", to: "to-orange-500" },
];

const plans = [
  {
    name: "Basic Checkup",
    price: "Free",
    desc: "Diagnosis & inspection",
    features: ["Hardware inspection", "Software health check", "Issue report", "No obligation quote"],
    highlight: false,
  },
  {
    name: "Standard Repair",
    price: "₹499 onwards",
    desc: "Most common fixes",
    features: ["Component-level repair", "Genuine parts included", "24-48 hr turnaround", "30-day repair warranty"],
    highlight: true,
  },
  {
    name: "AMC Plan",
    price: "₹1999/yr",
    desc: "Annual maintenance",
    features: ["Unlimited service visits", "Priority turnaround", "Free preventive checkups", "Discounted parts"],
    highlight: false,
  },
];

const testimonials = [
  { name: "Karan Verma", text: "Screen issue on my rented laptop fixed within a day. Smooth pickup & drop." },
  { name: "Simran Kaur", text: "AMC plan has saved us so much on our office desktops. Highly recommend." },
];

const faqs = [
  { q: "Do you service devices not rented from Rentogram?", a: "Yes! We service laptops, desktops, servers & printers regardless of where you purchased or rented them." },
  { q: "Is there a warranty on repairs?", a: "All standard repairs come with a 30-day warranty covering the specific issue fixed." },
  { q: "How is pricing determined?", a: "Basic diagnosis is free. Repair cost depends on the issue and parts required — we always share a quote before starting work." },
];

export default function ServicingPage() {
  const [form, setForm] = useState({ name: "", phone: "", device: "", issue: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const { error: insertError } = await supabase.from("servicing_requests").insert([
      {
        customer_name: form.name,
        customer_phone: form.phone,
        device: form.device,
        issue_description: form.issue,
      },
    ]);

    setSubmitting(false);

    if (insertError) {
      setError("Something went wrong. Please try again.");
      console.error(insertError);
      return;
    }

    setSubmitted(true);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto mb-9 sm:mb-14">
        <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary font-semibold text-xs uppercase tracking-wide px-3.5 py-1.5 rounded-full mb-3">
          <Wrench size={13} /> Servicing
        </span>
        <h1 className="text-2xl sm:text-4xl font-bold mb-3 text-gray-900">
          Tech <span className="text-primary">Servicing</span> & Support
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Whether it's your rented device or your own, our team keeps your tech running smoothly —
          from quick fixes to full annual maintenance plans.
        </p>
      </div>

      {/* Feature badges */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-12 sm:mb-20">
        {features.map((f) => (
          <div
            key={f.title}
            className="group bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center shadow-sm border border-gray-100 transition-soft hover:-translate-y-1 hover:shadow-md"
          >
            <div className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-xl bg-gradient-to-br ${f.from} ${f.to} flex items-center justify-center mb-2.5 sm:mb-3 shadow-sm transition-soft group-hover:scale-110`}>
              <f.icon className="text-white" size={18} />
            </div>
            <h3 className="font-semibold text-xs sm:text-base mb-1 text-gray-900">{f.title}</h3>
            <p className="text-[11px] sm:text-sm text-gray-600">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Devices we service */}
      <div className="mb-12 sm:mb-20">
        <h2 className="text-lg sm:text-2xl font-semibold text-center mb-6 sm:mb-8 text-gray-900">
          Devices We Service
        </h2>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-5">
          {deviceTypes.map((d) => (
            <div
              key={d.label}
              className="flex items-center gap-2 bg-white px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-full shadow-sm border border-gray-100 text-xs sm:text-sm font-medium text-gray-700"
            >
              <d.icon size={16} className="text-primary" />
              {d.label}
            </div>
          ))}
        </div>
      </div>

      {/* How servicing works */}
      <div className="mb-12 sm:mb-20">
        <h2 className="text-lg sm:text-2xl font-semibold text-center mb-7 sm:mb-10 text-gray-900">
          How Our Servicing Works
        </h2>
        <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-6">
          <div className="hidden sm:block absolute top-7 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-primary via-secondary to-accent opacity-30 z-0" />
          {process.map((p) => (
            <div key={p.step} className="relative z-10 text-center">
              <div className={`w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-2xl bg-gradient-to-br ${p.from} ${p.to} flex items-center justify-center shadow-lg mb-3`}>
                <p.icon className="text-white" size={20} />
              </div>
              <h3 className="font-semibold text-xs sm:text-sm mb-1 text-gray-900">{p.title}</h3>
              <p className="text-[10px] sm:text-xs text-gray-600">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing plans */}
      <div className="mb-12 sm:mb-20">
        <h2 className="text-lg sm:text-2xl font-semibold text-center mb-2 text-gray-900">
          Service Plans
        </h2>
        <p className="text-center text-gray-600 text-xs sm:text-sm mb-7 sm:mb-10">
          Transparent pricing, no hidden charges.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-5 sm:p-7 shadow-md border transition-soft hover:-translate-y-1 ${
                plan.highlight
                  ? "bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white border-transparent shadow-lg scale-[1.02]"
                  : "bg-white border-gray-100 text-gray-900"
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 right-5 bg-amber-400 text-gray-900 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                  POPULAR
                </span>
              )}
              <h3 className={`font-semibold text-base sm:text-lg mb-1 ${plan.highlight ? "text-white" : "text-gray-900"}`}>
                {plan.name}
              </h3>
              <p className={`text-xs sm:text-sm mb-3 sm:mb-4 ${plan.highlight ? "text-white/80" : "text-gray-500"}`}>
                {plan.desc}
              </p>
              <p className={`text-xl sm:text-2xl font-bold mb-4 sm:mb-5 ${plan.highlight ? "text-white" : "text-primary"}`}>
                {plan.price}
              </p>
              <ul className="space-y-2 mb-5 sm:mb-6">
                {plan.features.map((f) => (
                  <li key={f} className={`flex items-start gap-2 text-xs sm:text-sm ${plan.highlight ? "text-white/90" : "text-gray-600"}`}>
                    <CheckCircle2 size={15} className={`shrink-0 mt-0.5 ${plan.highlight ? "text-cyan-300" : "text-primary"}`} />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="#request-form"
                className={`block text-center py-2.5 rounded-full text-sm font-medium transition-soft ${
                  plan.highlight
                    ? "bg-white text-primary hover:shadow-md"
                    : "bg-primary/10 text-primary hover:bg-primary/20"
                }`}
              >
                Get Started
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="mb-12 sm:mb-20">
        <h2 className="text-lg sm:text-2xl font-semibold text-center mb-7 sm:mb-10 text-gray-900">
          What Customers Say About Our Servicing
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
              <div className="flex gap-1 text-secondary mb-2">
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} size={14} fill="currentColor" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-gray-700 mb-3">"{t.text}"</p>
              <p className="font-semibold text-xs sm:text-sm text-gray-900">{t.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-12 sm:mb-20">
        <h2 className="text-lg sm:text-2xl font-semibold text-center mb-6 sm:mb-8 text-gray-900">
          Frequently Asked Questions
        </h2>
        <div className="space-y-2.5 sm:space-y-3 max-w-2xl mx-auto">
          {faqs.map((f, i) => (
            <div key={f.q} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 text-left"
              >
                <span className="text-sm sm:text-base font-medium text-gray-900">{f.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-primary shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                />
              </button>
              <div
                className={`px-4 sm:px-5 overflow-hidden transition-all duration-300 ${
                  openFaq === i ? "max-h-40 pb-3 sm:pb-4" : "max-h-0"
                }`}
              >
                <p className="text-xs sm:text-sm text-gray-600">{f.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Request form */}
      <div id="request-form" className="bg-white rounded-2xl p-5 sm:p-8 shadow-md border border-gray-100 max-w-2xl mx-auto">
        {submitted ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="text-primary" size={28} />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-2">Request Received!</h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Our team will contact you at {form.phone} soon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2 text-gray-900">
              Request Servicing
            </h3>
            <input
              required
              placeholder="Full Name"
              className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm rounded-xl bg-gray-50 border border-gray-200 focus:outline-primary"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              required
              placeholder="Phone Number"
              className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm rounded-xl bg-gray-50 border border-gray-200 focus:outline-primary"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <input
              required
              placeholder="Device (e.g. Dell XPS 15)"
              className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm rounded-xl bg-gray-50 border border-gray-200 focus:outline-primary"
              value={form.device}
              onChange={(e) => setForm({ ...form, device: e.target.value })}
            />
            <textarea
              required
              placeholder="Describe the issue"
              rows={4}
              className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm rounded-xl bg-gray-50 border border-gray-200 focus:outline-primary"
              value={form.issue}
              onChange={(e) => setForm({ ...form, issue: e.target.value })}
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-white py-2.5 sm:py-3 rounded-xl font-medium transition-soft hover-lift shadow-md text-sm sm:text-base disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit Request"}
            </button>
            {error && <p className="text-red-500 text-xs sm:text-sm text-center">{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
