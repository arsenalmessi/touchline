
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, BriefcaseBusiness, ArrowRight } from "lucide-react";

export default function RegistrationRolePage() {
  const router = useRouter();

  const [selectedRole, setSelectedRole] = useState<
    "CLIENT" | "WORKER" | null
  >(null);

  const handleContinue = () => {
    if (!selectedRole) return;
    router.push(`/register/form?role=${selectedRole}`);
  };

  return (
    <div className="h-screen overflow-hidden bg-[#050403] text-[#f0ebe0] flex flex-col">
      {/* Top Accent */}
      <div className="pt-4 flex items-center justify-center">
        <div className="w-12 h-px bg-[#2a2318]" />
        <div className="w-2 h-2 rounded-full bg-[#b8924a] mx-3" />
        <div className="w-12 h-px bg-[#2a2318]" />
      </div>

      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 max-w-5xl mx-auto w-full">

        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="font-serif text-2xl md:text-4xl font-light">
            Welcome!{" "}
            <span className="italic text-[#d4af71]">
              Let's Get Started
            </span>
          </h1>

          <p className="mt-2 text-xs md:text-sm text-[#a89880] max-w-xl mx-auto">
            Choose how you want to use our platform.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">

          {/* CLIENT */}
          <button
            type="button"
            onClick={() => setSelectedRole("CLIENT")}
            className={`group bg-[#100e0b] border transition-all duration-300 p-5 text-left hover:cursor-pointer hover:bg-[#15110d] ${
              selectedRole === "CLIENT"
                ? "border-[#b8924a]"
                : "border-[#2a2318]"
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`w-10 h-10 flex items-center justify-center border ${
                  selectedRole === "CLIENT"
                    ? "border-[#b8924a]"
                    : "border-[#2a2318]"
                }`}
              >
                <User size={18} className="text-[#b8924a]" />
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#7a5f32]">
                  For Customers
                </p>

                <h2 className="font-serif text-xl md:text-2xl">
                  Find Services
                </h2>
              </div>
            </div>

            <p className="text-sm text-[#a89880] leading-relaxed">
              Browse services, find the right provider and
              book appointments that suit your needs.
            </p>
          </button>

          {/* WORKER */}
          <button
            type="button"
            onClick={() => setSelectedRole("WORKER")}
            className={`group bg-[#100e0b] border transition-all duration-300 hover:cursor-pointer p-5 text-left hover:bg-[#15110d] ${
              selectedRole === "WORKER"
                ? "border-[#b8924a]"
                : "border-[#2a2318]"
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`w-10 h-10 flex items-center justify-center border ${
                  selectedRole === "WORKER"
                    ? "border-[#b8924a]"
                    : "border-[#2a2318]"
                }`}
              >
                <BriefcaseBusiness
                  size={18}
                  className="text-[#b8924a]"
                />
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#7a5f32]">
                  For Service Providers
                </p>

                <h2 className="font-serif text-xl md:text-2xl">
                  Offer Services
                </h2>
              </div>
            </div>

            <p className="text-sm text-[#a89880] leading-relaxed">
              Create your profile, list your services,
              manage bookings and connect with customers.
            </p>
          </button>
        </div>

        {/* Continue */}
        <div className="text-center">
          <button
            type="button"
            onClick={handleContinue}
            disabled={!selectedRole}
            className={`inline-flex items-center gap-2 px-7 py-3 border transition-all duration-300 ${
              selectedRole
                ? "border-[#b8924a] text-[#b8924a] hover:bg-[#b8924a] hover:text-black"
                : "border-[#2a2318] text-[#6b5e50]"
            }`}
          >
            <span className="uppercase tracking-[0.2em] text-xs">
              Continue
            </span>
            <ArrowRight size={14} />
          </button>

          <p className="mt-3 text-xs text-[#6b5e50]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#b8924a] hover:text-[#d4af71]"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
