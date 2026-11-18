
"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  SlidersHorizontal,
  RotateCcw,
  ChevronDown,
  Search,
} from "lucide-react";

const inputClass =
  "w-full h-9 bg-[#0d0b08] border border-[#30271c] px-2.5 text-xs text-[#f0ebe0] outline-none focus:border-[#b8924a] transition-colors placeholder:text-[#655746]";

const labelClass =
  "block text-[9px] uppercase tracking-[0.12em] text-[#9a8260] mb-1.5";

export default function WorkerFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [gender, setGender] = useState("");
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [minExperience, setMinExperience] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [country, setCountry] = useState("");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setGender(searchParams.get("gender") || "");
    setMinAge(searchParams.get("minAge") || "");
    setMaxAge(searchParams.get("maxAge") || "");
    setMinExperience(searchParams.get("minExperience") || "");
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
    setCountry(searchParams.get("country") || "");
  }, [searchParams]);

  const activeFilters = [
    gender,
    minAge,
    maxAge,
    country,
    minExperience,
    minPrice,
    maxPrice,
  ].filter(Boolean).length;

  function applyFilters() {
    const params = new URLSearchParams(searchParams.toString());

    const filters: Record<string, string> = {
      gender,
      minAge,
      maxAge,
      country,
      minExperience,
      minPrice,
      maxPrice,
    };

    Object.entries(filters).forEach(([key, value]) => {
      if (value.trim()) {
        params.set(key, value.trim());
      } else {
        params.delete(key);
      }
    });

    params.delete("page");

    router.push(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  }

  function clearFilters() {
    const params = new URLSearchParams(searchParams.toString());

    [
      "gender",
      "minAge",
      "maxAge",
      "country",
      "minExperience",
      "minPrice",
      "maxPrice",
      "page",
    ].forEach((key) => params.delete(key));

    setGender("");
    setMinAge("");
    setMaxAge("");
    setCountry("");
    setMinExperience("");
    setMinPrice("");
    setMaxPrice("");

    router.push(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  }

  return (
    <section className="mb-4 border border-[#2a2318] bg-[#100e0b]">
      {/* Compact header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#2a2318]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={14} className="text-[#b8924a]" />

          <span className="text-[10px] uppercase tracking-[0.14em] text-[#f0ebe0] font-medium">
            Filters
          </span>

          {activeFilters > 0 && (
            <span className="bg-[#b8924a]/15 text-[#b8924a] text-[9px] px-1.5 py-0.5">
              {activeFilters} active
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-[10px] text-[#b8924a] hover:text-[#f0ebe0]"
        >
          {expanded ? "Less" : "More filters"}
          <ChevronDown
            size={13}
            className={`transition-transform ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      <div className="p-3">
        {/* Main filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div>
            <label className={labelClass}>Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className={inputClass}
            >
              <option value="">Any gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Country</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className={inputClass}
            >
              <option value="">All countries</option>
              <option value="Zimbabwe">Zimbabwe</option>
              <option value="South Africa">South Africa</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Min age</label>
            <input
              type="number"
              min="18"
              max="100"
              placeholder="Min age"
              value={minAge}
              onChange={(e) => setMinAge(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Max age</label>
            <input
              type="number"
              min="18"
              max="100"
              placeholder="Max age"
              value={maxAge}
              onChange={(e) => setMaxAge(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* Additional filters */}
        {/* {expanded && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-3 pt-3 border-t border-[#2a2318]">
            <div>
              <label className={labelClass}>Min experience (years)</label>
              <input
                type="number"
                min="0"
                placeholder="Experience"
                value={minExperience}
                onChange={(e) => setMinExperience(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Min hourly rate</label>
              <input
                type="number"
                min="0"
                placeholder="Minimum price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Max hourly rate</label>
              <input
                type="number"
                min="0"
                placeholder="Maximum price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        )} */}

        {/* Compact actions */}
        <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-[#2a2318]">
          <button
            type="button"
            onClick={clearFilters}
            className="flex items-center gap-1.5 text-[10px] text-[#8b7962] hover:text-[#f0ebe0] transition-colors"
          >
            <RotateCcw size={11} />
            Clear
          </button>

          <button
            type="button"
            onClick={applyFilters}
            className="flex items-center gap-1.5 bg-[#b8924a] hover:bg-[#cba65f] text-[#0d0b08] px-4 py-2 text-[9px] uppercase tracking-[0.12em] font-semibold transition-colors"
          >
            <Search size={12} />
            Apply filters
          </button>
        </div>
      </div>
    </section>
  );
}
