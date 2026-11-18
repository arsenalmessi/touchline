
"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import BioDataForm from "./BioDataForm";
import ContactInfo from "./ContactInfo";
import ProfileInfoForm from "./ProfileInfoForm";
import { useOnboardingContext } from "@/context/context";
import type { Service, WorkerProfile } from "@prisma/client";


interface OnboardingStepsProps {
  id: string;

  WorkerProfile: (WorkerProfile & {
    services?: {
      serviceId: string;
      description?: string | null;
    }[];
  }) | null;

  services: Service[];
}


export default function OnboardingSteps({
  id,
  WorkerProfile,
  services,
}: OnboardingStepsProps) {
  const params = useSearchParams();
  const pathname = usePathname();

  const page = params.get("page") ?? "bio-data";

  const {
    trackingNumber,
    workerProfileId,
    savedDBData,
  } = useOnboardingContext();

  // Prefer the profile ID already in context, then the database profile ID.
  const formId =
    workerProfileId ||
    WorkerProfile?.id ||
    savedDBData?.id ||
    "";

  const currentTrackingNumber =
    trackingNumber ||
    savedDBData?.trackingNumber ||
    "";

  const steps = [
    {
      title: "Bio Data",
      page: "bio-data",
      component: (
        <BioDataForm
          userId={id}
          title="Bio Data"
          description="Please fill in your personal information"
          page={page}
          nextPage="contact"
          formId={formId}
          WorkerProfile={WorkerProfile}
        />
      ),
    },
    {
      title: "Contact Information",
      page: "contact",
      component: (
        <ContactInfo
          userId={id}
          title="Contact Information"
          description="Please fill in your contact information"
          page={page}
          nextPage="profile"
          formId={formId}
          WorkerProfile={WorkerProfile}
        />
      ),
    },
    {
      title: "Profile Information",
      page: "profile",
      component: (
        <ProfileInfoForm
          userId={id}
          title="Professional Profile"
          description="Tell clients about your services and experience"
          page={page}
          nextPage="final"
          formId={formId}
          services={services}
          WorkerProfile={WorkerProfile}
        />
      ),
    },
  ];

  const currentStep = steps.find((step) => step.page === page);

  return (
    <div className="grid min-h-[700px] grid-cols-1 overflow-hidden rounded-xl border border-[#b8924a]/20 bg-[#0c0b09] shadow-2xl lg:grid-cols-12">

    {/* Responsive Sidebar */}
    <aside className="border-b border-[#b8924a]/15 bg-[#080706] lg:col-span-3 lg:border-b-0 lg:border-r">
      <div className="flex overflow-x-auto scrollbar-hide lg:sticky lg:top-0 lg:flex-col lg:overflow-visible">
        {steps.map((step, index) => (
          <Link
            key={step.page}
            href={`${pathname}?page=${step.page}`}
            className={cn(
              "relative flex min-w-[150px] flex-1 flex-col justify-center gap-1 border-b-2 border-transparent px-4 py-4 text-center text-xs font-medium uppercase tracking-wider text-[#f0ebe0]/50 transition-all hover:bg-[#b8924a]/10 hover:text-[#b8924a] sm:min-w-[180px] sm:text-sm lg:min-w-0 lg:flex-none lg:items-start lg:border-b-0 lg:border-l-2 lg:px-6 lg:py-6 lg:text-left",
              step.page === page &&
                "border-[#b8924a] bg-[#b8924a]/10 text-[#b8924a] lg:border-b-0 lg:border-l-2"
            )}
          >
            <span className="text-[10px] tracking-[0.2em] text-[#b8924a]/50">
              STEP 0{index + 1}
            </span>

            <span className="whitespace-nowrap">
              {step.title}
            </span>
          </Link>
        ))}
      </div>
    </aside>

    {/* Main Content */}
    <main className="col-span-full min-w-0 p-4 text-[#f0ebe0] sm:col-span-9 sm:p-6 lg:p-8">
      {currentTrackingNumber && (
        <p className="mb-6 border-b border-[#b8924a]/20 pb-3 text-sm text-[#f0ebe0]/50">
          Your Tracking Number is{" "}
          <span className="font-semibold text-[#b8924a]">
            {currentTrackingNumber}
          </span>{" "}
          <span className="text-xs text-[#f0ebe0]/40">
            (Use this to check the status or resume your application)
          </span>
        </p>
      )}

      {currentStep ? (
        currentStep.component
      ) : (
        <div className="rounded-lg border border-[#b8924a]/20 bg-[#080706] p-6">
          <h2 className="text-lg font-semibold text-[#f0ebe0]">
            Step not found
          </h2>

          <p className="mt-2 text-sm text-[#f0ebe0]/50">
            Please select a valid onboarding step.
          </p>

          <Link
            href={`${pathname}?page=bio-data`}
            className="mt-4 inline-block text-sm font-medium text-[#b8924a] transition-colors hover:text-[#cba75e] hover:underline"
          >
            Return to Bio Data
          </Link>
        </div>
      )}
    </main>
  </div>
  );
}
