
import Link from "next/link";
import { Session } from "next-auth";
import { getClientBookings } from "@/actions/bookings";
import generateSlug from "@/utils/generateSlug";

import {
  Search,
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  CircleEllipsis,
  ArrowRight,
  BriefcaseBusiness,
  CalendarCheck,
  Users,
  Sparkles,
  MapPin,
  Plus,
} from "lucide-react";

type ClientBooking = {
  id: string;
  workerId: string;
  workerName?: string | null;
  serviceId?: string | null;
  serviceRequested?: string | null;
  bookingDate: Date | string;
  bookingTime?: string | null;
  location?: string | null;
  notes?: string | null;
  totalHours?: number | null;
  status:
    | "PENDING"
    | "CONFIRMED"
    | "REJECTED"
    | "CANCELLED"
    | "COMPLETED"
    | "NO_SHOW";
  createdAt?: Date | string;
  service?: {
    title?: string | null;
  } | null;
};

function formatDate(date: Date | string) {
  const parsed = new Date(date);

  if (isNaN(parsed.getTime())) return "Date unavailable";

  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getStatusStyles(status: ClientBooking["status"]) {
  switch (status) {
    case "CONFIRMED":
      return {
        label: "Confirmed",
        className: "text-emerald-400 border-emerald-900/50 bg-emerald-950/20",
        icon: CheckCircle2,
      };

    case "COMPLETED":
      return {
        label: "Completed",
        className: "text-blue-400 border-blue-900/50 bg-blue-950/20",
        icon: CheckCircle2,
      };

    case "PENDING":
      return {
        label: "Pending",
        className: "text-amber-400 border-amber-900/50 bg-amber-950/20",
        icon: CircleEllipsis,
      };

    case "CANCELLED":
      return {
        label: "Cancelled",
        className: "text-red-400 border-red-900/50 bg-red-950/20",
        icon: XCircle,
      };

    case "REJECTED":
      return {
        label: "Rejected",
        className: "text-red-400 border-red-900/50 bg-red-950/20",
        icon: XCircle,
      };

    case "NO_SHOW":
      return {
        label: "No Show",
        className: "text-gray-400 border-gray-800 bg-gray-900/40",
        icon: XCircle,
      };

    default:
      return {
        label: status,
        className: "text-gray-400 border-gray-800 bg-gray-900/40",
        icon: Clock,
      };
  }
}

export default async function ClientDashboard({
  session,
}: {
  session: Session | null;
}) {
  const user = session?.user;

  if (!user?.id) {
    return (
      <div className="min-h-screen bg-[#050403] text-[#f0ebe0] flex items-center justify-center">
        <p className="text-sm text-[#a89880]">
          Please sign in to view your dashboard.
        </p>
      </div>
    );
  }

  // Get bookings belonging to the logged-in client
  const result = await getClientBookings(user.id);

  const bookings = (result?.data ?? []) as ClientBooking[];

  // Dashboard statistics
  const totalBookings = bookings.length;

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "PENDING"
  ).length;

  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "CONFIRMED"
  ).length;

  const completedBookings = bookings.filter(
    (booking) => booking.status === "COMPLETED"
  ).length;

  // Unique service providers
  const uniqueWorkers = new Map<string, ClientBooking>();

  bookings.forEach((booking) => {
    if (booking.workerId && !uniqueWorkers.has(booking.workerId)) {
      uniqueWorkers.set(booking.workerId, booking);
    }
  });

  const workers = Array.from(uniqueWorkers.values());

  // Most recent bookings
  const recentBookings = [...bookings]
    .sort(
      (a, b) =>
        new Date(b.createdAt ?? b.bookingDate).getTime() -
        new Date(a.createdAt ?? a.bookingDate).getTime()
    )
    .slice(0, 5);

  // Most recently contacted providers
  const recentWorkers = workers.slice(0, 5);

  const stats = [
    {
      label: "Total Bookings",
      value: totalBookings,
      description: "All your bookings",
      icon: CalendarDays,
    },
    {
      label: "Pending",
      value: pendingBookings,
      description: "Awaiting confirmation",
      icon: Clock,
    },
    {
      label: "Confirmed",
      value: confirmedBookings,
      description: "Upcoming appointments",
      icon: CalendarCheck,
    },
    {
      label: "Completed",
      value: completedBookings,
      description: "Successfully completed",
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="min-h-screen bg-[#050403] text-[#f0ebe0] px-4 py-6 md:px-8 md:py-8">

      {/* Header */}
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-8">

          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#b8924a] mb-2">
              Client Dashboard
            </p>

            <h1 className="font-serif text-3xl md:text-4xl font-light">
              Welcome back,{" "}
              <span className="italic text-[#d4af71]">
                {user.name?.split(" ")[0] || "there"}
              </span>
            </h1>

            <p className="text-sm text-[#8b7b65] mt-2">
              Manage your bookings and discover available services.
            </p>
          </div>

          <Link
            href="/search"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#b8924a] text-[#050403] text-xs uppercase tracking-[0.15em] hover:bg-[#d4af71] transition-colors"
          >
            <Search size={15} />
            Find Services
            <ArrowRight size={14} />
          </Link>

        </div>

        {/* Search Banner */}
        <div className="relative overflow-hidden border border-[#2a2318] bg-[#100e0b] p-6 md:p-8 mb-8">

          <div className="absolute right-0 top-0 w-48 h-48 rounded-full bg-[#b8924a]/5 blur-3xl" />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-5">

            <div>
              <div className="flex items-center gap-2 text-[#b8924a] mb-3">
                <Sparkles size={15} />
                <span className="text-[10px] uppercase tracking-[0.25em]">
                  Discover More
                </span>
              </div>

              <h2 className="font-serif text-2xl md:text-3xl font-light">
                Find the right service for you.
              </h2>

              <p className="text-sm text-[#8b7b65] mt-2 max-w-xl">
                Explore service providers, compare their services and
                book appointments that work for you.
              </p>
            </div>

            <Link
              href="/search"
              className="shrink-0 inline-flex items-center gap-2 border border-[#b8924a] px-5 py-3 text-[#d4af71] text-xs uppercase tracking-[0.15em] hover:bg-[#b8924a] hover:text-black transition-all"
            >
              Explore Services
              <ArrowRight size={14} />
            </Link>

          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mb-10">

          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="border border-[#2a2318] bg-[#100e0b] p-4 md:p-5"
              >
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[10px] uppercase tracking-[0.15em] text-[#8b7b65]">
                    {item.label}
                  </span>

                  <Icon size={18} className="text-[#b8924a]" />
                </div>

                <p className="font-serif text-3xl md:text-4xl text-[#f0ebe0]">
                  {item.value}
                </p>

                <p className="text-[11px] text-[#6b5e50] mt-2">
                  {item.description}
                </p>
              </div>
            );
          })}

        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recent Bookings */}
          <div className="lg:col-span-2 border border-[#2a2318] bg-[#100e0b]">

            <div className="flex items-center justify-between p-5 border-b border-[#2a2318]">

              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#b8924a] mb-1">
                  Your Activity
                </p>

                <h2 className="font-serif text-xl md:text-2xl">
                  Recent Bookings
                </h2>
              </div>

              <Link
                href="/dashboard/user/appointments"
                className="text-xs text-[#b8924a] hover:text-[#d4af71] flex items-center gap-2"
              >
                View All
                <ArrowRight size={13} />
              </Link>

            </div>

            <div className="p-4 md:p-5">

              {recentBookings.length === 0 ? (
                <div className="py-12 text-center">

                  <CalendarDays
                    size={30}
                    className="mx-auto text-[#7a5f32] mb-4"
                  />

                  <h3 className="font-serif text-xl mb-2">
                    No bookings yet
                  </h3>

                  <p className="text-xs text-[#8b7b65] mb-5">
                    Your bookings will appear here once you book a service.
                  </p>

                  <Link
                    href="/search"
                    className="inline-flex items-center gap-2 text-xs text-[#d4af71] hover:text-white"
                  >
                    Find a Service
                    <ArrowRight size={13} />
                  </Link>

                </div>
              ) : (
                <div className="space-y-3">

                  {recentBookings.map((booking) => {
                    const status = getStatusStyles(booking.status);
                    const StatusIcon = status.icon;

                    return (
                      <div
                        key={booking.id}
                        className="border border-[#2a2318] bg-[#0c0a08] p-4 hover:border-[#7a5f32] transition-colors"
                      >

                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">

                          <div>
                            <h3 className="font-serif text-lg">
                              {booking.service?.title ||
                                booking.serviceRequested ||
                                "Service Booking"}
                            </h3>

                            <p className="text-xs text-[#8b7b65] mt-1">
                              With{" "}
                              {booking.workerName || "Service Provider"}
                            </p>
                          </div>

                          <span
                            className={`inline-flex items-center gap-1.5 self-start border px-2.5 py-1 text-[10px] uppercase tracking-wider ${status.className}`}
                          >
                            <StatusIcon size={12} />
                            {status.label}
                          </span>

                        </div>

                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-xs text-[#a89880]">

                          <span className="flex items-center gap-2">
                            <CalendarDays size={14} className="text-[#b8924a]" />
                            {formatDate(booking.bookingDate)}
                          </span>

                          {booking.bookingTime && (
                            <span className="flex items-center gap-2">
                              <Clock size={14} className="text-[#b8924a]" />
                              {booking.bookingTime}
                            </span>
                          )}

                          {booking.location && (
                            <span className="flex items-center gap-2">
                              <MapPin size={14} className="text-[#b8924a]" />
                              {booking.location}
                            </span>
                          )}

                        </div>

                      </div>
                    );
                  })}

                </div>
              )}

            </div>
          </div>

          {/* Recent Service Providers */}
          <div className="border border-[#2a2318] bg-[#100e0b]">

            <div className="flex items-center justify-between p-5 border-b border-[#2a2318]">

              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#b8924a] mb-1">
                  Your Connections
                </p>

                <h2 className="font-serif text-xl md:text-2xl">
                  Providers
                </h2>
              </div>

              <Users size={18} className="text-[#b8924a]" />

            </div>

            <div className="p-4 md:p-5">

              {recentWorkers.length === 0 ? (
                <div className="py-10 text-center">

                  <BriefcaseBusiness
                    size={28}
                    className="mx-auto text-[#7a5f32] mb-4"
                  />

                  <h3 className="font-serif text-lg mb-2">
                    No providers yet
                  </h3>

                  <p className="text-xs text-[#8b7b65] mb-5">
                    Service providers you book will appear here.
                  </p>

                  <Link
                    href="/search"
                    className="text-xs text-[#d4af71] hover:text-white"
                  >
                    Browse Providers
                  </Link>

                </div>
              ) : (
                <div className="space-y-3">

                  {recentWorkers.map((worker) => {
                    const name = worker.workerName || "Service Provider";
                    const slug = generateSlug(name);

                    return (
                      <Link
                        key={worker.workerId}
                        href={`/workers/${slug}?id=${worker.workerId}`}
                        className="flex items-center justify-between gap-3 border border-[#2a2318] bg-[#0c0a08] p-3 hover:border-[#b8924a] transition-colors group"
                      >

                        <div className="min-w-0">
                          <p className="text-sm text-[#f0ebe0] truncate group-hover:text-[#d4af71] transition-colors">
                            {name}
                          </p>

                          <p className="text-[10px] text-[#6b5e50] mt-1">
                            Service Provider
                          </p>
                        </div>

                        <ArrowRight
                          size={15}
                          className="shrink-0 text-[#7a5f32] group-hover:text-[#d4af71]"
                        />

                      </Link>
                    );
                  })}

                </div>
              )}

              <Link
                href="/search"
                className="mt-5 flex items-center justify-center gap-2 border border-[#2a2318] py-3 text-xs uppercase tracking-[0.15em] text-[#b8924a] hover:border-[#b8924a] transition-colors"
              >
                <Plus size={14} />
                Find More Providers
              </Link>

            </div>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="mt-8 border-t border-[#2a2318] pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">

          <p className="text-[10px] text-[#6b5e50] uppercase tracking-[0.15em]">
            Touchline — Your Services, Your Choice.
          </p>

          <Link
            href="/search"
            className="text-xs text-[#b8924a] hover:text-[#d4af71] flex items-center gap-2"
          >
            Discover Services
            <ArrowRight size={13} />
          </Link>

        </div>

      </div>
    </div>
  );
}
