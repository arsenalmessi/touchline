import React from "react";
import { Sparkles} from "lucide-react";
import Image from "next/image";
import TransitionalText from "./TransitionalText";
import SearchBar from "./SearchBar";

const Hero = () => {
  const TEXTS = ["Therapists", "Masseuses", "Wellness Experts"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap');
        .font-cormorant { font-family: 'Cormorant Garamond', serif; }
      `}</style>

      <section
        className="relative min-h-screen bg-[#0d0a07] text-[#f5e8d0] overflow-hidden"
        aria-labelledby="shiftly-hero-heading"
      >
        {/* Background radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_40%,#3b2612_0%,#0d0a07_70%)] pointer-events-none" />
        {/* Gold orb */}
        <div className="absolute right-[8%] top-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[radial-gradient(circle,rgba(201,136,51,0.18)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-28">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">

            {/* ── Text content ── */}
            <div className="md:w-1/2 text-center md:text-left">

              {/* Eyebrow */}
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="h-px w-10 bg-[#c98833]" />
                <p className="text-[#c98833] text-[10px] font-light tracking-[4px] uppercase font-[Montserrat,sans-serif]">
                  Luxury Wellness Staffing
                </p>
              </div>

              {/* Headline */}
              <h1
                id="shiftly-hero-heading"
                className="font-cormorant font-light leading-[1.1] mb-6"
              >
                <span className="block text-5xl md:text-6xl text-[#f5e8d0]">Find Expert</span>
                <span className="block text-5xl md:text-6xl italic text-[#c98833]">
                  <TransitionalText TEXTS={TEXTS} />
                </span>
                <span className="block text-5xl md:text-6xl text-[#f5e8d0]">Across ZIM</span>
              </h1>


              {/* Feature pillars */}
              {/* <ul className="flex justify-center md:justify-start gap-8 mb-10" aria-label="Key qualities">
                {[
                  { icon: <Sparkles className="w-5 h-5 text-[#c98833]" />, label: "Refined" },
                  { icon: <Users className="w-5 h-5 text-[#c98833]" />, label: "Expert" },
                  { icon: <Star className="w-5 h-5 text-[#c98833]" />, label: "Trusted" },
                ].map(({ icon, label }) => (
                  <li key={label} className="flex flex-col items-center gap-2">
                    <div className="w-11 h-11 border border-[#2a1f14] flex items-center justify-center bg-[#110e09]">
                      {icon}
                    </div>
                    <span className="text-[9px] tracking-[3px] text-[#6b5540] uppercase">{label}</span>
                  </li>
                ))}
              </ul> */}

             {/* Search section */}
          <div>
            <p className="text-[9px] tracking-[4px] text-[#c98833] uppercase text-center mb-4">Find Your Ritual</p>
            <SearchBar />
          </div>
            </div>

            {/* ── Image content ── */}
            <div className="md:w-1/2 relative">
              <div className="relative">

                {/* Subtle glow blobs */}
                <div className="absolute -top-6 -left-6 w-28 h-28 rounded-full bg-[#c98833] opacity-[0.07] blur-2xl pointer-events-none" />
                <div className="absolute -bottom-8 -right-8 w-36 h-36 rounded-full bg-[#c98833] opacity-[0.07] blur-2xl pointer-events-none" />

                {/* Gold border frame — offset */}
                <div className="absolute -top-3 -left-3 w-full h-full border border-[#c9883330] pointer-events-none z-0" />

                {/* Main image */}
                <div className="relative z-10 overflow-hidden border border-[#2a1f14]">
                  <Image
                    className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
                    height={360}
                    width={360}
                    sizes="(max-width: 568px) 100vw, 50vw"
                    src="/hero1.webp"
                    alt="Professional massage therapist providing a luxury treatment"
                    priority
                  />
                  {/* Dark vignette overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#0d0a07]/40 to-transparent pointer-events-none" />
                </div>

                {/* Floating badge */}
                <div className="absolute -bottom-5 -right-4 z-20 bg-[#110e09] border border-[#1e160d] px-4 py-3 max-w-[200px]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 border border-[#c9883340] flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-[#c98833]" />
                    </div>
                    <div>
                      <p className="font-cormorant italic text-[#e8d5b8] text-[15px] leading-tight">5,000+ therapists</p>
                      <p className="text-[8px] tracking-[2px] text-[#5a4535] uppercase mt-0.5">Ready to serve</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          {/* <div className="flex items-center gap-4 justify-center my-14">
            <div className="h-px flex-1 max-w-[80px] bg-[#2a1f14]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#c98833] opacity-60" />
            <div className="h-px flex-1 max-w-[80px] bg-[#2a1f14]" />
          </div> */}

          
        </div>
      </section>
    </>
  );
};

export default Hero;