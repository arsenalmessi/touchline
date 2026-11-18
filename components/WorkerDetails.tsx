
"use client";

import React, { useEffect, useState } from "react";
import type { WorkerProfile as PrismaWorkerProfile } from "@prisma/client";
import { BookingStatus } from "@prisma/client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2, MoveRight, CalendarDays, Clock } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

import { getLongDate } from "@/utils/getLongDate";
import { createBooking } from "@/actions/bookings";

import type { WorkerDetail } from "@/types/types";

interface WorkerDetailsProps {
  doctor?: WorkerDetail | null;
  Booking?: any;
  WorkerProfile?: PrismaWorkerProfile | null;
}

interface BookingFormValues {
  firstName: string;
  lastName: string;
  phone: string;
  location: string;
  serviceRequested: string;
  notes?: string;
}

export default function WorkerDetails({
  doctor,
  WorkerProfile,
}: WorkerDetailsProps) {
  const [isActive, setIsActive] = useState("availability");
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());

  const { data: session, status } = useSession();
  const client = session?.user;
  const router = useRouter();

  // Resolve the worker profile.
  const workerProfile = doctor?.workerProfile ?? WorkerProfile ?? null;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookingFormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      location: "",
      serviceRequested: "",
      notes: "",
    },
  });

  // Populate client information from the session.
  useEffect(() => {
    if (!client) return;

    const nameParts = (client.name ?? "").trim().split(/\s+/);

    reset({
      firstName: nameParts[0] ?? "",
      lastName: nameParts.slice(1).join(" "),
      phone: "",
      location: "",
      serviceRequested: "",
      notes: "",
    });
  }, [client, reset]);

  // Authorization.
  const isAuthorized =
    !!client &&
    ["CLIENT", "ADMIN"].includes(client.role as string);

  // Reset selected slots when date changes.
  useEffect(() => {
    setSelectedTimes([]);
  }, [date]);




  // Convert time strings into minutes.
  const convertTimeToMinutes = (time: string): number => {
    const normalized = time.trim().toLowerCase();

    const match = normalized.match(
      /^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/
    );

    if (!match) return 0;

    let hours = Number(match[1]);
    const minutes = Number(match[2] ?? 0);
    const period = match[3];

    if (period === "pm" && hours !== 12) {
      hours += 12;
    } else if (period === "am" && hours === 12) {
      hours = 0;
    }

    return hours * 60 + minutes;
  };

  // Ensure selected hours are consecutive.
  const areTimesConsecutive = (
    currentTimes: string[],
    newTime: string
  ): boolean => {
    if (currentTimes.length === 0) return true;

    const sorted = [...currentTimes].sort(
      (a, b) =>
        convertTimeToMinutes(a) -
        convertTimeToMinutes(b)
    );

    const newMinutes = convertTimeToMinutes(newTime);
    const earliest = convertTimeToMinutes(sorted[0]);
    const latest = convertTimeToMinutes(
      sorted[sorted.length - 1]
    );

    return (
      Math.abs(newMinutes - earliest) === 60 ||
      Math.abs(newMinutes - latest) === 60
    );
  };

  // Handle time slot selection.
  const handleTimeSelection = (time: string) => {
    if (selectedTimes.includes(time)) {
      const remaining = selectedTimes.filter(
        (item) => item !== time
      );

      const sorted = [...remaining].sort(
        (a, b) =>
          convertTimeToMinutes(a) -
          convertTimeToMinutes(b)
      );

      const allConsecutive = sorted.every(
        (item, index) =>
          index === 0 ||
          convertTimeToMinutes(item) -
            convertTimeToMinutes(sorted[index - 1]) === 60
      );

      if (allConsecutive) {
        setSelectedTimes(sorted);
      } else {
        toast.error(
          "Removing this time would break consecutive selection"
        );
      }

      return;
    }

    if (!areTimesConsecutive(selectedTimes, time)) {
      toast.error("Please select consecutive time slots");
      return;
    }

    setSelectedTimes(
      [...selectedTimes, time].sort(
        (a, b) =>
          convertTimeToMinutes(a) -
          convertTimeToMinutes(b)
      )
    );
  };

  // Submit booking.
  async function onSubmit(data: BookingFormValues) {
    if (!client?.id) {
      toast.error("Please log in before booking.");
      return;
    }

    if (!date) {
      toast.error("Please select a booking date.");
      return;
    }

    if (selectedTimes.length === 0) {
      toast.error("Please select at least one time slot.");
      return;
    }

    if (!doctor || !workerProfile) {
      toast.error("Worker profile could not be found.");
      return;
    }

    if (!data.serviceRequested.trim()) {
      toast.error("Please enter the service you require.");
      return;
    }

    const bookingData = {
      workerProfileId: workerProfile.id,
      clientUserId: client.id,
      workerName: doctor.name,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      bookingDate: date,
      bookingTime: selectedTimes.join(", "),
      serviceRequested: data.serviceRequested.trim(),
      location: data.location,
      notes: data.notes?.trim() || null,
      totalHours: selectedTimes.length,
    };

    try {
      setLoading(true);

      const result = await createBooking(bookingData);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Booking request submitted successfully!");

      router.push("/dashboard/user/appointments");
      router.refresh();
    } catch (error) {
      console.error("Booking error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to create booking."
      );
    } finally {
      setLoading(false);
    }
  }

  // Loading state.
  if (status === "loading") {
    return (
      <div className="flex min-h-[400px] items-center justify-center bg-[#050403]">
        <Loader2 className="h-6 w-6 animate-spin text-[#b8924a]" />
      </div>
    );
  }

  // Missing worker.
  if (!doctor || !workerProfile) {
    return (
      <div className="flex min-h-[300px] items-center justify-center bg-[#050403]">
        <p className="text-sm text-[#b8924a]">
          Worker information could not be loaded.
        </p>
      </div>
    );
  }

  // Unauthorized users.
  if (!isAuthorized) {
    return (
      <div className="relative border border-[#2a2318] bg-[#100e0b] p-10 text-center">
        <div
          className="absolute left-0 right-0 top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, #b8924a, transparent)",
          }}
        />

        <div className="mb-4 select-none text-3xl opacity-20">
          ✦
        </div>

        <div className="mx-auto mb-6 h-px w-8 bg-[#2a2318]" />

        <h2 className="mb-3 font-serif text-2xl font-light text-[#f0ebe0]">
          Members Only
        </h2>

        <p className="mx-auto mb-8 max-w-sm font-sans text-xs font-light leading-relaxed text-[#6b5e50]">
          Only registered clients can book sessions with our
          therapists. Create an account to begin your journey.
        </p>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/register"
            className="bg-[#b8924a] px-8 py-3 font-sans text-[10px] uppercase tracking-[0.25em] text-[#0d0b08] transition-colors duration-300 hover:bg-[#d4af71]"
          >
            Register Now
          </Link>

          <Link
            href="/login"
            className="border border-[#2a2318] px-8 py-3 font-sans text-[10px] uppercase tracking-[0.25em] text-[#7a5f32] transition-colors duration-300 hover:border-[#b8924a44] hover:text-[#b8924a]"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative border border-[#2a2318] bg-[#100e0b]">
      <div
        className="absolute left-0 right-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, #b8924a, transparent)",
        }}
      />

      {/* Tabs */}
      <div className="flex border-b border-[#1e1a14]">
        {["availability", "details"].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setIsActive(tab)}
            className={`flex-1 px-6 py-4 font-sans text-[10px] uppercase tracking-[0.25em] transition-all duration-300 ${
              isActive === tab
                ? "border-b border-[#b8924a] bg-[#b8924a08] text-[#b8924a]"
                : "text-[#4a3e30] hover:text-[#7a5f32]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

 
    </div>
  );
}
