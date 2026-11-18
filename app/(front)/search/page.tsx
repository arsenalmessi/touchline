
import { Suspense } from "react";

import WorkersListWithPagination from "@/components/WorkersListWithPagination";
import { separateAndCapitalise } from "@/lib/utils";
import type { Worker } from "@/types/types";
import Adverts from "@/components/frontend/Adverts";
import SearchBarSP from "@/components/frontend/SearchBarSP";
import { getworkersBySearch } from "@/actions/workers";
import WorkerFilters from "@/components/frontend/WorkerFilters";


interface SearchPageProps {
  searchParams: Promise<{
    city?: string;
    country?: string;
    specialization?: string;
    gender?: string;
    minAge?: string;
    maxAge?: string;
    minExperience?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
  }>;
}

// Main page - synchronous wrapper
export default function SearchPage({
  searchParams,
}: SearchPageProps) {
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchResults searchParams={searchParams} />
    </Suspense>
  );
}

// Loading skeleton
function SearchLoading() {
  return (
    <div className="min-h-screen bg-[#0d0b08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-12 bg-[#1e1a14] mb-10 mt-10 rounded" />

          <div className="h-10 bg-[#1e1a14] w-2/3 mb-10 rounded" />

          <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
            <div className="hidden lg:block lg:col-span-1 bg-[#100e0b] border border-[#2a2318] rounded min-h-64" />

            <div className="lg:col-span-5 bg-[#100e0b] border border-[#2a2318] rounded min-h-96 p-6">
              <div className="h-5 bg-[#1e1a14] w-1/3 rounded mb-8" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-64 bg-[#1e1a14] rounded" />
                <div className="h-64 bg-[#1e1a14] rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Actual search results
async function SearchResults({
  searchParams,
}: SearchPageProps) {
  const PageShell = ({
    children,
  }: {
    children: React.ReactNode;
  }) => (
    <div className="min-h-screen bg-[#0d0b08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {children}
      </div>
    </div>
  );

  try {
    // Resolve URL parameters inside Suspense
    const params = await searchParams;
    const toNumber = (value?: string): number | undefined => {
      if (!value || !value.trim()) return undefined;
    
      const number = Number(value);
    
      return Number.isFinite(number) && number >= 0
        ? number
        : undefined;
    };
    
    const minAge = toNumber(params.minAge);
    const maxAge = toNumber(params.maxAge);
    const minExperience = toNumber(params.minExperience);
    const minPrice = toNumber(params.minPrice);
    const maxPrice = toNumber(params.maxPrice);
    const country = params.country?.trim() || "";

    const city = params.city?.trim() || "";
    const specialization =
      params.specialization?.trim() || "";

    const formattedSpecialization = specialization
      ? separateAndCapitalise(specialization)
      : "";

    const formattedCity = city
      ? separateAndCapitalise(city)
      : "";

    const heading =
      formattedCity && formattedSpecialization
        ? `${formattedSpecialization} professionals in ${formattedCity}`
        : formattedCity
          ? ` professionals in ${formattedCity}`
          : formattedSpecialization
            ? `${formattedSpecialization} professionals`
            : "All  professionals";

    const emptyMessage =
      formattedCity && formattedSpecialization
        ? `No ${formattedSpecialization} professionals found in ${formattedCity}.`
        : formattedCity
          ? `No  professionals found in ${formattedCity}.`
          : formattedSpecialization
            ? `No ${formattedSpecialization} professionals found.`
            : "No  professionals found.";

    // Fetch workers
 

    const data = await getworkersBySearch(
      city,
      specialization,
      {
        gender: params.gender || undefined,
        country: country || undefined,
        minAge,
        maxAge,
        minExperience,
        minPrice,
        maxPrice,
      }
    );

    const workers: Worker[] = data?.workers ?? [];

    return (
      <PageShell>
        {/* Search */}
        <div className="mb-10 mt-10">
          <SearchBarSP />
        </div>
        <WorkerFilters />

        {/* Page heading */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-px bg-[#b8924a]" />

            <span className="font-sans text-[10px] tracking-[0.25em] text-[#7a5f32] uppercase">
              Results
            </span>
          </div>

          <h1 className="font-serif text-4xl md:text-3xl font-light text-[#f0ebe0] leading-tight">
            {formattedCity && formattedSpecialization ? (
              <>
                {formattedSpecialization}{" "}
                <em className="italic text-[#b8924a]">
                  in {formattedCity}
                </em>
              </>
            ) : formattedCity ? (
              <>
                professionals{" "}
                <em className="italic text-[#b8924a]">
                  in {formattedCity}
                </em>
              </>
            ) : formattedSpecialization ? (
              <em className="italic text-[#b8924a]">
                {formattedSpecialization}
              </em>
            ) : (
              <>
                All{" "}
                <em className="italic text-[#b8924a]">
                   professionals
                </em>
              </>
            )}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 order-1 hidden lg:block">
            <div className="border border-[#2a2318] bg-[#100e0b] p-4 sticky top-6">
              <p className="font-sans text-[9px] tracking-[0.25em] text-[#4a3e30] uppercase mb-3">
                Featured
              </p>

              <Adverts />
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-5 order-2">
            {workers.length > 0 ? (
              <div className="border border-[#2a2318] bg-[#100e0b]">
                <div className="px-6 py-4 border-b border-[#1e1a14] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-px bg-[#b8924a]" />

                    <span className="font-sans text-[10px] tracking-[0.25em] text-[#7a5f32] uppercase">
                      {workers.length}{" "}
                      {workers.length === 1
                        ? "Therapist"
                        : "professionals"}{" "}
                      Found
                    </span>
                  </div>

                  <span className="font-serif italic text-[#4a3e30] text-sm hidden sm:block">
                    {heading}
                  </span>
                </div>

                <div className="p-6">
                  <WorkersListWithPagination
                    workers={workers}
                  />
                </div>
              </div>
            ) : (
              <div className="border border-[#2a2318] bg-[#100e0b] flex flex-col items-center justify-center py-24 px-8 text-center">
                <div className="text-4xl mb-6 opacity-20 select-none">
                  ✦
                </div>

                <div className="w-12 h-px bg-[#2a2318] mb-6" />

                <h2 className="font-serif text-2xl font-light text-[#f0ebe0] mb-3">
                  No Results Found
                </h2>

                <p className="font-sans text-xs text-[#6b5e50] font-light max-w-sm leading-relaxed">
                  {emptyMessage} Try adjusting your search or
                  browse all available professionals.
                </p>

                <div className="w-12 h-px bg-[#2a2318] mt-6" />
              </div>
            )}
          </div>
        </div>

        {/* Mobile adverts */}
        <div className="mt-8 lg:hidden border border-[#2a2318] bg-[#100e0b] p-4">
          <p className="font-sans text-[9px] tracking-[0.25em] text-[#4a3e30] uppercase mb-3">
            Featured
          </p>

          <Adverts />
        </div>
      </PageShell>
    );
  } catch (error) {
    console.error("Error fetching workers:", error);

    return (
      <PageShell>
        <div className="mb-10 mt-10">
          <SearchBarSP />
        </div>

        <div className="border border-[#2a2318] bg-[#100e0b] flex flex-col items-center justify-center py-24 px-8 text-center">
          <div className="text-4xl mb-6 opacity-20 select-none">
            ✦
          </div>

          <div className="w-12 h-px bg-[#2a2318] mb-6" />

          <h2 className="font-serif text-2xl font-light text-[#f0ebe0] mb-3">
            Something Went Wrong
          </h2>

          <p className="font-sans text-xs text-[#6b5e50] font-light max-w-sm leading-relaxed">
            Unable to load professionals. Please try again.
          </p>

          <div className="w-12 h-px bg-[#2a2318] mt-6" />
        </div>

        <div className="mt-8 border border-[#2a2318] bg-[#100e0b] p-4">
          <p className="font-sans text-[9px] tracking-[0.25em] text-[#4a3e30] uppercase mb-3">
            Featured
          </p>

          <Adverts />
        </div>
      </PageShell>
    );
  }
}
