
import { getClientBookings } from "@/actions/bookings";
import {
  AlertTriangle,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  User,
  UserRound,
  Briefcase,
  Hash,
  CheckCircle2,
  XCircle,
  CircleEllipsis,
} from "lucide-react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import SubHeading from "@/components/SubHeading";

function formatDate(date: Date | string | null | undefined) {
  if (!date) return "Not provided";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return String(date);
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function StatusBadge({ status }: { status: string }) {
  const normalizedStatus = status.toLowerCase();

  const config =
    normalizedStatus === "confirmed" || normalizedStatus === "approved"
      ? {
          icon: CheckCircle2,
          styles: "bg-green-500/10 text-green-400 border-green-500/20",
        }
      : normalizedStatus === "completed"
        ? {
            icon: CheckCircle2,
            styles: "bg-blue-500/10 text-blue-400 border-blue-500/20",
          }
        : normalizedStatus === "rejected" ||
            normalizedStatus === "cancelled"
          ? {
              icon: XCircle,
              styles: "bg-red-500/10 text-red-400 border-red-500/20",
            }
          : {
              icon: CircleEllipsis,
              styles: "bg-amber-500/10 text-amber-400 border-amber-500/20",
            };

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium capitalize ${config.styles}`}
    >
      <Icon size={14} />
      {status.toLowerCase().replaceAll("_", " ")}
    </span>
  );
}

function InfoItem({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value?: string | null;
  icon: React.ElementType;
}) {
  if (!value) return null;

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="mb-2 flex items-center gap-2 text-xs text-[#a7a095]">
        <Icon size={15} className="text-[#b8924a]" />
        {label}
      </div>

      <p className="break-words text-sm font-medium text-[#f0ebe0]">
        {value}
      </p>
    </div>
  );
}

export default async function ClientDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // id must be the client's User.id, because getClientBookings
  // looks up ClientProfile using its userId field.
  const result = await getClientBookings(id);

  const client = result.clientProfile;
  const bookings = result.data || [];

  if (result.status !== 200 || !client) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-6">
        <div className="max-w-md text-center">
          <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-amber-500" />

          <h2 className="text-xl font-semibold text-[#f0ebe0]">
            Client not found
          </h2>

          <p className="mt-2 text-sm text-[#a7a095]">
            This client profile could not be found or may have been removed.
          </p>
        </div>
      </div>
    );
  }

  const clientName = client.user?.name || "Unnamed client";

  // Get unique workers from the client's booking history.
  // Booking.workerId refers to WorkerProfile.id.
  const associatedWorkers = Array.from(
    new Map(
      bookings
        .filter((booking) => booking.workerId)
        .map((booking) => [
          booking.workerId,
          {
            id: booking.workerId,
            name: booking.workerName || "Unnamed worker",
          },
        ])
    ).values()
  );

  return (
    <div className="min-h-screen bg-[#050403] p-4 text-[#f0ebe0] sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Client header */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#100e0b]">
          <div className="border-b border-white/10 bg-gradient-to-r from-[#b8924a]/15 to-transparent p-6 sm:p-8">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-[#b8924a]/30 bg-[#b8924a]/10">
                  <UserRound className="h-8 w-8 text-[#b8924a]" />
                </div>

                <div className="min-w-0">
                  <p className="mb-1 text-xs font-medium uppercase tracking-[0.2em] text-[#b8924a]">
                    Client profile
                  </p>

                  <h1 className="break-words text-2xl font-semibold sm:text-3xl">
                    {clientName}
                  </h1>

             
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3">
                  <div className="flex items-center gap-2 text-xs text-[#a7a095]">
                    <Calendar size={14} />
                    Bookings
                  </div>

                  <p className="mt-1 text-2xl font-semibold">
                    {bookings.length.toString().padStart(2, "0")}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3">
                  <div className="flex items-center gap-2 text-xs text-[#a7a095]">
                    <Briefcase size={14} />
                    Workers
                  </div>

                  <p className="mt-1 text-2xl font-semibold">
                    {associatedWorkers.length.toString().padStart(2, "0")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="mb-6 flex h-auto w-full justify-start gap-2 overflow-x-auto rounded-xl border border-white/10 bg-white/[0.03] p-1">
                <TabsTrigger
                  value="details"
                  className="gap-2 rounded-lg px-4 py-2 data-[state=active]:bg-[#b8924a] data-[state=active]:text-black"
                >
                  <User size={15} />
                  Client details
                </TabsTrigger>

                <TabsTrigger
                  value="bookings"
                  className="gap-2 rounded-lg px-4 py-2 data-[state=active]:bg-[#b8924a] data-[state=active]:text-black"
                >
                  <Calendar size={15} />
                  Bookings ({bookings.length})
                </TabsTrigger>
              </TabsList>

              {/* Client profile details */}
              <TabsContent value="details" className="space-y-6">
                <div>
                  <SubHeading title="Personal information" />

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <InfoItem
                      label="Full name"
                      value={clientName}
                      icon={User}
                    />

                 

                    <InfoItem
                      label="Phone number"
                      value={client.phone}
                      icon={Phone}
                    />

                    <InfoItem
                      label="City"
                      value={client.city}
                      icon={MapPin}
                    />

                    <InfoItem
                      label="Tracking number"
                      value={client.trackingNumber}
                      icon={Hash}
                    />

                    <InfoItem
                      label="Account status"
                      value={client.status}
                      icon={CheckCircle2}
                    />
                  </div>
                </div>

                {client.bio && (
                  <div>
                    <SubHeading title="About client" />

                    <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                      <p className="whitespace-pre-wrap text-sm leading-7 text-[#c5beb2]">
                        {client.bio}
                      </p>
                    </div>
                  </div>
                )}

                {/* Associated workers */}
                <div>
                  <SubHeading title="Associated workers" />

                  {associatedWorkers.length > 0 ? (
                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {associatedWorkers.map((worker) => (
                        <div
                          key={worker.id}
                          className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#b8924a]/10">
                            <Briefcase
                              size={18}
                              className="text-[#b8924a]"
                            />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                              {worker.name}
                            </p>

                            <p className="text-xs text-[#a7a095]">
                              Associated worker
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-5 text-sm text-[#a7a095]">
                      This client has not booked any workers yet.
                    </p>
                  )}
                </div>
              </TabsContent>

              {/* Booking history */}
              <TabsContent value="bookings" className="space-y-4">
                <SubHeading title="Booking history" />

                {bookings.length > 0 ? (
                  <div className="space-y-3">
                    {bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:p-5"
                      >
                        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                          <div>
                            <h3 className="font-semibold text-[#f0ebe0]">
                              {booking.serviceRequested || "Service booking"}
                            </h3>

                            <p className="mt-1 text-sm text-[#a7a095]">
                              Worker: {booking.workerName || "Not specified"}
                            </p>
                          </div>

                          <StatusBadge status={String(booking.status)} />
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                          <InfoItem
                            label="Booking date"
                            value={formatDate(booking.bookingDate)}
                            icon={Calendar}
                          />

                          <InfoItem
                            label="Booking time"
                            value={booking.bookingTime}
                            icon={Clock}
                          />

                          <InfoItem
                            label="Location"
                            value={booking.location}
                            icon={MapPin}
                          />

                          <InfoItem
                            label="Duration"
                            value={
                              booking.totalHours != null
                                ? `${booking.totalHours} hours`
                                : null
                            }
                            icon={Clock}
                          />
                        </div>

                        {booking.notes && (
                          <div className="mt-4 rounded-lg border border-white/10 bg-black/20 p-3">
                            <p className="mb-1 text-xs font-medium text-[#b8924a]">
                              Booking notes
                            </p>

                            <p className="text-sm leading-6 text-[#c5beb2]">
                              {booking.notes}
                            </p>
                          </div>
                        )}

                        <p className="mt-4 text-xs text-[#777168]">
                          Created {formatDate(booking.createdAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-12 text-center">
                    <Calendar className="mx-auto mb-3 h-10 w-10 text-[#b8924a]" />

                    <h3 className="font-medium">No bookings yet</h3>

                    <p className="mt-1 text-sm text-[#a7a095]">
                      This client has not made any bookings.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
