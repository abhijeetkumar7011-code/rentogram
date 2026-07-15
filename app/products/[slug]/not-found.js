import Link from "next/link";
import { PackageSearch, ArrowRight } from "lucide-react";

export default function ProductNotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-20 sm:py-32 text-center">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
        <PackageSearch className="text-primary" size={28} />
      </div>
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
      <p className="text-gray-600 text-sm sm:text-base mb-7">
        This product may have been removed or the link is incorrect.
      </p>
      <Link
        href="/products"
        className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-semibold text-sm shadow-md hover:opacity-90 transition-soft"
      >
        Browse All Products <ArrowRight size={15} />
      </Link>
    </div>
  );
}