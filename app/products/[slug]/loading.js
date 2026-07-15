export default function ProductDetailLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-14 animate-pulse">
      <div className="h-4 w-48 bg-gray-100 rounded mb-8" />
      <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 mb-14">
        <div>
          <div className="aspect-square rounded-2xl sm:rounded-3xl bg-gray-100 mb-3" />
          <div className="flex gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gray-100" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-4 w-24 bg-gray-100 rounded" />
          <div className="h-8 w-3/4 bg-gray-100 rounded" />
          <div className="h-4 w-full bg-gray-100 rounded" />
          <div className="h-4 w-2/3 bg-gray-100 rounded" />
          <div className="h-10 w-40 bg-gray-100 rounded" />
          <div className="h-12 w-full bg-gray-100 rounded-full" />
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}