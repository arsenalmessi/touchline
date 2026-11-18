import { Sparkles, ShieldCheck, Star } from "lucide-react";

const adverts = [
  {
    icon: Sparkles,
    title: "Mobile Therapists",
    description: "Expert massage therapists who come to you — at home, hotel, or office.",
  },
  {
    icon: ShieldCheck,
    title: "Fully Vetted",
    description: "Every therapist is certified, insured, and background-checked for your peace of mind.",
  },
  {
    icon: Star,
    title: "Luxury Experience",
    description: "From deep tissue to hot stone — tailored treatments for every body and mood.",
  },
];

const Adverts = () => {
  return (
    <section className="relative border border-[#2a2318] bg-[#100e0b] overflow-hidden">
      {/* Top accent */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, #b8924a, transparent)" }}
      />

      <div className="px-4 py-6 flex flex-col items-center space-y-8">
        {adverts.map(({ icon: Icon, title, description }) => (
          <div key={title} className="text-center">
            {/* Icon ring */}
            <div className="mb-4 mx-auto w-10 h-10 border border-[#b8924a44] flex items-center justify-center relative">
              <div
                className="absolute inset-0 opacity-10"
                style={{ background: "radial-gradient(circle, #b8924a, transparent)" }}
              />
              <Icon className="w-4 h-4 text-[#b8924a] relative z-10" />
            </div>

            <p className="font-sans text-[10px] tracking-[0.25em] text-[#b8924a] uppercase mb-2">
              {title}
            </p>
            <p className="font-sans text-xs text-[#6b5e50] font-light leading-relaxed">
              {description}
            </p>

            {/* Divider — skip on last */}
            <div className="w-8 h-px bg-[#1e1a14] mx-auto mt-6" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Adverts;