import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  ShieldQuestion,
  CheckCircle2,
  PackageCheck,
  Layers,
} from "lucide-react";
import { getProductBySlug, getRelatedProducts } from "../../../lib/productService";
import { products as sampleProducts } from "../../../lib/productsData";
import ImageGallery from "../../../components/product/ImageGallery";
import ShareBar from "../../../components/product/ShareBar";
import ViewTracker from "../../../components/product/ViewTracker";
import FaqAccordion from "../../../components/product/FaqAccordion";
import SuggestedProducts from "../../../components/SuggestedProducts";

async function loadProduct(slug) {
  const dbProduct = await getProductBySlug(slug);
  if (dbProduct) return { ...dbProduct, isSample: false };

  // fall back to the static sample catalog (demo data / DB not seeded yet)
  const sample = sampleProducts.find((p) => p.slug === slug);
  if (!sample) return null;
  return {
    ...sample,
    isSample: true,
    brand: sample.brand || "",
    shortDescription: sample.specs,
    fullDescription: "",
    securityDeposit: Math.round(sample.pricePerDay * 3),
    stockQuantity: 5,
    availabilityStatus: "available",
    condition: "New",
    images: [sample.image],
    details: null,
  };
}

export async function generateMetadata({ params }) {
  const product = await loadProduct(params.slug);
  if (!product) return { title: "Product Not Found | Rentogram" };

  const title = product.details?.metaTitle || `Rent ${product.name} | Rentogram`;
  const description =
    product.details?.metaDescription ||
    product.shortDescription ||
    `Rent the ${product.name} in Delhi-NCR — ₹${product.pricePerDay}/day, quality checked, doorstep delivery.`;

  return { title, description };
}

export default async function ProductDetailPage({ params }) {
  const product = await loadProduct(params.slug);
  if (!product) notFound();

  const related = product.isSample
    ? sampleProducts
        .filter((p) => p.category === product.category && p.slug !== product.slug)
        .slice(0, 8)
    : await getRelatedProducts(product, 8);

  const availabilityBadge = {
    available: { label: "In Stock", className: "bg-emerald-50 text-emerald-600 border-emerald-200" },
    rented_out: { label: "Currently Rented", className: "bg-amber-50 text-amber-600 border-amber-200" },
    maintenance: { label: "Under Maintenance", className: "bg-orange-50 text-orange-600 border-orange-200" },
    unavailable: { label: "Unavailable", className: "bg-red-50 text-red-600 border-red-200" },
  }[product.availabilityStatus] || { label: "In Stock", className: "bg-emerald-50 text-emerald-600 border-emerald-200" };

  const details = product.details;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-14">
      <ViewTracker productId={product.id} />

      {/* Breadcrumb */}
      <nav className="flex items-center flex-wrap gap-1.5 text-xs sm:text-sm text-gray-500 mb-5 sm:mb-8">
        <Link href="/" className="hover:text-primary transition-soft">Home</Link>
        <ChevronRight size={13} />
        <Link href="/products" className="hover:text-primary transition-soft">Products</Link>
        {product.category && (
          <>
            <ChevronRight size={13} />
            <Link href={`/products?category=${product.category}`} className="hover:text-primary transition-soft">
              {product.category}
            </Link>
          </>
        )}
        <ChevronRight size={13} />
        <span className="text-gray-800 font-medium line-clamp-1">{product.name}</span>
      </nav>

      {/* Main section */}
      <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 mb-14 sm:mb-20">
        <ImageGallery images={product.images} alt={product.name} />

        <div>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            {product.brand && (
              <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">{product.brand}</span>
            )}
            {product.category && (
              <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">
                {product.category}
              </span>
            )}
            <span className={`text-[10px] border px-2 py-0.5 rounded-full font-semibold ${availabilityBadge.className}`}>
              {availabilityBadge.label}
            </span>
            {product.condition && (
              <span className="text-[10px] bg-gray-50 text-gray-500 border border-gray-200 px-2 py-0.5 rounded-full font-semibold">
                {product.condition}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>

          {product.shortDescription && (
            <p className="text-sm sm:text-base text-gray-600 mb-5">{product.shortDescription}</p>
          )}

          <div className="flex items-end gap-4 mb-5 pb-5 border-b border-gray-100">
            <div>
              <p className="text-[11px] text-gray-400 mb-0.5">Rent Price</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-primary">
                ₹{product.pricePerDay}<span className="text-sm text-gray-400 font-normal">/day</span>
              </p>
              {product.originalPrice && (
                <p className="text-xs text-gray-400 line-through mt-0.5">Buy price ₹{product.originalPrice}</p>
              )}
            </div>
            {product.securityDeposit > 0 && (
              <div className="pl-4 border-l border-gray-100">
                <p className="text-[11px] text-gray-400 mb-0.5">Security Deposit</p>
                <p className="text-base sm:text-lg font-semibold text-gray-800">₹{product.securityDeposit}</p>
              </div>
            )}
          </div>

          <Link
            href={`/booking?product=${product.id}`}
            className="block w-full text-center bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold py-3.5 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-soft mb-4"
          >
            Rent Now
          </Link>

          <div className="grid grid-cols-3 gap-2 mb-5">
            {[
              { icon: ShieldCheck, label: "Quality Checked" },
              { icon: Truck, label: "Doorstep Delivery" },
              { icon: RotateCcw, label: "Easy Returns" },
            ].map((f) => (
              <div key={f.label} className="flex flex-col items-center text-center gap-1 bg-gray-50 rounded-xl py-3 px-1.5">
                <f.icon size={16} className="text-primary" />
                <span className="text-[10px] text-gray-600 font-medium leading-tight">{f.label}</span>
              </div>
            ))}
          </div>

          <ShareBar title={product.name} />

          {/* Features */}
          {details?.features?.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="font-semibold text-sm text-gray-900 mb-3 flex items-center gap-1.5">
                <Layers size={15} className="text-primary" /> Key Features
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {details.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs sm:text-sm text-gray-600">
                    <CheckCircle2 size={14} className="text-primary shrink-0 mt-0.5" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Description + specs + policies */}
      <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 mb-14 sm:mb-20">
        <div className="lg:col-span-2 space-y-8 sm:space-y-10">
          {product.fullDescription && (
            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Description</h2>
              <div
                className="prose prose-sm max-w-none text-gray-600"
                dangerouslySetInnerHTML={{ __html: product.fullDescription }}
              />
            </section>
          )}

          {details?.specifications?.length > 0 && (
            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Specifications</h2>
              <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100 overflow-hidden">
                {details.specifications.map((s) => (
                  <div key={s.label} className="flex justify-between px-4 py-2.5 text-xs sm:text-sm">
                    <span className="text-gray-500">{s.label}</span>
                    <span className="font-medium text-gray-800">{s.value}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {details?.whatsIncluded?.length > 0 && (
            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 flex items-center gap-1.5">
                <PackageCheck size={17} className="text-primary" /> What&apos;s Included
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {details.whatsIncluded.map((w) => (
                  <li key={w} className="flex items-start gap-2 text-xs sm:text-sm text-gray-600">
                    <CheckCircle2 size={14} className="text-primary shrink-0 mt-0.5" /> {w}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {details?.faqs?.length > 0 && (
            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 flex items-center gap-1.5">
                <ShieldQuestion size={17} className="text-primary" /> Frequently Asked Questions
              </h2>
              <FaqAccordion faqs={details.faqs} />
            </section>
          )}
        </div>

        {/* Rental terms / delivery / returns / warranty sidebar */}
        <aside className="space-y-4">
          {[
            { title: "Rental Terms", text: details?.rentalTerms },
            { title: "Delivery Information", text: details?.deliveryInformation },
            { title: "Return Policy", text: details?.returnPolicy },
            { title: "Warranty", text: details?.warranty },
          ]
            .filter((s) => s.text)
            .map((s) => (
              <div key={s.title} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                <h3 className="font-semibold text-sm text-gray-900 mb-1.5">{s.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{s.text}</p>
              </div>
            ))}
        </aside>
      </div>

      {/* Suggested products */}
      {related.length > 0 && <SuggestedProducts products={related} />}
    </div>
  );
}