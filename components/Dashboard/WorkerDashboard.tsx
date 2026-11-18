
import React from "react";
import Link from "next/link";
import { Session } from "next-auth";
import {
  CalendarDays,
  CalendarCheck,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  Settings,
  RefreshCcw,
  XCircle,
  CircleEllipsis,
  BriefcaseBusiness,
  TrendingUp,
} from "lucide-react";

import { getWorkerBookings } from "@/actions/bookings";
import { getDoctorProfileById } from "@/actions/onboarding";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

import { cn } from "@/lib/utils";
import { getInitials } from "@/utils/generateInitials";

type Props = {
  session: Session | null;
};

type BookingRecord = {
  id: string;
  clientId?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  location?: string | null;
  gender?: string | null;
  occupation?: string | null;
  bookingDate?: Date | string | null;
  bookingFormattedDate?: string | null;
  bookingTime?: string | null;
  appointmentFormattedDate?: string | null;
  appointmentTime?: string | null;
  status?: string | null;
  isCompleted?: boolean;
  createdAt: Date | string;
};

function normalizeStatus(status?: string | null) {
  return (status ?? "PENDING").toUpperCase();
}

function getStatusStyles(status?: string | null) {
  const normalized = normalizeStatus(status);

  if (
    ["APPROVED", "CONFIRMED", "PAID", "COMPLETED", "SUCCESS"].includes(
      normalized
    )
  ) {
    return {
      label: normalized,
      className:
        "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      icon: CheckCircle2,
    };
  }

  if (
    ["CANCELLED", "CANCELED", "REJECTED", "FAILED"].includes(normalized)
  ) {
    return {
      label: normalized,
      className:
        "bg-red-500/10 text-red-400 border-red-500/20",
      icon: XCircle,
    };
  }

  return {
    label: normalized,
    className:
      "bg-amber-500/10 text-[#D6AD65] border-amber-500/20",
    icon: CircleEllipsis,
  };
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: number;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <Card className="border-[#B8924A]/15 bg-[#100F0D] shadow-none transition-all duration-300 hover:border-[#B8924A]/40">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-[#A49C8C]">
              {title}
            </p>
            <h3 className="mt-2 text-3xl font-semibold tracking-tight text-[#F0EBE0]">
              {value}
            </h3>
            <p className="mt-1 text-xs text-[#777168]">
              {description}
            </p>
          </div>

          <div className="rounded-xl border border-[#B8924A]/20 bg-[#B8924A]/10 p-3">
            <Icon className="h-5 w-5 text-[#B8924A]" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function BookingStatus({ status }: { status?: string | null }) {
  const config = getStatusStyles(status);
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        config.className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}

export default async function WorkerDashboard({ session }: Props) {
  const user = session?.user;
  const workerId = user?.id;

  if (!workerId) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-[#050403] p-6">
        <Card className="w-full max-w-md border-[#B8924A]/20 bg-[#100F0D]">
          <CardContent className="p-8 text-center">
            <h2 className="text-lg font-semibold text-[#F0EBE0]">
              Authentication required
            </h2>
            <p className="mt-2 text-sm text-[#A49C8C]">
              Please sign in to access your worker dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const [bookingResponse, profileResponse] = await Promise.all([
    getWorkerBookings(workerId),
    getDoctorProfileById(workerId),
  ]);

  const bookings: BookingRecord[] = Array.isArray(bookingResponse?.data)
    ? bookingResponse.data
    : [];

  const workerProfile = profileResponse?.data;
  const workerStatus = workerProfile?.status ?? "PENDING";

  const sortedBookings = [...bookings].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
  );

  const totalBookings = bookings.length;

  const pendingBookings = bookings.filter(
    (booking) => normalizeStatus(booking.status) === "PENDING"
  ).length;

  const completedBookings = bookings.filter(
    (booking) => booking.isCompleted === true
  ).length;

  const activeBookings = bookings.filter(
    (booking) =>
      !booking.isCompleted &&
      !["CANCELLED", "CANCELED", "REJECTED", "FAILED"].includes(
        normalizeStatus(booking.status)
      )
  ).length;

  const clientsMap = new Map<string, BookingRecord>();

  for (const booking of sortedBookings) {
    const clientKey =
      booking.clientId || booking.email || booking.id;

    if (!clientsMap.has(clientKey)) {
      clientsMap.set(clientKey, booking);
    }
  }

  const clients = Array.from(clientsMap.values());
  const recentBookings = sortedBookings.slice(0, 5);
  const recentClients = clients.slice(0, 5);

  const getClientName = (booking: BookingRecord) => {
    const name = `${booking.firstName ?? ""} ${booking.lastName ?? ""}`.trim();
    return name || "Unknown Client";
  };

  const getBookingDate = (booking: BookingRecord) =>
    booking.bookingFormattedDate ||
    booking.appointmentFormattedDate ||
    (booking.bookingDate
      ? new Date(booking.bookingDate).toLocaleDateString()
      : "Date not set");

  const getBookingTime = (booking: BookingRecord) =>
    (
      booking.bookingTime ||
      booking.appointmentTime ||
      "Time not set"
    )
      .toString()
      .split(",")[0];

  const profileStatus = normalizeStatus(workerStatus);

  const profileStatusStyle =
    profileStatus === "APPROVED"
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      : profileStatus === "PENDING"
        ? "bg-amber-500/10 text-[#D6AD65] border-amber-500/20"
        : "bg-red-500/10 text-red-400 border-red-500/20";

  const panelClass =
    "border border-[#B8924A]/15 bg-[#100F0D] shadow-none";

  const headingClass = "font-semibold text-[#F0EBE0]";
  const mutedClass = "text-[#A49C8C]";

  return (
    <main className="min-h-screen bg-[#050403] px-4 py-6 text-[#F0EBE0] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Header */}
        <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.25em] text-[#B8924A]">
              Touchline / WORKSPACE
            </p>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#F0EBE0] sm:text-3xl">
              Welcome, {user.name || "Worker"}
            </h1>

            <p className={`mt-1 text-sm ${mutedClass}`}>
              Here's an overview of your bookings and clients.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold",
                profileStatusStyle
              )}
            >
              {profileStatus === "APPROVED" ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : profileStatus === "PENDING" ? (
                <RefreshCcw className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              Profile: {profileStatus}
            </span>

            <Button
              asChild
              variant="outline"
              className="gap-2 border-[#B8924A]/30 bg-transparent text-[#F0EBE0] hover:border-[#B8924A] hover:bg-[#B8924A]/10 hover:text-[#D6AD65]"
            >
              <Link href="/dashboard/worker/settings">
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </Button>
          </div>
        </section>

        {/* Availability */}
        <section className="flex flex-col gap-4 rounded-2xl border border-[#B8924A]/20 bg-gradient-to-r from-[#17130D] to-[#100F0D] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#B8924A]/20 bg-[#B8924A]/10">
              <CalendarDays className="h-5 w-5 text-[#B8924A]" />
            </div>

            <div>
              <h2 className="font-semibold text-[#F0EBE0]">
                Manage your availability
              </h2>
              <p className="mt-1 text-sm text-[#A49C8C]">
                Keep your available days and working hours updated so clients
                can book sessions with you.
              </p>
            </div>
          </div>

          <Button
            asChild
            className="shrink-0 bg-[#B8924A] text-[#050403] font-semibold hover:bg-[#C9A45F]"
          >
            <Link href="/dashboard/worker/settings">
              Update availability
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </section>

        {/* Analytics */}
        <section>
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B8924A]">
              Performance
            </p>
            <h2 className="mt-1 text-lg font-semibold text-[#F0EBE0]">
              Overview
            </h2>
            <p className="text-sm text-[#A49C8C]">
              Your booking activity at a glance.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Bookings"
              value={totalBookings}
              description="All bookings received"
              icon={CalendarCheck}
            />
            <StatCard
              title="Pending Bookings"
              value={pendingBookings}
              description="Awaiting a decision"
              icon={Clock}
            />
            <StatCard
              title="Active Bookings"
              value={activeBookings}
              description="Not completed or cancelled"
              icon={TrendingUp}
            />
            <StatCard
              title="Completed Bookings"
              value={completedBookings}
              description="Successfully completed"
              icon={CheckCircle2}
            />
          </div>
        </section>

        {/* Main Content */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">

          {/* Recent Bookings */}
          <Card className={cn(panelClass, "xl:col-span-2")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-base text-[#F0EBE0]">
                  Recent Bookings
                </CardTitle>
                <p className="mt-1 text-sm text-[#A49C8C]">
                  Your latest client bookings.
                </p>
              </div>

              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-[#B8924A]/30 bg-transparent text-[#F0EBE0] hover:bg-[#B8924A]/10 hover:text-[#D6AD65]"
              >
                <Link href="/dashboard/worker/bookings">
                  View all
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>

            <CardContent>
              {recentBookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full border border-[#B8924A]/20 bg-[#B8924A]/10 p-4">
                    <CalendarDays className="h-7 w-7 text-[#B8924A]" />
                  </div>

                  <h3 className="mt-4 font-semibold text-[#F0EBE0]">
                    No bookings yet
                  </h3>

                  <p className="mt-1 max-w-sm text-sm text-[#A49C8C]">
                    Your bookings will appear here when clients start
                    scheduling sessions with you.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentBookings.map((booking) => (
                    <Link
                      key={booking.id}
                      href={`/dashboard/worker/bookings/view/${booking.id}`}
                      className="block rounded-xl border border-[#B8924A]/10 bg-[#151310] p-4 transition-all hover:border-[#B8924A]/40 hover:bg-[#1A1712]"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-[#B8924A]/15 font-semibold text-[#D6AD65]">
                              {getInitials(getClientName(booking))}
                            </AvatarFallback>
                          </Avatar>

                          <div>
                            <p className="font-semibold text-[#F0EBE0]">
                              {getClientName(booking)}
                            </p>
                            <p className="text-xs text-[#A49C8C]">
                              {booking.email || "No email provided"}
                            </p>
                          </div>
                        </div>

                        <BookingStatus status={booking.status} />
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[#B8924A]/10 pt-3 text-xs text-[#A49C8C]">
                        <span className="flex items-center gap-2">
                          <CalendarCheck className="h-4 w-4 text-[#B8924A]" />
                          {getBookingDate(booking)}
                        </span>

                        <span className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-[#B8924A]" />
                          {getBookingTime(booking)}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Clients */}
          <Card className={panelClass}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-base text-[#F0EBE0]">
                  Recent Clients
                </CardTitle>
                <p className="mt-1 text-sm text-[#A49C8C]">
                  Your client directory.
                </p>
              </div>

              <Users className="h-5 w-5 text-[#B8924A]" />
            </CardHeader>

            <CardContent>
              {recentClients.length === 0 ? (
                <div className="py-10 text-center">
                  <Users className="mx-auto h-8 w-8 text-[#777168]" />
                  <p className="mt-3 text-sm font-medium text-[#F0EBE0]">
                    No clients yet
                  </p>
                  <p className="mt-1 text-xs text-[#A49C8C]">
                    Your clients will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {recentClients.map((client) => {
                    const name = getClientName(client);

                    return (
                      <div
                        key={client.clientId || client.email || client.id}
                        className="flex items-center gap-3"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-[#B8924A]/15 text-sm font-semibold text-[#D6AD65]">
                            {getInitials(name)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-[#F0EBE0]">
                            {name}
                          </p>
                          <p className="truncate text-xs text-[#A49C8C]">
                            {client.email || "No email provided"}
                          </p>
                        </div>

                        {client.clientId && (
                          <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className="shrink-0 border-[#B8924A]/30 bg-transparent text-[#D6AD65] hover:bg-[#B8924A]/10 hover:text-[#F0EBE0]"
                          >
                            <Link
                              href={`/dashboard/worker/clients/view/${client.clientId}`}
                            >
                              View
                            </Link>
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <Button
                asChild
                variant="ghost"
                className="mt-6 w-full justify-between text-[#B8924A] hover:bg-[#B8924A]/10 hover:text-[#D6AD65]"
              >
                <Link href="/dashboard/worker/clients">
                  View all clients
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Bottom Summary */}
        <Card className={panelClass}>
          <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg border border-[#B8924A]/20 bg-[#B8924A]/10 p-3">
                <BriefcaseBusiness className="h-5 w-5 text-[#B8924A]" />
              </div>

              <div>
                <p className="font-semibold text-[#F0EBE0]">
                  Your client network
                </p>
                <p className="text-sm text-[#A49C8C]">
                  You currently have {clients.length} unique{" "}
                  {clients.length === 1 ? "client" : "clients"}.
                </p>
              </div>
            </div>

            <Button
              asChild
              variant="outline"
              className="border-[#B8924A]/30 bg-transparent text-[#F0EBE0] hover:bg-[#B8924A]/10 hover:text-[#D6AD65]"
            >
              <Link href="/dashboard/worker/bookings">
                Manage bookings
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

      </div>
    </main>
  );
}
