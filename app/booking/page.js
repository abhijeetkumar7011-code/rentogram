"use client";

import { Suspense, useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { products as sampleProducts } from "../../lib/productsData";
import { supabase } from "../../lib/supabaseClient";
import { calculateOrderTotals, createRentalOrder, GST_APPLICABLE } from "../../lib/productService";
import {
  CalendarDays,
  PackageCheck,
  Minus,
  Plus,
  AlertCircle,
  Loader2,
} from "lucide-react";

const INDIAN_STATES = [
  "Delhi", "Haryana", "Uttar Pradesh", "Punjab", "Rajasthan", "Maharashtra",
  "Karnataka", "Tamil Nadu", "Gujarat", "West Bengal", "Other",
];

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("product");

  const staticMatch = sampleProducts.find((p) => p.id === productId);
  const [product, setProduct] = useState(
    staticMatch
      ? { ...staticMatch, securityDeposit: Math.round(staticMatch.pricePerDay * 3), stockQuantity: 5 }
      : null
  );
  const [loadingProduct, setLoadingProduct] = useState(!staticMatch && !!productId);

  useEffect(() => {
    if (staticMatch || !productId) return;
    supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single()
      .then(({ data, error }) => {
        if (!error && data) {
          setProduct({
            id: data.id,
            name: data.name,
            pricePerDay: data.price_per_day,
            securityDeposit: data.security_deposit || Math.round(data.price_per_day * 3),
            image: data.image_url || "/images/laptop-placeholder.svg",
            stockQuantity: data.stock_quantity ?? 1,
            availabilityStatus: data.availability_status || "available",
          });
        }
        setLoadingProduct(false);
      });
  }, [productId, staticMatch]);

  const [range, setRange] = useState({ from: undefined, to: undefined });
  const [quantity, setQuantity] = useState(1);
  const [form, setForm] = useState({
    name: "", mobile: "", email: "", address: "", city: "", state: "", pincode: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const days = useMemo(() => {
    if (!range.from || !range.to) return 0;
    return Math.max(1, Math.ceil((range.to - range.from) / (1000 * 60 * 60 * 24)));
  }, [range]);

  const totals = useMemo(() => {
    if (!product || !days) return { subtotal: 0, securityDeposit: 0, gst: 0, total: 0 };
    return calculateOrderTotals({
      unitRentPrice: product.pricePerDay,
      unitSecurityDeposit: product.securityDeposit || 0,
      quantity,
      days,
    });
  }, [product, days, quantity]);

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = "Required";
    if (!/^[6-9]\d{9}$/.test(form.mobile.trim())) errs.mobile = "Enter a valid 10-digit mobile number";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errs.email = "Enter a valid email";
    if (!form.address.trim()) errs.address = "Required";
    if (!form.city.trim()) errs.city = "Required";
    if (!form.state) errs.state = "Required";
    if (!/^\d{6}$/.test(form.pincode.trim())) errs.pincode = "Enter a valid 6-digit pincode";
    if (!range.from || !range.to) errs.dates = "Select rental start & end dates";
    if (product && product.stockQuantity < quantity) errs.quantity = "Not enough stock available";
    if (product && product.availabilityStatus && product.availabilityStatus !== "available") {
      errs.availability = "This product isn't available for rent right now";
    }
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting || submitted) return; // prevent duplicate submissions

    const errs = validate();
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) {
      setError("Please fix the highlighted fields.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const orderNumber = await createRentalOrder({
        customer: {
          name: form.name.trim(),
          mobile: form.mobile.trim(),
          email: form.email.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          state: form.state,
          pincode: form.pincode.trim(),
        },
        rental: {
          startDate: range.from,
          endDate: range.to,
          days,
          quantity,
        },
        product,
        totals,
      });

      setSubmitted(true);
      router.push(`/order/${orderNumber}`);
    } catch (err) {
      console.error(err);
      const reason = err?.message || err?.error_description || "";
      setError(
        reason
          ? `Couldn't place your order: ${reason}`
          : "Something went wrong while placing your order. Please try again."
      );
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <div className="text-center sm:text-left mb-7 sm:mb-10">
        <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary font-semibold text-xs uppercase tracking-wide px-3.5 py-1.5 rounded-full mb-3">
          <CalendarDays size={13} /> Rent Now
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold mb-1.5 text-gray-900">Complete Your Rental</h1>
        <p className="text-gray-600 text-sm sm:text-base">
          {loadingProduct ? (
            "Loading product..."
          ) : product ? (
            <span className="inline-flex items-center gap-1.5">
              <PackageCheck size={15} className="text-primary" /> Renting: {product.name}
            </span>
          ) : (
            "Select a product, dates and fill your details to request a rental."
          )}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5 sm:gap-10">
        {/* Left: dates + quantity + price summary */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-md border border-gray-100">
          <h3 className="font-semibold mb-3 sm:mb-4 text-gray-900 text-sm sm:text-base">
            Select Rental Dates
          </h3>
          <DayPicker mode="range" selected={range} onSelect={setRange} numberOfMonths={1} disabled={{ before: new Date() }} />
          {fieldErrors.dates && <p className="text-red-500 text-xs mt-1">{fieldErrors.dates}</p>}

          {product && (
            <>
              <div className="flex items-center justify-between mt-4 bg-gray-50 rounded-xl p-3 sm:p-4">
                <span className="text-sm font-medium text-gray-700">Quantity</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:border-primary/40"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="w-6 text-center font-semibold text-gray-900">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(product.stockQuantity || 10, q + 1))}
                    className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:border-primary/40"
                  >
                    <Plus size={13} />
                  </button>
                </div>
              </div>
              {fieldErrors.quantity && <p className="text-red-500 text-xs mt-1">{fieldErrors.quantity}</p>}
              {fieldErrors.availability && <p className="text-red-500 text-xs mt-1">{fieldErrors.availability}</p>}

              {days > 0 && (
                <div className="mt-4 text-sm text-gray-700 bg-primary/5 rounded-xl p-3 sm:p-4 space-y-1.5">
                  <div className="flex justify-between"><span>Duration</span><span>{days} day(s)</span></div>
                  <div className="flex justify-between"><span>Rent ({quantity} × ₹{product.pricePerDay} × {days}d)</span><span>₹{totals.subtotal}</span></div>
                  <div className="flex justify-between"><span>Security Deposit</span><span>₹{totals.securityDeposit}</span></div>
                  {GST_APPLICABLE && (
                    <div className="flex justify-between"><span>GST</span><span>₹{totals.gst}</span></div>
                  )}
                  <div className="flex justify-between font-bold text-primary text-base pt-1.5 border-t border-primary/10">
                    <span>Total</span><span>₹{totals.total}</span>
                  </div>
                  <p className="text-xs text-gray-500 pt-1.5">💰 Payment: Cash on Delivery</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Right: customer form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-4 sm:p-6 shadow-md border border-gray-100 space-y-3">
          <h3 className="font-semibold mb-1 text-gray-900 text-sm sm:text-base">Your Details</h3>

          <div>
            <input
              placeholder="Full Name"
              className={`w-full px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm rounded-xl bg-gray-50 border focus:outline-primary ${fieldErrors.name ? "border-red-300" : "border-gray-200"}`}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            {fieldErrors.name && <p className="text-red-500 text-xs mt-1">{fieldErrors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                placeholder="Mobile Number"
                className={`w-full px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm rounded-xl bg-gray-50 border focus:outline-primary ${fieldErrors.mobile ? "border-red-300" : "border-gray-200"}`}
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value.replace(/\D/g, "").slice(0, 10) })}
              />
              {fieldErrors.mobile && <p className="text-red-500 text-xs mt-1">{fieldErrors.mobile}</p>}
            </div>
            <div>
              <input
                placeholder="Email (optional)"
                className={`w-full px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm rounded-xl bg-gray-50 border focus:outline-primary ${fieldErrors.email ? "border-red-300" : "border-gray-200"}`}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
            </div>
          </div>

          <div>
            <textarea
              placeholder="Delivery Address"
              rows={2}
              className={`w-full px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm rounded-xl bg-gray-50 border focus:outline-primary ${fieldErrors.address ? "border-red-300" : "border-gray-200"}`}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
            {fieldErrors.address && <p className="text-red-500 text-xs mt-1">{fieldErrors.address}</p>}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <input
                placeholder="City"
                className={`w-full px-3 py-2.5 sm:py-3 text-sm rounded-xl bg-gray-50 border focus:outline-primary ${fieldErrors.city ? "border-red-300" : "border-gray-200"}`}
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
              {fieldErrors.city && <p className="text-red-500 text-xs mt-1">{fieldErrors.city}</p>}
            </div>
            <div className="col-span-1">
              <select
                className={`w-full px-2 py-2.5 sm:py-3 text-sm rounded-xl bg-gray-50 border focus:outline-primary ${fieldErrors.state ? "border-red-300" : "border-gray-200"}`}
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
              >
                <option value="">State</option>
                {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              {fieldErrors.state && <p className="text-red-500 text-xs mt-1">{fieldErrors.state}</p>}
            </div>
            <div className="col-span-1">
              <input
                placeholder="Pincode"
                className={`w-full px-3 py-2.5 sm:py-3 text-sm rounded-xl bg-gray-50 border focus:outline-primary ${fieldErrors.pincode ? "border-red-300" : "border-gray-200"}`}
                value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })}
              />
              {fieldErrors.pincode && <p className="text-red-500 text-xs mt-1">{fieldErrors.pincode}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || submitted || loadingProduct}
            className="w-full bg-primary text-white py-2.5 sm:py-3 rounded-xl font-medium transition-soft hover-lift shadow-md text-sm sm:text-base disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            {submitting ? "Placing Order..." : "Confirm Rental"}
          </button>

          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5 text-red-600 text-xs sm:text-sm">
              <AlertCircle size={15} className="shrink-0 mt-0.5" /> {error}
            </div>
          )}
        </form>
      </div>
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