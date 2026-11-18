
"use client";

import Link from "next/link";
import type { Worker } from "@/types/types";

interface WorkerCardProps {
  worker: Worker;
  isInPerson?: boolean;
}

export default function WorkerCard({ worker }: WorkerCardProps) {
  const profile = worker.workerProfile;

  if (!profile?.slug) return null;

  const name =
    `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim() ||
    worker.name ||
    "Therapist";

  const city = profile.city || profile.country || "Location not specified";
  const country = profile.country || profile.country || "Location not specified";

  const image =
    profile.coverImage ||
    profile.gallery?.[0] ||
    profile.profilePicture ||
    worker.image ||
    null;


  return (
    <Link
      href={`/workers/${encodeURIComponent(profile.slug)}?id=${worker.id}`}
      className="block group"
    >
      <article
        className="
          relative overflow-hidden
          border border-[#2a2318]
          bg-[#100e0b]
          transition-all duration-500 ease-out
          hover:border-[#b8924a66]
          hover:-translate-y-1
          hover:shadow-[0_24px_60px_rgba(0,0,0,0.6)]
        "
      >
        {/* Image / Hero */}
        <div className="relative h-72 overflow-hidden bg-[#19140e]">
          {image ? (
            <img
              src={image}
              alt={name}
              loading="lazy"
              className="
                w-full h-full object-cover
                transition-transform duration-700
                group-hover:scale-105
              "
            />
          ) : (
            <div
              className="
                w-full h-full flex items-center justify-center
                bg-gradient-to-br from-[#211a10] to-[#0d0b08]
              "
            >
              <span className="font-serif text-7xl text-[#b8924a]">
                {name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          {/* Image overlay */}
          <div
            className="
              absolute inset-0
              bg-gradient-to-t
              from-black/90 via-black/10 to-black/10
            "
          />

          {/* Availability badge */}
          {profile.isAvailable && (
            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 bg-black/60 border border-[#b8924a44] backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-[9px] uppercase tracking-[0.18em] text-[#f0ebe0]">
                Available
              </span>
            </div>
          )}

          {/* Name over image */}
          <div className="absolute bottom-5 left-5 right-5">
            <p className="text-[9px] uppercase tracking-[0.25em] text-[#d4af71] mb-2">
              {city}
            </p>

            <h3
              className="
                font-serif text-3xl font-light
                text-[#f0ebe0]
                group-hover:text-[#d4af71]
                transition-colors duration-300
              "
            >
              {name}
            </h3>

            <p className="mt-1 text-xs text-white/65 line-clamp-1">
              {country}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
     

          {/* Footer */}
          <div
            className="
              pt-4 border-t border-[#2a2318]
              flex items-center justify-between
            "
          >
            <span className="text-[9px] uppercase tracking-[0.2em] text-[#6b5e50]">
              View Profile
            </span>

            <span
              className="
                text-[#b8924a] text-lg
                transition-transform duration-300
                group-hover:translate-x-2
              "
            >
              →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
