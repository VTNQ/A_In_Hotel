const AmenitiesSkeleton = () => (
  <div className="border rounded-xl p-5 animate-pulse">
    <div className="h-4 w-32 bg-gray-200 rounded mb-4" />
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-4 bg-gray-200 rounded" />
      ))}
    </div>
  </div>
)
export default AmenitiesSkeleton
