import { useRef, useState, useEffect } from "react";
import { HiOutlineSparkles } from "react-icons/hi";
import { FaHeart } from "react-icons/fa";
import { GiDiamondRing } from "react-icons/gi";
import { PiFlowerTulipBold } from "react-icons/pi";

const FeaturedVideo = () => {
  const [videoInView, setVideoInView] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVideoInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="anim-fade-up anim-delay-4 my-10 lg:my-16">
      {/* Section header */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent" />
        <GiDiamondRing className="text-primary text-xl float-icon" />
        <h2 className="text-xl md:text-2xl lg:text-3xl text-text font-primary font-medium px-4 text-center whitespace-nowrap">
          Watch Us in Action
        </h2>
        <GiDiamondRing
          className="text-primary text-xl float-icon"
          style={{ animationDelay: "1s" }}
        />
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent" />
      </div>

      {/* Video container */}
      <div
        ref={videoRef}
        className="group relative max-w-4xl mx-auto rounded-3xl overflow-hidden border border-[#f5f0d9] hover:border-primary/40 shadow-xl hover:shadow-2xl hover:shadow-primary/15 transition-all duration-500 bg-gradient-to-br from-white to-[#faf8f0]"
      >
        {/* Decorative corners */}
        <div className="absolute top-3 left-3 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <HiOutlineSparkles className="text-primary text-lg" />
        </div>
        <div className="absolute top-3 right-3 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <PiFlowerTulipBold className="text-primary text-lg" />
        </div>

        {/* Gold top border accent */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />

        {/* Responsive 16:9 video embed — loads with autoplay once scrolled into view */}
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          {videoInView ? (
            <iframe
              src="https://player.vimeo.com/video/1165156541?autoplay=1&muted=1&loop=1&title=0&byline=0&portrait=0"
              className="absolute top-0 left-0 w-full h-full"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="Erie Wedding Officiants"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-[#faf8f0]">
              <GiDiamondRing className="text-primary/30 text-5xl animate-pulse" />
            </div>
          )}
        </div>

        {/* Gold bottom border accent */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
      </div>

      {/* Decorative bottom accent */}
      <div className="flex items-center justify-center gap-3 mt-5">
        <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#d4af37]/30" />
        <FaHeart
          className="text-primary/30 text-xs float-icon"
          style={{ animationDelay: "0.5s" }}
        />
        <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#d4af37]/30" />
      </div>
    </div>
  );
};

export default FeaturedVideo;
