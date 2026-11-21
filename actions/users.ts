
"use server";

import { prismaClient } from "@/lib/db";
import { RegisterInputProps } from "@/types/types";
import generateSlug from "@/utils/generateSlug";
import bcrypt from "bcrypt";
import {
  createWorkerProfile,
  createClientProfile,
} from "./onboarding";
import { generateTrackingNumber } from "@/lib/generateTracking";

export async function createUser(formData: RegisterInputProps) {
  const { fullName, phone, role, password, plan } = formData;

  try {
    // Validate registration fields
    if (!fullName?.trim() || !phone?.trim() || !password) {
      return {
        data: null,
        error: "All fields are required.",
        status: 400,
      };
    }

    if (password.length < 8) {
      return {
        data: null,
        error: "Password must be at least 8 characters.",
        status: 400,
      };
    }

    // Normalize phone number
    const normalizedPhone = phone.trim().replace(/\s+/g, "");

    // Check existing phone number
    const existingUser = await prismaClient.user.findUnique({
      where: { phone: normalizedPhone },
    });

    if (existingUser) {
      return {
        data: null,
        error: "An account with this phone number already exists.",
        status: 409,
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await prismaClient.user.create({
      data: {
        name: fullName.trim(),
        slug: generateSlug(fullName),
        phone: normalizedPhone,
        password: hashedPassword,
        role: role as any,
        
        isVerified: true,
        token: 0,
      },
    });

    // Create worker profile
    if (role === "WORKER") {
      await createWorkerProfile({
        firstName: fullName.trim().split(/\s+/)[0] || "",
        lastName: fullName.trim().split(/\s+/).slice(1).join(" "),
        trackingNumber: generateTrackingNumber(),
        userId: newUser.id,
        // phone: normalizedPhone,
      });
    }

    // Create client profile
    if (role === "CLIENT") {
      const result = await createClientProfile({
        name: fullName.trim(),
        userId: newUser.id,
        phone: normalizedPhone,
        trackingNumber: generateTrackingNumber(),
      });

      if (result?.error) {
        throw new Error(result.error);
      }
    }

    return {
      data: {
        id: newUser.id,
        name: newUser.name,
        phone: newUser.phone,
        role: newUser.role,
      },
      error: null,
      status: 200,
    };

  } catch (error) {
    console.error("createUser error:", error);

    return {
      data: null,
      error: "Something went wrong during registration.",
      status: 500,
    };
  }
}


function withLegacyWorkerProfile<T extends { workerProfile?: any }>(worker: T) {
  return {
    ...worker,
    doctorProfile: worker.workerProfile,
    WorkerProfile: worker.workerProfile,
  };
}



/* -------------------------------------------------------
   VERIFY USER (kept for backwards compatibility)
------------------------------------------------------- */
export async function updateUserById(id: string) {
  if (!id) return null;
  try {
    return await prismaClient.user.update({
      where: { id },
      data: { isVerified: true },
    });
  } catch (error) {
    console.error(error);
    return null;
  }
}

/* -------------------------------------------------------
   GET USER
------------------------------------------------------- */
export async function getUserById(id: string) {
  if (!id) return null;
  try {
    return await prismaClient.user.findUnique({ where: { id } });
  } catch (error) {
    console.error(error);
    return null;
  }
}

/* -------------------------------------------------------
   UPDATE WORKER STATUS
------------------------------------------------------- */
export async function updateWorkerStatus(
  profileId: string,
  status: "PENDING" | "APPROVED" | "REJECTED"
) {
  try {
    if (!profileId) {
      return { error: "Profile ID is required", status: 400, data: null };
    }

    const updated = await prismaClient.workerProfile.update({
      where: { id: profileId },
      data: { status },
    });

    return { data: updated, error: null, status: 200 };
  } catch (error) {
    console.error("updateWorkerStatus error:", error);
    return { data: null, error: "Failed to update worker status", status: 500 };
  }
}

/* -------------------------------------------------------
   GET WORKERS (APPROVED ONLY)
------------------------------------------------------- */
export async function getWorkers(): Promise<any> {
  try {
    const workers = await prismaClient.user.findMany({
      where: {
        role: "WORKER",
        workerProfile: { status: "APPROVED" },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        // phone: true,
        workerProfile: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            gender: true,
            bio: true,
            profilePicture: true,
            specialties: true,
            status: true,
            city: true,
            availability: {
              select: {
                monday: true,
                tuesday: true,
                wednesday: true,
                thursday: true,
                friday: true,
                saturday: true,
                sunday: true,
              },
            },
          },
        },
      },
    });
    return workers.map(withLegacyWorkerProfile);
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getClientsAdmin() {
  try {
    return await prismaClient.user.findMany({
      where: {
        role: "CLIENT",
      },
      include: {
        clientProfile: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("Error fetching clients:", error);
    return [];
  }
}

export async function getWorkersAdmin() {
  try {
    const workers = await prismaClient.user.findMany({
      where: {
        role: "WORKER",
      },
      select: {
        id: true,
        name: true,
        slug: true,
        workerProfile: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            gender: true,
            bio: true,
            profilePicture: true,
            specialties: true,
            status: true,
            city: true,
            availability: {
              select: {
                monday: true,
                tuesday: true,
                wednesday: true,
                thursday: true,
                friday: true,
                saturday: true,
                sunday: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return workers.map(withLegacyWorkerProfile);
  } catch (error) {
    console.error("Error fetching workers:", error);
    return [];
  }
}

/* -------------------------------------------------------
   GET WORKER BY SLUG
------------------------------------------------------- */
export async function getWorkerBySlug(slug: string): Promise<any> {
  if (!slug) return null;
  try {
    const worker = await prismaClient.user.findFirst({
      where: { role: "WORKER", slug },
      select: {
        id: true,
        name: true,
        slug: true,
        workerProfile: {
          select: {
            firstName: true,
            lastName: true,
            gender: true,
            bio: true,
            profilePicture: true,
            // age: true,
            city: true,
            availability: {
              select: {
                monday: true,
                tuesday: true,
                wednesday: true,
                thursday: true,
                friday: true,
                saturday: true,
                sunday: true,
              },
            },
          },
        },
      },
    });
    return worker ? withLegacyWorkerProfile(worker) : null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

/* -------------------------------------------------------
   GET WORKER BY ID — COMPLETE USER + WORKER PROFILE
------------------------------------------------------- */
export async function getWorkerById(id: string): Promise<any> {
  if (!id) return null;

  try {
    const worker = await prismaClient.user.findFirst({
      where: {
        id,
        role: "WORKER",
      },
      select: {
        id: true,
        name: true,
        phone: true,
        slug: true,
        role: true,
        isVerified: true,
        createdAt: true,

        workerProfile: {
          include: {
            availability: true,
            services: {
              where: {
                isActive: true,
              },
              include: {
                service: true,
              },
            },
          },
        },
      },
    });

    return worker ? withLegacyWorkerProfile(worker) : null;
  } catch (error) {
    console.error("getWorkerById error:", error);
    return null;
  }
}

/* -------------------------------------------------------
   GET COMPLETE WORKER PROFILE BY USER ID
------------------------------------------------------- */
export async function getWorkerProfile(id: string): Promise<any> {
  if (!id) return null;

  try {
    return await prismaClient.workerProfile.findUnique({
      where: {
        userId: id,
      },
      include: {
        availability: true,
        services: {
          where: {
            isActive: true,
          },
          include: {
            service: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("getWorkerProfile error:", error);
    return null;
  }
}



/* -------------------------------------------------------
   LEGACY ALIASES
------------------------------------------------------- */
export const updateDoctorStatus = updateWorkerStatus;
export const getDoctors = getWorkers;
export const getDoctorsAdmin = getWorkersAdmin;
export const getDoctorById = getWorkerById;
export const getDoctorProfile = getWorkerProfile;