"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { products } from "../../lib/productsData";
import { supabase } from "../../lib/supabaseClient";
import { CalendarDays, PackageCheck, CheckCircle2 } from "lucide-react";

function BookingContent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("product");

  const staticMatch = products.find((p) => p.id === productId);
  const [selectedProduct, setSelectedProduct] = useState(staticMatch || null);

  useEffect(() => {
    // if the product wasn't found in the static sample list, it's likely a
    // DB product (uuid id) — look it up in Supabase instead.
    if (!staticMatch && productId) {
      supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single()
        .then(({ data, error }) => {
          if (!error && data) {
            setSelectedProduct({
              id: data.id,
              name: data.name,
              pricePerDay: data.price_per_day,
            });
          }
        });
    }
  }, [productId, staticMatch]);

  const [range, setRange] = useState({ from: undefined, to: undefined });
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const days =
    range.from && range.to
      ? Math.max(1, Math.ceil((range.to - range.from) / (1000 * 60 * 60 * 24)))
      : 0;

  const total = selectedProduct ? days * selectedProduct.pricePerDay : 0;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const { error: insertError } = await supabase.from("bookings").insert([
      {
        product_id: selectedProduct?.id || null,
        product_name: selectedProduct?.name || null,
        start_date: range.from || null,
        end_date: range.to || null,
        total_days: days || null,
        total_amount: total || null,
        customer_name: form.name,
        customer_phone: form.phone,
        delivery_address: form.address,
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <div className="text-center sm:text-left mb-7 sm:mb-10">
        <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary font-semibold text-xs uppercase tracking-wide px-3.5 py-1.5 rounded-full mb-3">
          <CalendarDays size={13} /> Booking
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold mb-1.5 text-gray-900">Book Your Rental</h1>
        <p className="text-gray-600 text-sm sm:text-base">
          {selectedProduct ? (
            <span className="inline-flex items-center gap-1.5">
              <PackageCheck size={15} className="text-primary" /> Renting: {selectedProduct.name}
            </span>
          ) : (
            "Select dates and fill details to request a rental."
          )}
        </p>
      </div>

      {submitted ? (
        <div className="bg-white rounded-2xl p-8 sm:p-10 text-center shadow-md border border-gray-100">
          <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <CheckCircle2 className="text-primary" size={28} />
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-2">Booking Requested!</h2>
          <p className="text-gray-600 text-sm sm:text-base">
            We'll confirm availability and reach out to {form.phone} shortly. Payment to be collected via Cash on Delivery.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5 sm:gap-10">
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-md border border-gray-100">
            <h3 className="font-semibold mb-3 sm:mb-4 text-gray-900 text-sm sm:text-base">
              Select Rental Dates
            </h3>
            <DayPicker mode="range" selected={range} onSelect={setRange} numberOfMonths={1} />
            {selectedProduct && (
              <div className="mt-4 text-sm text-gray-700 bg-primary/5 rounded-xl p-3 sm:p-4">
                <p>Duration: {days} day(s)</p>
                <p className="font-bold text-primary text-base sm:text-lg mt-1">Total: ₹{total}</p>
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1.5">
                  💰 Payment: Cash on Delivery
                </p>
              </div>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl p-4 sm:p-6 shadow-md border border-gray-100 space-y-3 sm:space-y-4"
          >
            <h3 className="font-semibold mb-1 sm:mb-2 text-gray-900 text-sm sm:text-base">
              Your Details
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
            <textarea
              required
              placeholder="Delivery Address"
              rows={3}
              className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm rounded-xl bg-gray-50 border border-gray-200 focus:outline-primary"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-white py-2.5 sm:py-3 rounded-xl font-medium transition-soft hover-lift shadow-md text-sm sm:text-base disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Confirm Booking"}
            </button>
            {error && <p className="text-red-500 text-xs sm:text-sm text-center">{error}</p>}
          </form>
        </div>
      )}
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-500">Loading...</div>}>
      <BookingContent />
    </Suspense>
  );
}
