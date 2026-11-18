import React from "react";
import { getWorkerById, getWorkerProfile } from "@/actions/users";
import { authOptions } from "@/lib/auth";
import { cn } from "@/lib/utils";
import {
  Check,
  RefreshCcw,
  MapPin,
  User,
  Briefcase,
  ScrollText,
  Sparkles,
  Phone,
  Languages,
  Images,
  Home,
  Car,
  MessageCircle,
  MessageSquare,
  Globe,
  Clock,
} from "lucide-react";
import { getServerSession } from "next-auth";
import BackToSearch from "@/components/BackToSearch";
import PortfolioGallery from "@/components/PortfolioGallery";

function getWhatsAppNumber(phone?: string | null, country?: string | null) {
  if (!phone) return "";

  let number = phone.replace(/\D/g, "");

  if (number.startsWith("00")) {
    number = number.slice(2);
  }

  const normalizedCountry = country?.trim().toLowerCase();

  let code = "";

  if (["zim", "zimbabwe", "zw"].includes(normalizedCountry || "")) {
    code = "263";
  } else if (
    ["south africa", "south-africa", "za"].includes(normalizedCountry || "")
  ) {
    code = "27";
  }

  if (!code) return number;

  if (number.startsWith(code)) return number;

  number = number.replace(/^0+/, "");

  return `${code}${number}`;
}

function SectionHeading({
  title,
  icon: Icon,
  description,
}: {
  title: string;
  icon: React.ElementType;
  description?: string;
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#B8924A]/10">
          <Icon className="h-4 w-4 text-[#B8924A]" />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-[#F0EBE0]">{title}</h2>

          {description && (
            <p className="text-[11px] text-[#807969]">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value?: string | number | null;
}) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  return (
    <div className="flex min-w-0 items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.025] p-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#B8924A]/10">
        <Icon className="h-4 w-4 text-[#B8924A]" />
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-medium uppercase tracking-wider text-[#807969]">
          {label}
        </p>

        <p className="truncate text-sm font-medium text-[#F0EBE0]">{value}</p>
      </div>
    </div>
  );
}

function TagList({
  title,
  items,
  icon: Icon,
}: {
  title: string;
  items?: string[];
  icon: React.ElementType;
}) {
  if (!items?.length) return null;

  return (
    <section>
      <SectionHeading title={title} icon={Icon} />

      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="rounded-full border border-[#B8924A]/20 bg-[#B8924A]/[0.07] px-3 py-1.5 text-xs font-medium text-[#D6AD65]"
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}



function ServiceCard({ item }: { item: any }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-4 transition-colors hover:border-[#B8924A]/25">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold text-[#F0EBE0]">
          {item.service?.title || "Wellness Service"}
        </h3>

        <span
          className={cn(
            "shrink-0 rounded-full px-2 py-1 text-[9px] font-semibold uppercase tracking-wider",
            item.isActive
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-white/5 text-[#807969]"
          )}
        >
          {item.isActive ? "Active" : "Inactive"}
        </span>
      </div>

      {item.service?.description && (
        <p className="mt-2 text-xs leading-5 text-[#A49C8C]">
          {item.service.description}
        </p>
      )}

      {item.description && (
        <p className="mt-2 border-t border-white/[0.05] pt-2 text-xs leading-5 text-[#D6AD65]">
          {item.description}
        </p>
      )}
    </div>
  );
}

export default async function WorkerProfilePage(props: any) {
  const searchParams = await props.searchParams;
  const id = searchParams?.id as string | undefined;

  const session = await getServerSession(authOptions);

  if (!id) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080706]">
        <p className="text-sm text-[#A49C8C]">No worker ID was provided.</p>
      </div>
    );
  }

  const [worker, workerProfile] = await Promise.all([
    getWorkerById(id),
    getWorkerProfile(id),
  ]);

  if (!worker?.id || !worker.workerProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080706] px-4">
        <div className="max-w-md text-center">
          <User className="mx-auto mb-4 h-10 w-10 text-[#B8924A]" />

          <h2 className="text-xl font-semibold text-[#F0EBE0]">
            Profile Not Found
          </h2>

          <p className="mt-2 text-sm text-[#A49C8C]">
            This professional profile does not exist or may have been removed.
          </p>
        </div>
      </div>
    );
  }

  const profile = workerProfile || worker.workerProfile;

  const status = profile.status;
  const services = profile.services || [];

  const fullName = `${profile.firstName || ""} ${
    profile.lastName || ""
  }`.trim();

  const whatsappNumber = getWhatsAppNumber(worker.phone, profile.country);

  const isVerified = status === "APPROVED";

  const currentUserId = session?.user?.id;

  const inboxUrl = currentUserId
    ? `/dashboard/user/inbox?workerId=${encodeURIComponent(worker.id)}`
    : `/login`;

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-5 pt-8">
        {/* TOP BRANDING */}
        <BackToSearch />

       
{/* PROFILE HERO: GALLERY + HEADER */}

<div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-12">

{/* LEFT: PORTFOLIO GALLERY */}

<div className="min-w-0 lg:col-span-7">
  <PortfolioGallery images={profile.gallery} />
</div>

{/* RIGHT: PROFILE HEADER */}

<section className="relative flex min-w-0 flex-col justify-center overflow-hidden rounded-2xl border border-[#B8924A]/15 bg-[#100F0D] lg:col-span-5">
  <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-transparent via-[#B8924A] to-transparent" />

  <div className="flex flex-1 flex-col justify-center p-5 sm:p-7">

    <div className="flex flex-wrap items-center gap-2">

      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider",
          isVerified
            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
            : status === "REJECTED"
            ? "border-red-500/20 bg-red-500/10 text-red-400"
            : "border-amber-500/20 bg-amber-500/10 text-amber-400"
        )}
      >
        {isVerified ? (
          <Check className="h-3 w-3" />
        ) : (
          <RefreshCcw className="h-3 w-3" />
        )}

        {isVerified
          ? "Verified Professional"
          : status === "REJECTED"
          ? "Verification Unsuccessful"
          : "Verification Pending"}
      </span>
    </div>

    {profile.country && (
      <div className="mt-4 flex items-center gap-1.5 text-xs text-[#A49C8C]">
        <MapPin className="h-3.5 w-3.5 text-[#B8924A]" />
        {profile.city ? `${profile.city}, ` : ""}
        {profile.country}
      </div>
    )}

    <h1 className="mt-3 text-2xl font-semibold tracking-tight text-[#F0EBE0] sm:text-3xl">
      {fullName || "Wellness Professional"}
    </h1>

    {profile.headline && (
      <p className="mt-3 text-sm leading-6 text-[#D6AD65]">
        {profile.headline}
      </p>
    )}

    <div className="mt-4 flex flex-wrap gap-3 text-xs text-[#807969]">

      {profile.specialties?.length > 0 && (
        <span className="flex items-center gap-1.5">
          <Briefcase className="h-3.5 w-3.5 text-[#B8924A]" />
          {profile.specialties.slice(0, 2).join(" · ")}
        </span>
      )}

      {profile.yearsOfExperience != null && (
        <span className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-[#B8924A]" />
          {profile.yearsOfExperience} years experience
        </span>
      )}
    </div>

    {/* CONTACT ACTIONS */}

    <div className="mt-7 grid grid-cols-1 gap-2 sm:grid-cols-2">

      {whatsappNumber && (
        <a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-3 py-3 text-xs font-semibold text-white transition hover:bg-[#20BD5A]"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </a>
      )}

      <a
        href={inboxUrl}
        className="flex items-center justify-center gap-2 rounded-xl border border-[#B8924A]/40 bg-[#B8924A]/10 px-3 py-3 text-xs font-semibold text-[#D6AD65] transition hover:bg-[#B8924A]/20"
      >
        <MessageSquare className="h-4 w-4" />
        Send Message
      </a>

    </div>
  </div>
</section>
</div>


        {/* PROFILE INFORMATION */}

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* LEFT COLUMN */}

          <div className="space-y-5 lg:col-span-7">
            {/* ABOUT */}

            {profile.bio && (
              <section className="rounded-2xl border border-white/[0.06] bg-[#100F0D] p-5 sm:p-6">
                <SectionHeading
                  title="About"
                  icon={ScrollText}
                  description="Get to know this professional"
                />

                <p className="whitespace-pre-line text-sm leading-7 text-[#A49C8C]">
                  {profile.bio}
                </p>
              </section>
            )}

            {/* SERVICES */}

            <section className="rounded-2xl border border-white/[0.06] bg-[#100F0D] p-5 sm:p-6">
              <SectionHeading
                title="Services Offered"
                icon={Sparkles}
                description="Available wellness treatments and services"
              />

              {services.length > 0 ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {services.map((item: any) => (
                    <ServiceCard key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#807969]">
                  No services have been added yet.
                </p>
              )}
            </section>

            {/* SPECIALTIES */}

            {profile.specialties?.length > 0 && (
              <section className="rounded-2xl border border-white/[0.06] bg-[#100F0D] p-5 sm:p-6">
                <TagList
                  title="Areas of Specialisation"
                  items={profile.specialties}
                  icon={Briefcase}
                />
              </section>
            )}

            {/* LANGUAGES */}

            {profile.languages?.length > 0 && (
              <section className="rounded-2xl border border-white/[0.06] bg-[#100F0D] p-5 sm:p-6">
                <TagList
                  title="Languages Spoken"
                  items={profile.languages}
                  icon={Languages}
                />
              </section>
            )}
          </div>

          {/* RIGHT COLUMN */}

          <aside className="space-y-5 lg:col-span-5">
            {/* PERSONAL INFORMATION */}

            <section className="rounded-2xl border border-white/[0.06] bg-[#100F0D] p-5 sm:p-6">
              <SectionHeading
                title="Professional Details"
                icon={User}
                description="Personal and contact information"
              />

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <DetailItem icon={User} label="Gender" value={profile.gender} />

                <DetailItem
                  icon={Clock}
                  label="Age"
                  value={profile.age != null ? `${profile.age} years` : null}
                />

                <DetailItem icon={MapPin} label="City" value={profile.city} />

                <DetailItem
                  icon={Globe}
                  label="Country"
                  value={profile.country}
                />

                <DetailItem icon={Phone} label="Phone" value={worker.phone} />

                <DetailItem
                  icon={Briefcase}
                  label="Experience"
                  value={
                    profile.yearsOfExperience != null
                      ? `${profile.yearsOfExperience} years`
                      : null
                  }
                />
              </div>
            </section>

            {/* SERVICE PREFERENCES */}

            <section className="rounded-2xl border border-white/[0.06] bg-[#100F0D] p-5 sm:p-6">
              <SectionHeading
                title="Service Preferences"
                icon={Home}
                description="Where you can receive services"
              />

              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.025] p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#B8924A]/10">
                      <Car className="h-4 w-4 text-[#B8924A]" />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-[#F0EBE0]">
                        Mobile Services
                      </p>

                      <p className="text-[10px] text-[#807969]">
                        Professional travels to clients
                      </p>
                    </div>
                  </div>

                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[10px] font-semibold",
                      profile.mobileService
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-white/5 text-[#807969]"
                    )}
                  >
                    {profile.mobileService ? "Available" : "No"}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.025] p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#B8924A]/10">
                      <Home className="h-4 w-4 text-[#B8924A]" />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-[#F0EBE0]">
                        Studio Services
                      </p>

                      <p className="text-[10px] text-[#807969]">
                        Clients visit the professional
                      </p>
                    </div>
                  </div>

                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[10px] font-semibold",
                      profile.studioService
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-white/5 text-[#807969]"
                    )}
                  >
                    {profile.studioService ? "Available" : "No"}
                  </span>
                </div>
              </div>
            </section>

            {/* CONTACT CTA */}

            <section className="relative overflow-hidden rounded-2xl border border-[#B8924A]/20 bg-gradient-to-br from-[#1B1710] to-[#100F0D] p-5">
              <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#B8924A]/10 blur-3xl" />

              <div className="relative">
                <Sparkles className="mb-3 h-5 w-5 text-[#B8924A]" />

                <h3 className="text-lg font-semibold text-[#F0EBE0]">
                  Ready to connect?
                </h3>

                <p className="mt-2 text-xs leading-6 text-[#A49C8C]">
                  Get in touch with {profile.firstName || "this professional"}{" "}
                  to discuss services and availability.
                </p>

                <a
                  href={inboxUrl}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#B8924A] px-4 py-3 text-xs font-bold text-[#080706] transition hover:bg-[#D6AD65]"
                >
                  <MessageSquare className="h-4 w-4" />
                  Start a Conversation
                </a>
              </div>
            </section>
          </aside>
        </div>

        {/* FOOTER */}

        <footer className="flex items-center justify-center gap-2 border-t border-white/[0.05] py-6">
          <Sparkles className="h-3 w-3 text-[#B8924A]/60" />

          <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-[#807969]">
            Touchline · WELLNESS & CARE
          </p>
        </footer>
      </div>
    </main>
  );
}
