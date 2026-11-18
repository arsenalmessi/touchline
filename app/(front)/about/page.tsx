
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Users,
  Globe2,
  HeartHandshake,
  Search,
  Sparkles,
  Target,
  Eye,
  CheckCircle2,
} from "lucide-react";

const values = [
  {
    number: "01",
    icon: ShieldCheck,
    title: "Trust & Transparency",
    description:
      "We believe great connections start with trust. We aim to create a platform where clients can discover providers with greater confidence and clarity.",
  },
  {
    number: "02",
    icon: Users,
    title: "People First",
    description:
      "Every service is delivered by a person with skills, experience and ambition. We put people at the centre of everything we build.",
  },
  {
    number: "03",
    icon: Globe2,
    title: "Accessibility",
    description:
      "We want discovering and advertising services to be simple, accessible and convenient, regardless of where you are.",
  },
  {
    number: "04",
    icon: HeartHandshake,
    title: "Meaningful Connections",
    description:
      "Our goal is to bring clients and independent service providers together through a straightforward discovery experience.",
  },
];

const steps = [
  {
    number: "01",
    title: "Discover",
    description:
      "Explore service providers, browse categories and find services that match your needs.",
  },
  {
    number: "02",
    title: "Connect",
    description:
      "View provider profiles, learn more about their offerings and get in touch directly.",
  },
  {
    number: "03",
    title: "Grow",
    description:
      "Providers can showcase their services, build visibility and reach potential clients.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050403] text-[#f0ebe0]">
      {/* Navigation */}
      <nav className="relative z-20 border-b border-white/[0.07]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <Link
            href="/"
            className="group flex items-center gap-3 text-sm text-[#f0ebe0]/60 transition hover:text-[#b8924a]"
          >
            <ArrowLeft size={16} />
            <span>Back to home</span>
          </Link>

          <Link href="/" className="text-2xl font-semibold tracking-[0.25em]">
            TOUCH<span className="text-[#b8924a]">LINE</span>
          </Link>

          <Link
            href="/"
            className="hidden items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#b8924a] transition hover:text-[#f0ebe0] sm:flex"
          >
            Explore platform
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 pb-28 pt-28 lg:px-10 lg:pb-36 lg:pt-36">
        <div className="pointer-events-none absolute -right-40 top-0 h-[500px] w-[500px] rounded-full bg-[#b8924a]/[0.07] blur-[130px]" />
        <div className="pointer-events-none absolute -left-40 bottom-0 h-[350px] w-[350px] rounded-full bg-[#b8924a]/[0.04] blur-[120px]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mb-8 flex items-center gap-3">
            <span className="h-px w-10 bg-[#b8924a]" />
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#b8924a]">
              Get to know us
            </span>
          </div>

          <h1 className="max-w-5xl font-serif text-5xl leading-[1.08] tracking-tight sm:text-6xl lg:text-8xl">
            Connecting people.
            <br />
            <span className="italic text-[#b8924a]">
              Creating opportunities.
            </span>
          </h1>

          <div className="mt-12 grid gap-10 border-t border-white/10 pt-8 md:grid-cols-2 md:items-end">
            <p className="max-w-xl text-lg leading-8 text-[#f0ebe0]/65">
              Touchline is a service discovery and advertising platform
              designed to bring people and independent service providers
              closer together.
            </p>

            <p className="max-w-md text-sm leading-7 text-[#f0ebe0]/40 md:ml-auto">
              We believe finding the right service should be straightforward,
              while promoting your skills and business should open doors to
              new possibilities.
            </p>
          </div>
        </div>
      </section>

      {/* Brand statement */}
      <section className="border-y border-white/[0.07] bg-[#0b0906] px-6 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#b8924a]">
              Our story
            </span>
            <h2 className="mt-6 font-serif text-4xl leading-tight sm:text-5xl">
              More than a
              <br />
              <span className="italic text-[#b8924a]">listing platform.</span>
            </h2>
          </div>

          <div className="space-y-6 text-base leading-8 text-[#f0ebe0]/60">
            <p>
              Finding reliable services and reaching the right customers can
              be difficult. Independent professionals and businesses often
              have the skills to deliver exceptional work, but lack a simple
              way to showcase what they offer.
            </p>

            <p>
              Touchline was created to help bridge that gap. We provide a
              platform where service providers can present their offerings
              and where clients can discover services that meet their needs.
            </p>

            <p>
              From browsing provider profiles to making direct connections,
              our focus is on making the discovery process easier, more
              accessible and more convenient.
            </p>

            <p className="border-l border-[#b8924a] pl-6 font-serif text-xl italic text-[#f0ebe0]">
              We are building a space where skills get seen, services get
              discovered and opportunities begin.
            </p>
          </div>
        </div>
      </section>

 

 

      {/* How it works */}
      <section className="px-6 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#b8924a]">
              The Touchline experience
            </span>
            <h2 className="mt-5 font-serif text-4xl sm:text-5xl">
              Simple connections.
              <br />
              <span className="italic text-[#b8924a]">Real opportunities.</span>
            </h2>
            <p className="mt-6 text-sm leading-7 text-[#f0ebe0]/45">
              Whether you are looking for a service or promoting one, getting
              started is straightforward.
            </p>
          </div>

          <div className="grid gap-12 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.number} className="relative border-t border-white/10 pt-8">
                <div className="mb-8 flex items-center justify-between">
                  <span className="font-serif text-4xl text-[#b8924a]/50">
                    {step.number}
                  </span>
                  {index === 0 && <Search className="text-[#b8924a]" />}
                  {index === 1 && <HeartHandshake className="text-[#b8924a]" />}
                  {index === 2 && <Sparkles className="text-[#b8924a]" />}
                </div>

                <h3 className="font-serif text-2xl">{step.title}</h3>
                <p className="mt-4 text-sm leading-7 text-[#f0ebe0]/45">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="relative overflow-hidden border-t border-white/10 bg-[#0b0906] px-6 py-28 text-center lg:px-10 lg:py-36">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#b8924a]/[0.07] blur-[100px]" />

        <div className="relative mx-auto max-w-3xl">
          <div className="mx-auto mb-8 flex h-14 w-14 items-center justify-center rounded-full border border-[#b8924a]/30 text-[#b8924a]">
            <CheckCircle2 size={24} />
          </div>

          <span className="text-[10px] uppercase tracking-[0.35em] text-[#b8924a]">
            Be part of the journey
          </span>

          <h2 className="mt-6 font-serif text-4xl leading-tight sm:text-6xl">
            Your next connection
            <br />
            <span className="italic text-[#b8924a]">starts here.</span>
          </h2>

          <p className="mx-auto mt-7 max-w-xl text-sm leading-7 text-[#f0ebe0]/50">
            Discover services, showcase your skills and connect with new
            opportunities through Touchline.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/search"
              className="inline-flex items-center justify-center gap-3 bg-[#b8924a] px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#050403] transition hover:bg-[#d0ad68]"
            >
              Explore Touchline
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-3 border border-white/15 px-8 py-4 text-xs uppercase tracking-[0.2em] transition hover:border-[#b8924a] hover:text-[#b8924a]"
            >
              Join the community
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>

 
    </main>
  );
}
