import React from "react";

import {
  getWorkerProfileById,
  getActiveServices,
} from "@/actions/onboarding";

import OnboardingSteps from "@/components/Onboarding/OnboardingSteps";
import { OnboardingContextProvider } from "@/context/context";

export default async function OnboardingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch the existing worker profile and available services.
  const [profileResponse, servicesResponse] = await Promise.all([
    getWorkerProfileById(id),
    getActiveServices(),
  ]);

  const workerProfile = profileResponse?.data ?? null;
  const services = servicesResponse?.data ?? [];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050403] text-[#f0ebe0]">
      {/* Ambient background effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#b8924a]/[0.07] blur-[140px]" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#b8924a]/[0.05] blur-[140px]" />

        <div className="absolute inset-0 bg-[radial-gradient(#b8924a08_1px,transparent_1px)] [background-size:32px_32px]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#b8924a]/30 bg-[#b8924a]/[0.08] px-4 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#b8924a]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#b8924a]">
              Professional Registration
            </span>
          </div>

          <h1 className="font-serif text-3xl font-medium tracking-tight text-[#f0ebe0] sm:text-4xl lg:text-5xl">
            Your Journey Begins Here
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#f0ebe0]/55 sm:text-base">
            Create your professional profile and introduce your services
            to clients looking for exceptional wellness experiences.
          </p>

          <div className="mx-auto mt-6 h-px w-20 bg-gradient-to-r from-transparent via-[#b8924a] to-transparent" />
        </div>

        {/* Onboarding */}
        <div className="flex-1">
          <div className="mx-auto max-w-4xl rounded-2xl border border-[#b8924a]/20 bg-[#0c0b09]/90 p-4 shadow-[0_25px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8 lg:p-10">
            <OnboardingContextProvider>
              <OnboardingSteps
                id={id}
                WorkerProfile={workerProfile}
                services={services}
              />
            </OnboardingContextProvider>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-10 text-center">
          <p className="text-xs tracking-wide text-[#f0ebe0]/35">
            Crafted for professionals. Designed for exceptional experiences.
          </p>
        </footer>
      </div>
    </main>
  );
}