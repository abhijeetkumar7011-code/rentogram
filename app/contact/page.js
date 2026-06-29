"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  CheckCircle2,
  Clock,
  ChevronDown,
} from "lucide-react";

const contactInfo = [
  { icon: Mail, title: "Email", value: "support@rentogram.com", from: "from-indigo-400", to: "to-indigo-600" },
  { icon: Phone, title: "Phone", value: "+91 98765 43210", from: "from-cyan-400", to: "to-cyan-600" },
  { icon: MapPin, title: "Location", value: "Delhi, India", from: "from-pink-400", to: "to-pink-600" },
];

const officeHours = [
  { day: "Monday - Friday", time: "9:00 AM - 7:00 PM" },
  { day: "Saturday", time: "10:00 AM - 5:00 PM" },
  { day: "Sunday", time: "Closed" },
];

const faqs = [
  { q: "How quickly will I get a response?", a: "We usually respond within a few hours during business hours, and within 24 hours otherwise." },
  { q: "Can I get support for an ongoing rental?", a: "Yes, existing customers get priority support — just mention your booking details." },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const { error: insertError } = await supabase.from("contact_messages").insert([
      {
        name: form.name,
        email: form.email,
        message: form.message,
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <div className="text-center max-w-xl mx-auto mb-9 sm:mb-14">
        <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary font-semibold text-xs uppercase tracking-wide px-3.5 py-1.5 rounded-full mb-3">
          <MessageCircle size={13} /> Contact
        </span>
        <h1 className="text-2xl sm:text-4xl font-bold mb-3 text-gray-900">
          Get In <span className="text-primary">Touch</span>
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Questions about rentals or servicing? We're here to help.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 sm:gap-10 mb-10 sm:mb-16">
        <div className="space-y-3 sm:space-y-6">
          {contactInfo.map((c) => (
            <div
              key={c.title}
              className="group bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 flex items-center gap-3 sm:gap-4 shadow-sm border border-gray-100 transition-soft hover:-translate-y-1 hover:shadow-md"
            >
              <div className={`w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-xl bg-gradient-to-br ${c.from} ${c.to} flex items-center justify-center shadow-sm transition-soft group-hover:scale-110`}>
                <c.icon className="text-white" size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-sm sm:text-base text-gray-900">{c.title}</h3>
                <p className="text-gray-600 text-xs sm:text-sm">{c.value}</p>
              </div>
            </div>
          ))}

          {/* Office hours card */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Clock size={17} className="text-primary" />
              <h3 className="font-semibold text-sm sm:text-base text-gray-900">Office Hours</h3>
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              {officeHours.map((o) => (
                <div key={o.day} className="flex justify-between text-xs sm:text-sm text-gray-600">
                  <span>{o.day}</span>
                  <span className="font-medium text-gray-800">{o.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 sm:p-8 shadow-md border border-gray-100">
          {submitted ? (
            <div className="text-center py-8 sm:py-10">
              <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <CheckCircle2 className="text-primary" size={28} />
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-2">Message Sent!</h2>
              <p className="text-gray-600 text-sm sm:text-base">We'll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <input
                required
                placeholder="Your Name"
                className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm rounded-xl bg-gray-50 border border-gray-200 focus:outline-primary"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                required
                type="email"
                placeholder="Your Email"
                className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm rounded-xl bg-gray-50 border border-gray-200 focus:outline-primary"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <textarea
                required
                placeholder="Your Message"
                rows={5}
                className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm rounded-xl bg-gray-50 border border-gray-200 focus:outline-primary"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-white py-2.5 sm:py-3 rounded-xl font-medium transition-soft hover-lift shadow-md text-sm sm:text-base disabled:opacity-60"
              >
                {submitting ? "Sending..." : "Send Message"}
              </button>
              {error && <p className="text-red-500 text-xs sm:text-sm text-center">{error}</p>}
            </form>
          )}
        </div>
      </div>

      {/* Map placeholder */}
      <div className="rounded-2xl overflow-hidden shadow-md border border-gray-100 mb-10 sm:mb-16 h-48 sm:h-64 bg-gradient-to-br from-indigo-100 via-cyan-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="text-primary mx-auto mb-2" size={28} />
          <p className="text-sm text-gray-600 font-medium">Delhi, India</p>
          <p className="text-xs text-gray-400">Map preview</p>
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="text-lg sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-5 text-center">
          Quick Answers
        </h2>
        <div className="space-y-2.5 sm:space-y-3 max-w-2xl mx-auto">
          {faqs.map((f, i) => (
            <div
              key={f.q}
              className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 text-left"
              >
                <span className="text-sm sm:text-base font-medium text-gray-900">{f.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-primary shrink-0 transition-transform ${
                    openFaq === i ? "rotate-180" : ""
                  }`}
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
    </div>
  );
}
