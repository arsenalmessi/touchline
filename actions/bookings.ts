
"use server";

import { prismaClient } from "@/lib/db";
import { BookingStatus, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

interface CreateBookingInput {
  workerProfileId: string;
  clientUserId: string;
  workerName?: string;
  firstName: string;
  lastName: string;
  phone: string;
  bookingDate: Date;
  bookingTime: string;
  serviceRequested: string;
  location: string;
  notes?: string | null;
  totalHours: number;
}

export async function createBooking(data: CreateBookingInput) {
  try {
    if (!data.workerProfileId || !data.clientUserId) {
      return {
        data: null,
        status: 400,
        error: "Worker and client information are required.",
      };
    }

    if (!data.bookingDate || !data.bookingTime) {
      return {
        data: null,
        status: 400,
        error: "A booking date and time are required.",
      };
    }

    if (!data.serviceRequested?.trim()) {
      return {
        data: null,
        status: 400,
        error: "Please specify the requested service.",
      };
    }

    // Resolve the logged-in user's ClientProfile.
    const clientProfile = await prismaClient.clientProfile.findUnique({
      where: {
        userId: data.clientUserId,
      },
    });

    if (!clientProfile) {
      return {
        data: null,
        status: 404,
        error: "Client profile not found. Please complete your client profile.",
      };
    }

    // Verify that the selected WorkerProfile exists.
    const workerProfile = await prismaClient.workerProfile.findUnique({
      where: {
        id: data.workerProfileId,
      },
    });

    if (!workerProfile) {
      return {
        data: null,
        status: 404,
        error: "The selected professional could not be found.",
      };
    }

    const booking = await prismaClient.booking.create({
      data: {
        workerId: workerProfile.id,
        clientId: clientProfile.id,

        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,

        bookingDate: data.bookingDate,
        bookingTime: data.bookingTime,

        serviceRequested: data.serviceRequested,
        location: data.location,
        notes: data.notes || null,

        totalHours: data.totalHours,
        status: BookingStatus.PENDING,
      },
    });

    revalidatePath("/dashboard/worker/bookings");
    revalidatePath("/dashboard/user/appointments");

    return {
      data: booking,
      status: 201,
      error: null,
    };
  } catch (error) {
    console.error("Error creating booking:", error);

    return {
      data: null,
      status: 500,
      error: "Unable to create booking. Please try again.",
    };
  }
}

// Update an existing booking.
export async function updateBooking(
  id: string,
  data: Prisma.BookingUncheckedUpdateInput
) {
  try {
    const updatedBooking = await prismaClient.booking.update({
      where: { id },
      data,
    });

    revalidatePath("/dashboard/worker/bookings");
    revalidatePath("/dashboard/user/appointments");

    return {
      data: updatedBooking,
      status: 200,
      error: null,
    };
  } catch (error) {
    console.error("Error updating booking:", error);

    return {
      data: null,
      status: 500,
      error: "Unable to update booking.",
    };
  }
}

// Update a booking by ID.
export async function updateBookingById(
  id: string,
  data: Prisma.BookingUncheckedUpdateInput
) {
  try {
    const updatedBooking = await prismaClient.booking.update({
      where: { id },
      data,
    });

    revalidatePath("/dashboard/worker/bookings");
    revalidatePath("/dashboard/user/appointments");

    return {
      data: updatedBooking,
      status: 200,
      error: null,
    };
  } catch (error) {
    console.error("Error updating booking:", error);

    return {
      data: null,
      status: 500,
      error: "Unable to update booking.",
    };
  }
}

// Update booking status.
export async function updateBookingStatus(
  id: string,
  status: BookingStatus
) {
  try {
    const updatedBooking = await prismaClient.booking.update({
      where: { id },
      data: { status },
    });

    revalidatePath(`/dashboard/worker/bookings/view/${id}`);
    revalidatePath("/dashboard/worker/bookings");
    revalidatePath("/dashboard/user/appointments");

    return {
      data: updatedBooking,
      status: 200,
      error: null,
    };
  } catch (error) {
    console.error("Error updating booking status:", error);

    return {
      data: null,
      status: 500,
      error: "Unable to update booking status.",
    };
  }
}

// Mark a booking as completed.
export async function updateBookingCompletion(
  id: string,
  isCompleted: boolean
) {
  try {
    const updatedBooking = await prismaClient.booking.update({
      where: { id },
      data: {
        status: isCompleted
          ? BookingStatus.COMPLETED
          : BookingStatus.CONFIRMED,
      },
    });

    revalidatePath("/dashboard/worker/bookings");
    revalidatePath(`/dashboard/worker/bookings/view/${id}`);

    return {
      data: updatedBooking,
      status: 200,
      error: null,
    };
  } catch (error) {
    console.error("Error updating booking completion:", error);

    return {
      data: null,
      status: 500,
      error: "Unable to update booking completion.",
    };
  }
}

// Get all bookings.
export async function getBookings() {
  try {
    const bookings = await prismaClient.booking.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      data: bookings,
      status: 200,
      error: null,
    };
  } catch (error) {
    console.error("Error fetching bookings:", error);

    return {
      data: [],
      status: 500,
      error: "Unable to fetch bookings.",
    };
  }
}

// Get bookings for a client.
// Accepts the logged-in User ID and resolves its ClientProfile.
export async function getClientBookings(clientUserId: string) {
  try {
    const clientProfile = await prismaClient.clientProfile.findUnique({
      where: {
        userId: clientUserId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    if (!clientProfile) {
      return {
        clientProfile: null,
        data: [],
        status: 200,
        error: null,
      };
    }

    const bookings = await prismaClient.booking.findMany({
      where: {
        clientId: clientProfile.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      clientProfile,
      data: bookings,
      status: 200,
      error: null,
    };
  } catch (error) {
    console.error("Error fetching client bookings:", error);

    return {
      clientProfile: null,
      data: [],
      status: 500,
      error: "Unable to fetch client bookings.",
    };
  }
}

// Get a booking for a client.
export async function getBookingByClientId(clientUserId: string | undefined) {
  if (!clientUserId) return null;

  try {
    const clientProfile = await prismaClient.clientProfile.findUnique({
      where: {
        userId: clientUserId,
      },
    });

    if (!clientProfile) return null;

    return await prismaClient.booking.findFirst({
      where: {
        clientId: clientProfile.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("Error fetching client booking:", error);
    return null;
  }
}

// Get bookings for a worker.
// workerId must be the WorkerProfile ID.
export async function getWorkerBookings(workerId: string) {
  try {
    const bookings = await prismaClient.booking.findMany({
      where: {
        workerId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      data: bookings,
      status: 200,
      error: null,
    };
  } catch (error) {
    console.error("Error fetching worker bookings:", error);

    return {
      data: [],
      status: 500,
      error: "Unable to fetch worker bookings.",
    };
  }
}

// Get booking by ID.
export async function getBookingById(id: string) {
  try {
    if (!id) return null;

    return await prismaClient.booking.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error("Error fetching booking:", error);
    return null;
  }
}

// Delete booking.
export async function deleteBooking(id: string) {
  try {
    await prismaClient.booking.delete({
      where: { id },
    });

    revalidatePath("/dashboard/worker/bookings");
    revalidatePath("/dashboard/user/appointments");

    return {
      ok: true,
      status: 200,
      error: null,
    };
  } catch (error) {
    console.error("Error deleting booking:", error);

    return {
      ok: false,
      status: 500,
      error: "Unable to delete booking.",
    };
  }
}
