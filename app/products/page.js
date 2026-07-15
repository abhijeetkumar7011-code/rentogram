"use client";

import { useEffect, useState, useMemo } from "react";
import { products as sampleProducts } from "../../lib/productsData";
import { supabase } from "../../lib/supabaseClient";
import ProductCard from "../../components/ProductCard";
import FilterSidebar from "../../components/FilterSidebar";
import {
  LayoutGrid, List, ShieldCheck, Truck, Wrench, Star,
  Loader2, Search, X, SlidersHorizontal, PackageSearch, ChevronDown,
} from "lucide-react";

// ── Constants ──────────────────────────────────────────────────────────────────

const TRUST_STATS = [
  { icon: ShieldCheck, label: "Quality checked", value: "100%"     },
  { icon: Truck,       label: "Free delivery",   value: "Pan India" },
  { icon: Wrench,      label: "Free servicing",  value: "Included"  },
  { icon: Star,        label: "Customer rating", value: "4.8 / 5"  },
];

const SORT_OPTIONS = [
  { value: "popular",    label: "Popular"          },
  { value: "price_asc",  label: "Price: low → high"},
  { value: "price_desc", label: "Price: high → low"},
  { value: "name_asc",   label: "Name: A – Z"      },
];

// ── Sub-components ─────────────────────────────────────────────────────────────

function ActiveChips({ chips, onClearAll }) {
  if (!chips.length) return null;
  return (
    <div className="flex items-center gap-2 flex-wrap mb-3">
      {chips.map((chip, i) => (
        <button
          key={i}
          onClick={chip.remove}
          className="inline-flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-medium px-3 py-1 hover:bg-primary/20 transition-colors"
        >
          {chip.label} <X size={11} />
        </button>
      ))}
      <button onClick={onClearAll} className="text-xs text-gray-400 underline hover:text-gray-600">
        Clear all
      </button>
    </div>
  );
}

function EmptyState({ onClear }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
      <div className="w-16 h-16 rounded-2xl bg-white/60 border border-white/80 flex items-center justify-center shadow-sm mb-1">
        <PackageSearch size={28} className="text-gray-300" />
      </div>
      <p className="font-semibold text-gray-700">No products found</p>
      <p className="text-sm text-gray-400 max-w-xs">Try adjusting your filters or search term.</p>
      <button onClick={onClear} className="mt-1 text-sm text-primary underline hover:opacity-80">
        Clear all filters
      </button>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function ProductsPage() {
  const [dbProducts, setDbProducts]                   = useState([]);
  const [loading, setLoading]                         = useState(true);
  const [viewMode, setViewMode]                       = useState("grid");
  const [search, setSearch]                           = useState("");
  const [sort, setSort]                               = useState("popular");
  const [sidebarOpen, setSidebarOpen]                 = useState(false);
  const [selectedCategories, setSelectedCategories]   = useState([]);
  const [selectedBrands, setSelectedBrands]           = useState([]);
  const [selectedRAM, setSelectedRAM]                 = useState([]);
  const [maxPrice, setMaxPrice]                       = useState(null); // null = no cap yet (synced once products load)
  const [sortOpen, setSortOpen]                       = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setDbProducts(data.map((p) => ({
          id:          p.id,
          slug:        p.slug,
          category:    p.category,
          name:        p.name,
          specs:       p.specs,
          pricePerDay: p.price_per_day,
          image:       p.image_url || "/images/laptop-placeholder.svg",
          tag:         p.tag     || "",
          brand:       p.brand   || "",
          ram:         p.ram     || "",
          rating:      p.rating  || 4.5,
          reviews:     p.reviews || 0,
        })));
      } else if (error) {
        console.error("Error fetching products:", error);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  // Show only what's actually in Supabase. The static sample catalog is
  // purely a fallback for when the DB is empty (e.g. brand-new setup) —
  // once you have real products, they take over completely.
  const allProducts = dbProducts.length > 0 ? dbProducts : sampleProducts;

  const categories = [...new Set(allProducts.map((p) => p.category).filter(Boolean))];
  const brands     = [...new Set(allProducts.map((p) => p.brand).filter(Boolean))];
  const ramOptions = [...new Set(allProducts.map((p) => p.ram).filter(Boolean))];
  const priceMax   = Math.max(...allProducts.map((p) => p.pricePerDay), 2000);

  // Sync the price cap to the real computed max once (products load async from
  // Supabase, so priceMax isn't known on first render). Without this, the cap
  // stayed hard-coded at ₹2000 and silently hid any pricier product from the
  // listing by default.
  useEffect(() => {
    if (maxPrice === null && !loading) setMaxPrice(priceMax);
  }, [maxPrice, loading, priceMax]);

  const effectiveMaxPrice = maxPrice ?? priceMax;

  const filtered = useMemo(() => {
    let list = allProducts.filter((p) => {
      if (search) {
        const q = search.toLowerCase();
        if (
          !p.name?.toLowerCase().includes(q) &&
          !p.specs?.toLowerCase().includes(q) &&
          !p.brand?.toLowerCase().includes(q) &&
          !p.category?.toLowerCase().includes(q)
        ) return false;
      }
      if (selectedCategories.length && !selectedCategories.includes(p.category)) return false;
      if (selectedBrands.length     && !selectedBrands.includes(p.brand))        return false;
      if (selectedRAM.length        && !selectedRAM.includes(p.ram))             return false;
      if (p.pricePerDay > effectiveMaxPrice)                                      return false;
      return true;
    });
    if      (sort === "price_asc")  list.sort((a, b) => a.pricePerDay - b.pricePerDay);
    else if (sort === "price_desc") list.sort((a, b) => b.pricePerDay - a.pricePerDay);
    else if (sort === "name_asc")   list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [allProducts, search, selectedCategories, selectedBrands, selectedRAM, effectiveMaxPrice, sort]);

  const activeChips = [
    ...selectedCategories.map((v) => ({ label: v,           remove: () => setSelectedCategories((p) => p.filter((x) => x !== v)) })),
    ...selectedBrands.map((v)     => ({ label: v,           remove: () => setSelectedBrands((p)     => p.filter((x) => x !== v)) })),
    ...selectedRAM.map((v)        => ({ label: `${v} RAM`,  remove: () => setSelectedRAM((p)        => p.filter((x) => x !== v)) })),
    ...(effectiveMaxPrice < priceMax ? [{ label: `Under ₹${effectiveMaxPrice}/day`, remove: () => setMaxPrice(priceMax) }] : []),
  ];

  function clearAll() {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedRAM([]);
    setMaxPrice(priceMax);
    setSearch("");
  }

  const sidebarProps = {
    categories, brands, ramOptions, priceMax,
    selectedCategories, selectedBrands, selectedRAM, maxPrice: effectiveMaxPrice,
    onCategoryChange: setSelectedCategories,
    onBrandChange:    setSelectedBrands,
    onRAMChange:      setSelectedRAM,
    onMaxPriceChange: setMaxPrice,
    onClearAll:       clearAll,
  };

  return (
    <div className="min-h-screen">

      {/* ── Hero ── centered, max-w matches content below ──────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-8 sm:pb-10">

        {/* Title block — centered */}
        <div className="text-center mb-8 sm:mb-10">
          <span className="inline-flex items-center gap-1.5 bg-white/60 border border-primary/20 text-primary font-semibold text-[11px] uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-4 shadow-sm backdrop-blur-sm">
            <LayoutGrid size={11} /> Catalog
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-2 sm:mb-3 tracking-tight">
            Browse Our <span className="text-primary">Tech Inventory</span>
          </h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto">
            Quality-checked laptops &amp; monitors, ready to rent.
          </p>
        </div>

        {/* Trust stats — full width of max-w-6xl, split into 4 equal cols */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {TRUST_STATS.map((s) => (
            <div
              key={s.label}
              className="bg-white/50 border border-white/70 rounded-2xl px-4 py-4 flex items-center gap-3 shadow-sm backdrop-blur-sm"
            >
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <s.icon size={17} className="text-primary" />
              </div>
              <div className="text-left min-w-0">
                <p className="font-bold text-sm sm:text-[15px] text-gray-900 leading-tight truncate">{s.value}</p>
                <p className="text-[11px] text-gray-500 mt-0.5 truncate">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Divider ─────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="h-px bg-white/40" />
      </div>

      {/* ── Toolbar — aligned with sidebar + content ─────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center gap-2 sm:gap-3">

          {/* Placeholder matching sidebar width on desktop so search aligns with cards */}
          <div className="hidden md:block w-52 shrink-0" />

          {/* Row 1 (mobile): Filter + Sort + View toggle */}
          <div className="flex md:contents items-center gap-2 w-full">

            {/* Mobile filter button */}
            <button
              className="md:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/60 bg-white/50 text-sm text-gray-700 font-medium shadow-sm backdrop-blur-sm shrink-0"
              onClick={() => setSidebarOpen(true)}
            >
              <SlidersHorizontal size={14} />
              Filters
              {activeChips.length > 0 && (
                <span className="bg-primary text-white rounded-full text-[10px] w-4 h-4 flex items-center justify-center font-bold">
                  {activeChips.length}
                </span>
              )}
            </button>

            {/* Sort — custom glassmorphic dropdown */}
            <div className="relative flex-1 md:flex-none">
              <button
                onClick={() => setSortOpen((o) => !o)}
                className="w-full md:w-auto flex items-center justify-between gap-2 px-3 py-2 rounded-xl border border-white/60 bg-white/50 backdrop-blur-md shadow-sm text-xs sm:text-sm text-gray-700 font-medium hover:bg-white/70 transition-all"
              >
                <span>{SORT_OPTIONS.find((o) => o.value === sort)?.label ?? "Popular"}</span>
                <ChevronDown
                  size={14}
                  className={`text-gray-400 transition-transform duration-200 ${sortOpen ? "rotate-180" : ""}`}
                />
              </button>

              {sortOpen && (
                <>
                  {/* Backdrop to close */}
                  <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />

                  {/* Dropdown panel */}
                  <div className="absolute left-0 md:right-0 md:left-auto top-[calc(100%+6px)] z-20 min-w-[180px] rounded-2xl border border-white/60 bg-white/70 backdrop-blur-xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="px-3 pt-2.5 pb-1.5 border-b border-white/50">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Sort by</p>
                    </div>
                    {/* Options */}
                    <div className="py-1.5 px-1.5 flex flex-col gap-0.5">
                      {SORT_OPTIONS.map((o) => (
                        <button
                          key={o.value}
                          onClick={() => { setSort(o.value); setSortOpen(false); }}
                          className={`w-full text-left text-sm px-3 py-2 rounded-xl transition-all font-medium flex items-center justify-between gap-2 ${
                            sort === o.value
                              ? "bg-primary/10 text-primary"
                              : "text-gray-600 hover:bg-white/80 hover:text-gray-900"
                          }`}
                        >
                          {o.label}
                          {sort === o.value && (
                            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* View toggle */}
            <div className="flex border border-white/60 rounded-xl overflow-hidden shadow-sm bg-white/50 backdrop-blur-sm shrink-0">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 transition-colors ${viewMode === "grid" ? "bg-primary/10 text-primary" : "text-gray-400 hover:bg-white/40"}`}
                title="Grid view"
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 transition-colors ${viewMode === "list" ? "bg-primary/10 text-primary" : "text-gray-400 hover:bg-white/40"}`}
                title="List view"
              >
                <List size={15} />
              </button>
            </div>

            <span className="hidden sm:block text-xs text-gray-400 whitespace-nowrap shrink-0">
              {filtered.length} product{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Row 2 (mobile): Search — full width */}
          <div className="flex-1 md:contents w-full">
            <div className="relative w-full md:flex-1">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search laptops, monitors…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-8 py-2 text-sm border border-white/60 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 placeholder:text-gray-400"
              />
              {search && (
                <button className="absolute right-2.5 top-1/2 -translate-y-1/2" onClick={() => setSearch("")}>
                  <X size={12} className="text-gray-400" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Sidebar + Cards ─────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-6">
        <div className="flex gap-6">

          {/* Sidebar — desktop */}
          <aside className="hidden md:block w-52 shrink-0">
            <FilterSidebar {...sidebarProps} />
          </aside>

          {/* Mobile sidebar drawer */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-50 flex md:hidden">
              <div
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
                onClick={() => setSidebarOpen(false)}
              />
              <div className="relative bg-white/95 w-72 h-full overflow-y-auto shadow-2xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-semibold text-sm text-gray-900">Filters</p>
                  <button onClick={() => setSidebarOpen(false)}>
                    <X size={18} className="text-gray-500" />
                  </button>
                </div>
                <FilterSidebar {...sidebarProps} />
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">

            {/* Active chips */}
            <ActiveChips chips={activeChips} onClearAll={clearAll} />

            {/* Grid / List / Loading / Empty */}
            {loading ? (
              <div className="flex justify-center items-center py-24 text-gray-400 gap-2">
                <Loader2 className="animate-spin" size={20} /> Loading products…
              </div>
            ) : filtered.length === 0 ? (
              <EmptyState onClear={clearAll} />
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
                    : "flex flex-col gap-3"
                }
              >
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} viewMode={viewMode} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom CTA ──────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-14">
        <div className="bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 rounded-2xl p-6 sm:p-10 text-center text-white shadow-xl">
          <h2 className="text-lg sm:text-2xl font-bold mb-2">Need something custom?</h2>
          <p className="text-white/80 text-xs sm:text-sm mb-5 max-w-md mx-auto">
            Bulk orders, enterprise setups, or a specific configuration — we&apos;ve got you covered.
          </p>
          <a
            href="/contact"
            className="inline-block bg-white text-primary px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold text-sm hover:bg-white/90 transition-colors shadow-md"
          >
            Contact our team
          </a>
        </div>
      </div>

    </div>
  );
}