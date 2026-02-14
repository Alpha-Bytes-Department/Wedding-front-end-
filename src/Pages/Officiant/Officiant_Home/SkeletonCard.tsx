/** Skeleton placeholder card shown while officiants are loading */
const SkeletonCard = () => (
  <div className="bg-white rounded-3xl shadow-lg overflow-hidden max-w-sm mx-auto w-full animate-pulse">
    {/* Image skeleton */}
    <div className="h-64 bg-gradient-to-br from-[#f5f0d9] to-[#e9d69a]/30" />
    {/* Content skeleton */}
    <div className="p-6 space-y-4">
      <div className="flex justify-center">
        <div className="h-6 w-40 bg-[#f5f0d9] rounded-full" />
      </div>
      <div className="flex justify-center">
        <div className="h-4 w-28 bg-[#f5f0d9] rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full bg-[#f5f0d9] rounded-full" />
        <div className="h-3 w-3/4 bg-[#f5f0d9] rounded-full mx-auto" />
      </div>
      <div className="flex justify-center pt-2">
        <div className="h-10 w-32 bg-[#f5f0d9] rounded-full" />
      </div>
    </div>
  </div>
);

export default SkeletonCard;
