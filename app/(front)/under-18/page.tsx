
import Link from "next/link";
import { ShieldAlert, Sparkles } from "lucide-react";

export default function Under18Page() {
  return (
    <main className="min-h-screen bg-[#0d0a07] text-[#f5e8d0] flex items-center justify-center px-5">

      <div className="max-w-md w-full text-center">

        <Sparkles className="w-8 h-8 text-[#c98833] mx-auto mb-8" />

        <div className="w-16 h-16 border border-[#c9883340] rounded-full flex items-center justify-center mx-auto mb-7">
          <ShieldAlert className="w-7 h-7 text-[#c98833]" />
        </div>

        <p className="font-cormorant text-3xl tracking-[5px] uppercase mb-8">
          Touchline
        </p>

        <h1 className="font-cormorant text-4xl mb-5">
          Access Restricted
        </h1>

        <p className="text-sm text-[#9a8066] leading-7 mb-8">
          We appreciate your interest. Unfortunately, this
          platform is exclusively available to individuals
          aged 18 and above.
        </p>

        <Link
          href="https://www.google.com"
          className="inline-flex items-center justify-center px-8 py-4 bg-[#c98833] text-[#0d0a07] text-[9px] tracking-[3px] uppercase hover:bg-[#dfa34c] transition"
        >
          Leave Website
        </Link>

      </div>
    </main>
  );
}
