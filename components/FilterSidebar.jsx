"use client";

// Props:
// categories, brands, ramOptions          — string[]
// priceMax                                — number
// selectedCategories, selectedBrands, selectedRAM — string[]
// maxPrice                                — number
// onCategoryChange, onBrandChange, onRAMChange — (string[]) => void
// onMaxPriceChange                        — (number) => void
// onClearAll                              — () => void

export default function FilterSidebar({
  categories = [],
  brands = [],
  ramOptions = [],
  priceMax = 2000,
  selectedCategories,
  selectedBrands,
  selectedRAM,
  maxPrice,
  onCategoryChange,
  onBrandChange,
  onRAMChange,
  onMaxPriceChange,
  onClearAll,
}) {
  function toggle(list, setList, value) {
    setList(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
  }

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    selectedRAM.length > 0 ||
    maxPrice < priceMax;

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-white/60 p-4 sticky top-6 flex flex-col gap-5">

      {/* Category */}
      {categories.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">Category</p>
          <div className="flex flex-col gap-1.5">
            {categories.map((cat) => (
              <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary focus:ring-primary/20 cursor-pointer"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => toggle(selectedCategories, onCategoryChange, cat)}
                />
                <span className={`text-sm transition-colors ${selectedCategories.includes(cat) ? "text-gray-900 font-medium" : "text-gray-600 group-hover:text-gray-900"}`}>
                  {cat}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="h-px bg-gray-100" />

      {/* Brand */}
      {brands.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">Brand</p>
          <div className="flex flex-col gap-1.5">
            {brands.map((brand) => (
              <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary focus:ring-primary/20 cursor-pointer"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => toggle(selectedBrands, onBrandChange, brand)}
                />
                <span className={`text-sm transition-colors ${selectedBrands.includes(brand) ? "text-gray-900 font-medium" : "text-gray-600 group-hover:text-gray-900"}`}>
                  {brand}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="h-px bg-gray-100" />

      {/* Price slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Price / day</p>
          <span className="text-xs font-medium text-primary">up to ₹{maxPrice}</span>
        </div>
        <input
          type="range"
          min={100}
          max={priceMax}
          step={50}
          value={maxPrice}
          onChange={(e) => onMaxPriceChange(Number(e.target.value))}
          className="w-full accent-primary cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>₹100</span>
          <span>₹{priceMax}</span>
        </div>
      </div>

      {/* RAM */}
      {ramOptions.length > 0 && (
        <>
          <div className="h-px bg-gray-100" />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">RAM</p>
            <div className="flex flex-wrap gap-1.5">
              {ramOptions.map((ram) => (
                <button
                  key={ram}
                  onClick={() => toggle(selectedRAM, onRAMChange, ram)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-colors font-medium ${
                    selectedRAM.includes(ram)
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-600 border-gray-200 hover:border-primary/40 hover:text-primary"
                  }`}
                >
                  {ram}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Clear */}
      {hasActiveFilters && (
        <>
          <div className="h-px bg-gray-100" />
          <button
            onClick={onClearAll}
            className="text-xs text-gray-400 hover:text-gray-700 underline text-left transition-colors"
          >
            Clear all filters
          </button>
        </>
      )}
    </div>
  );
}