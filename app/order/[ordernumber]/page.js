"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getOrderByNumber } from "../../../lib/productService";
import {
  CheckCircle2,
  Loader2,
  PackageX,
  Truck,
  MapPin,
  Phone,
  Mail,
  Calendar,
  ArrowRight,
} from "lucide-react";

const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-600 border-amber-200",
  confirmed: "bg-blue-50 text-blue-600 border-blue-200",
  delivered: "bg-indigo-50 text-indigo-600 border-indigo-200",
  active: "bg-cyan-50 text-cyan-600 border-cyan-200",
  completed: "bg-emerald-50 text-emerald-600 border-emerald-200",
  cancelled: "bg-red-50 text-red-600 border-red-200",
};

export default function OrderConfirmationPage() {
  const { orderNumber } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrderByNumber(orderNumber).then((res) => {
      setData(res);
      setLoading(false);
    });
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 text-gray-400 gap-2">
        <Loader2 className="animate-spin" size={20} /> Loading your order...
      </div>
    );
  }

  if (!data || !data.order) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-red-50 flex items-center justify-center mb-5">
          <PackageX className="text-red-400" size={28} />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Order Not Found</h1>
        <p className="text-gray-600 text-sm mb-7">
          We couldn't find an order with this number. Please check the link or contact support.
        </p>
        <Link href="/contact" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-semibold text-sm shadow-md">
          Contact Support <ArrowRight size={15} />
        </Link>
      </div>
    );
  }

  const { order, items } = data;
  const statusClass = STATUS_STYLES[order.status] || STATUS_STYLES.pending;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <div className="text-center mb-8 sm:mb-10">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 flex items-center justify-center mb-4">
          <CheckCircle2 className="text-emerald-500" size={32} />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1.5">Rental Confirmed!</h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Order <span className="font-semibold text-gray-900">{order.order_number}</span> has been received.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden mb-6">
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100">
          <span className="text-xs sm:text-sm text-gray-500">Status</span>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${statusClass}`}>
            {order.status}
          </span>
        </div>

        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 sm:gap-4 px-5 sm:px-6 py-4 border-b border-gray-50">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-xl overflow-hidden bg-gray-50">
              <Image src={item.product_image || "/images/laptop-placeholder.svg"} alt={item.product_name} fill sizes="64px" className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-gray-900 line-clamp-1">{item.product_name}</p>
              <p className="text-xs text-gray-500">Qty: {item.quantity} · ₹{item.unit_rent_price}/day</p>
            </div>
            <p className="font-semibold text-sm text-gray-900">₹{item.line_rent_total}</p>
          </div>
        ))}

        <div className="px-5 sm:px-6 py-4 space-y-1.5 text-sm">
          <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₹{order.subtotal_amount}</span></div>
          <div className="flex justify-between text-gray-600"><span>Security Deposit</span><span>₹{order.security_deposit_amount}</span></div>
          {order.gst_amount > 0 && (
            <div className="flex justify-between text-gray-600"><span>GST</span><span>₹{order.gst_amount}</span></div>
          )}
          <div className="flex justify-between font-bold text-primary text-base pt-2 border-t border-gray-100">
            <span>Total</span><span>₹{order.total_amount}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 space-y-3 mb-6">
        <h3 className="font-semibold text-sm text-gray-900 mb-1">Delivery Details</h3>
        <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-600">
          <Calendar size={15} className="text-primary shrink-0 mt-0.5" />
          {new Date(order.start_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          {" → "}
          {new Date(order.end_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          {" "}({order.rental_duration_days} days)
        </div>
        <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-600">
          <MapPin size={15} className="text-primary shrink-0 mt-0.5" />
          {order.customer_address}, {order.customer_city}, {order.customer_state} — {order.customer_pincode}
        </div>
        <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-600">
          <Phone size={15} className="text-primary shrink-0 mt-0.5" /> {order.customer_mobile}
        </div>
        {order.customer_email && (
          <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-600">
            <Mail size={15} className="text-primary shrink-0 mt-0.5" /> {order.customer_email}
          </div>
        )}
      </div>

      <div className="flex items-start gap-2.5 bg-primary/5 rounded-xl p-4 text-xs sm:text-sm text-gray-600 mb-6">
        <Truck size={16} className="text-primary shrink-0 mt-0.5" />
        Our team will call you at <span className="font-medium text-gray-800">{order.customer_mobile}</span> shortly to confirm delivery. Payment is Cash on Delivery.
      </div>

      <Link
        href="/products"
        className="block w-full text-center bg-primary text-white py-3 rounded-full font-semibold text-sm shadow-md hover:opacity-90 transition-soft"
      >
        Continue Browsing
      </Link>
    </div>
  );
}