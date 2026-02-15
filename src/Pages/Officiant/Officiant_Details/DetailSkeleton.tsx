import { GiDiamondRing } from "react-icons/gi";
import { FaHeart } from "react-icons/fa";

/** Full-page skeleton for OfficiantDetail while data is loading */
const DetailSkeleton = () => (
  <div className="pt-24 md:pt-30 px-5 md:px-10 lg:px-20 animate-pulse">
    {/* Section title skeleton */}
    <div className="md:pt-5 lg:pt-10 flex items-center gap-3">
      <div className="h-8 w-64 bg-[#f5f0d9] rounded-full" />
    </div>

    {/* Decorative divider */}
    <div className="flex items-center justify-center gap-3 mt-4 mb-8">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#d4af37]/20 to-transparent" />
      <GiDiamondRing className="text-primary/30 text-lg" />
      <FaHeart className="text-primary/20 text-xs" />
      <GiDiamondRing className="text-primary/30 text-lg" />
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#d4af37]/20 to-transparent" />
    </div>

    {/* Profile card + bio skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
      {/* Left: profile card */}
      <div className="max-w-md mx-auto w-full rounded-3xl border border-[#f5f0d9] shadow-lg p-8 flex flex-col items-center gap-4">
        <div className="size-36 rounded-full bg-[#f5f0d9]" />
        <div className="h-6 w-40 bg-[#f5f0d9] rounded-full" />
        <div className="h-4 w-24 bg-[#f5f0d9] rounded-full" />
        <div className="h-10 w-full bg-[#f5f0d9] rounded-xl mt-2" />
      </div>

      {/* Right: bio & stats */}
      <div className="col-span-2 space-y-5 pt-4">
        <div className="space-y-3">
          <div className="h-4 w-full bg-[#f5f0d9] rounded-full" />
          <div className="h-4 w-full bg-[#f5f0d9] rounded-full" />
          <div className="h-4 w-5/6 bg-[#f5f0d9] rounded-full" />
          <div className="h-4 w-3/4 bg-[#f5f0d9] rounded-full" />
        </div>
        <div className="flex flex-col md:flex-row gap-6 pt-4">
          <div className="h-5 w-44 bg-[#f5f0d9] rounded-full" />
          <div className="h-5 w-52 bg-[#f5f0d9] rounded-full" />
        </div>
        <div className="h-5 w-40 bg-[#f5f0d9] rounded-full" />
      </div>
    </div>

    {/* Packages title skeleton */}
    <div className="md:pt-10 lg:pt-16 flex items-center gap-3">
      <div className="h-8 w-52 bg-[#f5f0d9] rounded-full" />
    </div>

    {/* Package cards skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 py-5 lg:py-10">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-2xl border border-[#f5f0d9] shadow-lg p-6 space-y-4"
        >
          <div className="h-5 w-48 bg-[#f5f0d9] rounded-full" />
          <div className="h-7 w-24 bg-[#f5f0d9] rounded-full" />
          <div className="h-px w-full bg-[#f5f0d9]" />
          <div className="space-y-3">
            {[1, 2, 3].map((j) => (
              <div key={j} className="h-4 w-full bg-[#f5f0d9] rounded-full" />
            ))}
          </div>
        </div>
      ))}
    </div>

    {/* Reviews title skeleton */}
    <div className="flex justify-center pt-8">
      <div className="h-8 w-32 bg-[#f5f0d9] rounded-full" />
    </div>

    {/* Review cards skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-8">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-2xl border border-[#f5f0d9] shadow-lg p-6 space-y-4"
        >
          <div className="space-y-2">
            <div className="h-3 w-full bg-[#f5f0d9] rounded-full" />
            <div className="h-3 w-5/6 bg-[#f5f0d9] rounded-full" />
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((j) => (
              <div key={j} className="size-4 bg-[#f5f0d9] rounded-sm" />
            ))}
          </div>
          <div className="flex gap-3 items-center pt-2">
            <div className="size-12 rounded-full bg-[#f5f0d9]" />
            <div className="space-y-2">
              <div className="h-4 w-28 bg-[#f5f0d9] rounded-full" />
              <div className="h-3 w-16 bg-[#f5f0d9] rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default DetailSkeleton;
