
"use client";

import { useState } from "react";
import { ShieldCheck, Sparkles, Lock } from "lucide-react";

export default function AgeVerificationPage() {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/age-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isAdult: true }),
      });

      if (!response.ok) {
        throw new Error("Verification failed");
      }

      const params = new URLSearchParams(window.location.search);
      const returnTo = params.get("returnTo");

      // Prevent external redirects
      const destination =
        returnTo?.startsWith("/") && !returnTo.startsWith("//")
          ? returnTo
          : "/";

      window.location.assign(destination);
    } catch {
      setLoading(false);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleDecline = () => {
    window.location.assign("/under-18");
  };

  return (
    <main className="relative min-h-screen bg-[#0d0a07] text-[#f5e8d0] flex items-center justify-center px-5 py-12 overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,#382412_0%,#0d0a07_70%)]" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-[#c98833]/[0.06] rounded-full blur-[100px]" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-lg">

        {/* Branding */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 border border-[#c9883350] bg-[#c98833]/[0.05] mb-6">
            <Sparkles className="w-6 h-6 text-[#c98833]" />
          </div>

          <p className="font-cormorant text-3xl tracking-[5px] uppercase text-[#e8d5b8]">
            Touchline
          </p>

          <p className="text-[9px] tracking-[4px] uppercase text-[#8a6a4a] mt-3">
            Private Lifestyle Experiences
          </p>
        </div>

        {/* Verification Card */}
        <div className="border border-[#2a1f14] bg-[#110e09]/90 p-7 sm:p-10 shadow-2xl">

          <div className="flex justify-center mb-7">
            <div className="w-16 h-16 rounded-full border border-[#c9883340] flex items-center justify-center">
              <ShieldCheck className="w-7 h-7 text-[#c98833]" />
            </div>
          </div>

          <div className="text-center">
            <p className="text-[9px] tracking-[4px] uppercase text-[#c98833] mb-4">
              Age Verification
            </p>

            <h1 className="font-cormorant text-4xl sm:text-5xl font-light leading-tight text-[#f5e8d0] mb-5">
              A Private World.
              <span className="block italic text-[#c98833]">
                For Adults Only.
              </span>
            </h1>

            <p className="text-sm leading-7 text-[#9a8066] font-light max-w-sm mx-auto">
              Touchline is intended exclusively for adults aged 18 and
              above. Please confirm your age before continuing.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-9 space-y-3">

            <button
              type="button"
              onClick={handleConfirm}
              disabled={loading}
              className="w-full min-h-[54px] bg-[#c98833] hover:bg-[#dfa34c] text-[#0d0a07] text-[10px] tracking-[3px] uppercase font-medium transition-all duration-300 disabled:opacity-50"
            >
              {loading
                ? "Please wait..."
                : "Yes, I am 18 or older"}
            </button>

            <button
              type="button"
              onClick={handleDecline}
              disabled={loading}
              className="w-full min-h-[54px] border border-[#3a2b1b] hover:border-[#c98833] text-[#a68a6c] hover:text-[#e8d5b8] text-[10px] tracking-[3px] uppercase transition-all duration-300"
            >
              No, I am under 18
            </button>

          </div>

          {/* Privacy notice */}
          <div className="mt-8 pt-6 border-t border-[#2a1f14]">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Lock className="w-3 h-3 text-[#c98833]" />
              <span className="text-[8px] tracking-[3px] uppercase text-[#8a6a4a]">
                Privacy & Discretion
              </span>
            </div>

            <p className="text-[10px] leading-5 text-center text-[#65513d]">
              By continuing, you confirm that you are at least 18
              years old and agree to our Terms of Service and
              Privacy Policy.
            </p>
          </div>

        </div>

        <p className="text-center text-[8px] tracking-[2px] uppercase text-[#51402e] mt-8">
          © {new Date().getFullYear()} Touchline. All rights reserved.
        </p>

      </div>
    </main>
  );
}
