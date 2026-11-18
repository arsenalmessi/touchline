
"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  Images,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from "lucide-react";

interface PortfolioGalleryProps {
  images?: string[];
}

export default function PortfolioGallery({
  images = [],
}: PortfolioGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  const validImages = images.filter(
    (image): image is string =>
      typeof image === "string" && image.trim().length > 0
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const closeViewer = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const showNext = useCallback(() => {
    setActiveIndex((current) =>
      current === null
        ? null
        : (current + 1) % validImages.length
    );
  }, [validImages.length]);

  const showPrevious = useCallback(() => {
    setActiveIndex((current) =>
      current === null
        ? null
        : (current - 1 + validImages.length) % validImages.length
    );
  }, [validImages.length]);

  // Keyboard navigation and body scroll locking
  useEffect(() => {
    if (activeIndex === null) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeViewer();
      }

      if (event.key === "ArrowRight") {
        showNext();
      }

      if (event.key === "ArrowLeft") {
        showPrevious();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, closeViewer, showNext, showPrevious]);

  if (!validImages.length) {
    return (
      <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#B8924A]/20 bg-[#100F0D]">
        <Images className="mb-4 h-10 w-10 text-[#B8924A]/50" />

        <h3 className="text-sm font-semibold text-[#F0EBE0]">
          Portfolio coming soon
        </h3>

        <p className="mt-2 text-xs text-[#807969]">
          No portfolio photographs uploaded yet.
        </p>
      </div>
    );
  }

  const featuredImages = validImages.slice(0, 5);

  return (
    <>
      {/* PORTFOLIO GALLERY */}

      <section className="min-w-0 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Images className="h-4 w-4 text-[#B8924A]" />

            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D6AD65]">
              Portfolio Gallery
            </h2>
          </div>

          <span className="text-xs text-[#807969]">
            {validImages.length} Photos
          </span>
        </div>

        {/* IMAGE GRID */}

        <div className="grid grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-2xl">
          {featuredImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Expand photograph ${index + 1}`}
              className={`group relative overflow-hidden rounded-xl border border-[#B8924A]/10 bg-[#151310] ${
                index === 0
                  ? "col-span-2 row-span-2 min-h-[220px]"
                  : "aspect-square"
              }`}
            >
              <Image
                src={image}
                alt={`Portfolio photograph ${index + 1}`}
                fill
                unoptimized
                priority={index === 0}
                sizes="(max-width: 640px) 50vw, 30vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/30">
                <Maximize2 className="h-6 w-6 text-white opacity-0 transition group-hover:opacity-100" />
              </div>

              {index === 0 && (
                <span className="absolute bottom-3 left-3 rounded-full border border-white/20 bg-black/60 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-widest text-white backdrop-blur">
                  Featured
                </span>
              )}
            </button>
          ))}
        </div>

        {validImages.length > 5 && (
          <button
            type="button"
            onClick={() => setActiveIndex(5)}
            className="w-full rounded-xl border border-[#B8924A]/20 bg-[#B8924A]/[0.06] py-3 text-xs font-semibold text-[#D6AD65] transition hover:bg-[#B8924A]/15"
          >
            View all {validImages.length} photographs
          </button>
        )}

        {validImages.length <= 5 && (
          <p className="text-right text-[10px] text-[#807969]">
            Click a photograph to expand
          </p>
        )}
      </section>

      {/* FULLSCREEN VIEWER - RENDERED OUTSIDE THE PAGE */}

      {mounted &&
        activeIndex !== null &&
        createPortal(
          <div
            className="fixed inset-0 z-[99999] flex h-[100dvh] w-screen flex-col bg-[#050403]"
            role="dialog"
            aria-modal="true"
            aria-label="Portfolio image viewer"
          >
            {/* TOP BAR */}

            <div className="flex shrink-0 items-center justify-between border-b border-white/10 bg-[#080706] px-4 py-4 sm:px-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D6AD65]">
                  Touchline PORTFOLIO
                </p>

                <p className="mt-1 text-[11px] text-[#807969]">
                  Photograph {activeIndex + 1} of {validImages.length}
                </p>
              </div>

              <button
                type="button"
                onClick={closeViewer}
                aria-label="Close viewer"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:border-[#B8924A] hover:bg-[#B8924A]/20"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* MAIN IMAGE AREA */}

            <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-12 py-4 sm:px-24">
              {/* PREVIOUS */}

              {validImages.length > 1 && (
                <button
                  type="button"
                  onClick={showPrevious}
                  aria-label="Previous photograph"
                  className="absolute left-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/70 text-white transition hover:bg-[#B8924A] sm:left-6 sm:h-14 sm:w-14"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              )}

              {/* IMAGE */}

              <div className="relative h-full w-full max-w-6xl">
                <Image
                  key={`${activeIndex}-${validImages[activeIndex]}`}
                  src={validImages[activeIndex]}
                  alt={`Portfolio photograph ${activeIndex + 1}`}
                  fill
                  unoptimized
                  priority
                  sizes="100vw"
                  className="object-contain"
                />
              </div>

              {/* NEXT */}

              {validImages.length > 1 && (
                <button
                  type="button"
                  onClick={showNext}
                  aria-label="Next photograph"
                  className="absolute right-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/70 text-white transition hover:bg-[#B8924A] sm:right-6 sm:h-14 sm:w-14"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              )}
            </div>

            {/* BOTTOM THUMBNAILS */}

            <div className="shrink-0 border-t border-white/10 bg-[#080706] px-3 py-4 sm:px-8">
              <div className="mx-auto flex max-w-5xl items-center justify-center gap-2 overflow-x-auto pb-1">
                {validImages.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    aria-label={`View photograph ${index + 1}`}
                    className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition sm:h-16 sm:w-16 ${
                      activeIndex === index
                        ? "border-[#D6AD65] opacity-100"
                        : "border-transparent opacity-40 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={image}
                      alt=""
                      fill
                      unoptimized
                      sizes="64px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
