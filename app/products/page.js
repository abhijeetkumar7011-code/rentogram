"use client";

import { useEffect, useState, useMemo } from "react";
import { products as sampleProducts } from "../../lib/productsData";
import { supabase } from "../../lib/supabaseClient";
import ProductCard from "../../components/ProductCard";
import FilterSidebar from "../../components/FilterSidebar";
import {
  LayoutGrid,
  List,
  ShieldCheck,
  Truck,
  Wrench,
  Star,
  Loader2,
  Search,
  X,
  SlidersHorizontal,
} from "lucide-react";

const trustStats = [
  { icon: ShieldCheck, label: "Quality checked", value: "100%" },
  { icon: Truck, label: "Free delivery", value: "Pan India" },
  { icon: Wrench, label: "Free servicing", value: "Included" },
  { icon: Star, label: "Customer rating", value: "4.8/5" },
];

const SORT_OPTIONS = [
  { value: "popular", label: "Popular" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "name_asc", label: "Name: A–Z" },
];

export default function ProductsPage() {
  const [dbProducts, setDbProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("popular");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Filters
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedRAM, setSelectedRAM] = useState([]);
  const [maxPrice, setMaxPrice] = useState(2000);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        const mapped = data.map((p) => ({
          id: p.id,
          category: p.category,
          name: p.name,
          specs: p.specs,
          pricePerDay: p.price_per_day,
          image: p.image_url || "/images/laptop-placeholder.svg",
          tag: p.tag || "",
          brand: p.brand || "",
          ram: p.ram || "",
          rating: p.rating || 4.5,
          reviews: p.reviews || 0,
        }));
        setDbProducts(mapped);
      } else if (error) {
        console.error("Error fetching products:", error);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const allProducts = [...dbProducts, ...sampleProducts];

  // Derived filter options from data
  const categories = [...new Set(allProducts.map((p) => p.category).filter(Boolean))];
  const brands = [...new Set(allProducts.map((p) => p.brand).filter(Boolean))];
  const ramOptions = [...new Set(allProducts.map((p) => p.ram).filter(Boolean))];
  const priceMax = Math.max(...allProducts.map((p) => p.pricePerDay), 2000);

  // Filtered + sorted products
  const filtered = useMemo(() => {
    let list = allProducts.filter((p) => {
      if (search) {
        const q = search.toLowerCase();
        const match =
          p.name?.toLowerCase().includes(q) ||
          p.specs?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (selectedCategories.length && !selectedCategories.includes(p.category)) return false;
      if (selectedBrands.length && !selectedBrands.includes(p.brand)) return false;
      if (selectedRAM.length && !selectedRAM.includes(p.ram)) return false;
      if (p.pricePerDay > maxPrice) return false;
      return true;
    });

    if (sort === "price_asc") list.sort((a, b) => a.pricePerDay - b.pricePerDay);
    else if (sort === "price_desc") list.sort((a, b) => b.pricePerDay - a.pricePerDay);
    else if (sort === "name_asc") list.sort((a, b) => a.name.localeCompare(b.name));

    return list;
  }, [allProducts, search, selectedCategories, selectedBrands, selectedRAM, maxPrice, sort]);

  // Active filter chips
  const activeChips = [
    ...selectedCategories.map((v) => ({ label: v, remove: () => setSelectedCategories((p) => p.filter((x) => x !== v)) })),
    ...selectedBrands.map((v) => ({ label: v, remove: () => setSelectedBrands((p) => p.filter((x) => x !== v)) })),
    ...selectedRAM.map((v) => ({ label: `${v} RAM`, remove: () => setSelectedRAM((p) => p.filter((x) => x !== v)) })),
    ...(maxPrice < priceMax ? [{ label: `Under ₹${maxPrice}/day`, remove: () => setMaxPrice(priceMax) }] : []),
  ];

  function clearAll() {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedRAM([]);
    setMaxPrice(priceMax);
    setSearch("");
  }

  return (
    <div className="min-h-screen">
      {/* Page header + trust stats */}
      <div className="px-4 sm:px-8 pt-10 sm:pt-14 pb-8 sm:pb-10 text-center">
        <span className="inline-flex items-center gap-1.5 bg-white/60 border border-primary/20 text-primary font-semibold text-[11px] uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-4">
          <LayoutGrid size={11} /> Catalog
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-2 sm:mb-3 tracking-tight">
          Browse Our <span className="text-primary">Tech Inventory</span>
        </h1>
        <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto mb-8 sm:mb-10">
          Quality-checked laptops &amp; monitors, ready to rent.
        </p>

        {/* Trust stat cards */}
        <div className="max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {trustStats.map((s) => (
            <div
              key={s.label}
              className="bg-white/60 border border-white/80 rounded-2xl px-4 py-4 flex flex-col items-center gap-2 shadow-sm"
            >
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <s.icon size={18} className="text-primary" />
              </div>
              <div>
                <p className="font-bold text-sm sm:text-base text-gray-900 leading-tight">{s.value}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main layout */}
      <div className="max-w-6xl mx-auto flex gap-0 sm:gap-6 px-0 sm:px-6 py-6">
        {/* Sidebar — desktop */}
        <aside className="hidden md:block w-52 shrink-0">
          <FilterSidebar
            categories={categories}
            brands={brands}
            ramOptions={ramOptions}
            priceMax={priceMax}
            selectedCategories={selectedCategories}
            selectedBrands={selectedBrands}
            selectedRAM={selectedRAM}
            maxPrice={maxPrice}
            onCategoryChange={setSelectedCategories}
            onBrandChange={setSelectedBrands}
            onRAMChange={setSelectedRAM}
            onMaxPriceChange={setMaxPrice}
            onClearAll={clearAll}
          />
        </aside>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
            <div className="relative bg-white w-72 h-full overflow-y-auto shadow-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <p className="font-semibold text-sm text-gray-900">Filters</p>
                <button onClick={() => setSidebarOpen(false)}>
                  <X size={18} className="text-gray-500" />
                </button>
              </div>
              <FilterSidebar
                categories={categories}
                brands={brands}
                ramOptions={ramOptions}
                priceMax={priceMax}
                selectedCategories={selectedCategories}
                selectedBrands={selectedBrands}
                selectedRAM={selectedRAM}
                maxPrice={maxPrice}
                onCategoryChange={setSelectedCategories}
                onBrandChange={setSelectedBrands}
                onRAMChange={setSelectedRAM}
                onMaxPriceChange={setMaxPrice}
                onClearAll={clearAll}
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Topbar */}
          <div className="flex items-center gap-2 sm:gap-3 mb-3 px-4 sm:px-0 flex-wrap">
            {/* Mobile filter button */}
            <button
              className="md:hidden flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 font-medium"
              onClick={() => setSidebarOpen(true)}
            >
              <SlidersHorizontal size={15} /> Filters
              {activeChips.length > 0 && (
                <span className="ml-1 bg-primary text-white rounded-full text-[10px] w-4 h-4 flex items-center justify-center">
                  {activeChips.length}
                </span>
              )}
            </button>

            {/* Search */}
            <div className="flex-1 min-w-0 relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search laptops, monitors…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
              />
              {search && (
                <button className="absolute right-2.5 top-1/2 -translate-y-1/2" onClick={() => setSearch("")}>
                  <X size={13} className="text-gray-400" />
                </button>
              )}
            </div>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg bg-white px-3 py-2 focus:outline-none focus:border-primary/50 text-gray-700"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            {/* View toggle */}
            <div className="hidden sm:flex border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 transition-colors ${viewMode === "grid" ? "bg-primary/10 text-primary" : "bg-white text-gray-400 hover:bg-gray-50"}`}
                title="Grid view"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 transition-colors ${viewMode === "list" ? "bg-primary/10 text-primary" : "bg-white text-gray-400 hover:bg-gray-50"}`}
                title="List view"
              >
                <List size={16} />
              </button>
            </div>

            <span className="hidden sm:block text-xs text-gray-400 whitespace-nowrap">
              {filtered.length} product{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Active filter chips */}
          {activeChips.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap mb-3 px-4 sm:px-0">
              {activeChips.map((chip, i) => (
                <button
                  key={i}
                  onClick={chip.remove}
                  className="inline-flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-medium px-3 py-1 hover:bg-primary/20 transition-colors"
                >
                  {chip.label} <X size={11} />
                </button>
              ))}
              <button
                onClick={clearAll}
                className="text-xs text-gray-400 underline hover:text-gray-600 ml-1"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Product grid */}
          {loading ? (
            <div className="flex justify-center items-center py-24 text-gray-400">
              <Loader2 className="animate-spin mr-2" size={20} /> Loading products…
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24 text-gray-400">
              <p className="text-4xl mb-3">🔍</p>
              <p className="font-medium text-gray-600 mb-1">No products found</p>
              <p className="text-sm">Try adjusting your filters or search term.</p>
              <button onClick={clearAll} className="mt-4 text-sm text-primary underline">
                Clear all filters
              </button>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 px-4 sm:px-0"
                  : "flex flex-col gap-3 px-4 sm:px-0"
              }
            >
              {filtered.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-12">
        <div className="bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 rounded-2xl p-6 sm:p-10 text-center text-white shadow-lg">
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