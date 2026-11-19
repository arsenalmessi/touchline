import { Sparkles, ShieldCheck, Star } from "lucide-react";

const adverts = [
  {
    icon: Sparkles,
    title: "Personal Experiences",
    description:
      "Discover independent companions and lifestyle professionals offering personalised experiences in your preferred setting.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy & Discretion",
    description:
      "Explore profiles with confidence, supported by clear standards, privacy-conscious interactions and verified information.",
  },
  {
    icon: Star,
    title: "Exceptional Company",
    description:
      "Discover distinctive personalities and curated experiences designed around your preferences and expectations.",
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