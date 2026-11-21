
"use server";

import { prismaClient } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type CreateWorkerProfileData = {
  userId: string;
  firstName: string;
  lastName: string;
  gender?: string;
  trackingNumber: string;
  city?: string;
  country?: string;
};

type UpdateWorkerProfileData = {
  firstName?: string;
  lastName?: string;
  gender?: string | null;
  headline?: string | null;
  bio?: string | null;
  age?: number;
  specialties?: string[];
  languages?: string[];
  profilePicture?: string | null;
  coverImage?: string | null;
  gallery?: string[];
  mobileService?: boolean;
  studioService?: boolean;
  city?: string;
  country?: string;
  slug?: string;
};

/**
 * Create or retrieve an existing worker profile.
 */
export async function createWorkerProfile(
  formData: CreateWorkerProfileData
) {
  try {
    const {
      userId,
      firstName,
      lastName,
      gender,
      trackingNumber,
      city,
      country,
    } = formData;

    if (!userId || !firstName?.trim() || !lastName?.trim()) {
      return {
        data: null,
        status: 400,
        error: "First name, last name and user ID are required.",
      };
    }

    const user = await prismaClient.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return {
        data: null,
        status: 404,
        error: "User account not found.",
      };
    }

    const existingProfile =
      await prismaClient.workerProfile.findUnique({
        where: { userId },
      });

    // UPDATE existing profile
    if (existingProfile) {
      const updatedProfile =
        await prismaClient.workerProfile.update({
          where: { userId },
          data: {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            gender: gender?.trim() || null,
          },
        });

      return {
        data: updatedProfile,
        status: 200,
        error: null,
      };
    }

    // CREATE new profile
    const slugBase = `${firstName}-${lastName}-${userId.slice(-6)}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const profile = await prismaClient.workerProfile.create({
      data: {
        userId,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        gender: gender?.trim() || null,
        trackingNumber,
        slug: slugBase,
        city: city || "Bulawayo",
        country: country || "Zimbabwe",
      },
    });

    return {
      data: profile,
      status: 201,
      error: null,
    };
  } catch (error) {
    console.error("Create worker profile:", error);

    return {
      data: null,
      status: 500,
      error: "Unable to create worker profile.",
    };
  }
}

/**
 * Update worker personal and professional information.
 */

export async function updateWorkerProfile(
  id: string,
  formData: UpdateWorkerProfileData
) {
  if (!id) {
    return {
      data: null,
      status: 400,
      error: "Worker profile ID is required.",
    };
  }

  try {
    // Authenticate the current user
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const role = session?.user?.role;

    if (!userId) {
      return {
        data: null,
        status: 401,
        error: "Please sign in to update your profile.",
      };
    }

    if (role !== "WORKER") {
      return {
        data: null,
        status: 403,
        error: "Only workers can update worker profiles.",
      };
    }

    // Ensure this profile belongs to the authenticated worker
    const existingProfile =
      await prismaClient.workerProfile.findFirst({
        where: {
          id,
          userId,
        },
        select: {
          id: true,
        },
      });

    if (!existingProfile) {
      return {
        data: null,
        status: 404,
        error: "Worker profile not found.",
      };
    }

    // Validate gallery
    if (formData.gallery !== undefined) {
      if (!Array.isArray(formData.gallery)) {
        return {
          data: null,
          status: 400,
          error: "Invalid gallery format.",
        };
      }

      if (formData.gallery.length > 10) {
        return {
          data: null,
          status: 400,
          error: "Maximum of 10 gallery images allowed.",
        };
      }

      const validGallery = formData.gallery.every((url) => {
        try {
          const parsed = new URL(url);

          return (
            parsed.protocol === "https:" &&
            parsed.hostname === "ik.imagekit.io"
          );
        } catch {
          return false;
        }
      });

      if (!validGallery) {
        return {
          data: null,
          status: 400,
          error: "Gallery contains an invalid ImageKit URL.",
        };
      }
    }

    // Only update permitted fields
    const allowedFields: (keyof UpdateWorkerProfileData)[] = [
      "firstName",
      "lastName",
      "gender",
      "headline",
      "bio",
      "age",
      "specialties",
      "languages",
      "profilePicture",
      "coverImage",
      "gallery",
      "mobileService",
      "studioService",
      "city",
      "country",
      "slug",
    ];

    const updateData = Object.fromEntries(
      Object.entries(formData).filter(
        ([key, value]) =>
          allowedFields.includes(
            key as keyof UpdateWorkerProfileData
          ) && value !== undefined
      )
    );

    const profile = await prismaClient.workerProfile.update({
      where: {
        id: existingProfile.id,
      },
      data: updateData,
    });

    return {
      data: profile,
      status: 200,
      error: null,
    };
  } catch (error) {
    console.error("Update worker profile:", error);

    return {
      data: null,
      status: 500,
      error: "Unable to update worker profile.",
    };
  }
}


/**
 * Update email and phone on User,
 * and city/country on WorkerProfile.
 */
export async function updateWorkerContact(
  userId: string,
  workerProfileId: string,
  formData: {
    phone: string;
    city: string;
    country: string;
  }
) {
  if (!userId || !workerProfileId) {
    return {
      data: null,
      status: 400,
      error: "User and worker profile IDs are required.",
    };
  }

  try {
    const phone = formData.phone.trim();

    if ( !phone || !formData.city || !formData.country) {
      return {
        data: null,
        status: 400,
        error: "Please complete all contact information.",
      };
    }

    const result = await prismaClient.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id: userId },
        data: {
          phone,
        },
      });

      const profile = await tx.workerProfile.update({
        where: {
          id: workerProfileId,
          userId,
        },
        data: {
          city: formData.city.trim(),
          country: formData.country.trim(),
        },
      });

      return { user, profile };
    });

    return {
      data: result,
      status: 200,
      error: null,
    };
  } catch (error) {
    console.error("Update worker contact:", error);

    return {
      data: null,
      status: 500,
      error: "Unable to update contact information. Check whether the email or phone number is already registered.",
    };
  }
}

// Temporary backward-compatible aliases.
// Migrate old imports to the worker names.
export const createDoctorProfile = createWorkerProfile;
export const updateDoctorProfile = updateWorkerProfile;
export const getWorkerProfileById = getDoctorProfileById;


export async function createClientProfile(formData: any) {
  const {
    trackingNumber,
    userId,
    phone,
    city,
    bio,
  } = formData;

  try {
    if (!userId) {
      return {
        data: null,
        status: 400,
        error: "User ID is required",
      };
    }

    if (!trackingNumber) {
      return {
        data: null,
        status: 400,
        error: "Tracking number is required",
      };
    }

    const profileData = {
      trackingNumber,
      phone: phone || null,
      city: city || null,
      bio: bio || null,
    };

    const existingProfile =
      await prismaClient.clientProfile.findUnique({
        where: { userId },
      });

    if (existingProfile) {
      const updatedProfile =
        await prismaClient.clientProfile.update({
          where: { userId },
          data: profileData,
        });

      return {
        data: updatedProfile,
        status: 200,
        error: null,
      };
    }

    const newProfile =
      await prismaClient.clientProfile.create({
        data: {
          ...profileData,
          userId,
        },
      });

    return {
      data: newProfile,
      status: 201,
      error: null,
    };
  } catch (error) {
    console.error("Error creating client profile:", error);

    return {
      data: null,
      status: 500,
      error: "Failed to create client profile",
    };
  }
}


/**
 * Find a worker application using its tracking number.
 */
export async function getApplicationByTrack(
  trackingNumber: string
) {
  if (!trackingNumber) {
    return {
      data: null,
      status: 400,
      error: "Tracking number is required",
    };
  }

  try {
    const existingProfile =
      await prismaClient.workerProfile.findUnique({
        where: {
          trackingNumber,
        },
      });

    if (!existingProfile) {
      return {
        data: null,
        status: 404,
        error: "Wrong Tracking Number",
      };
    }

    return {
      data: existingProfile,
      status: 200,
      error: null,
    };
  } catch (error) {
    console.error("Error fetching application:", error);

    return {
      data: null,
      status: 500,
      error: "Something went wrong",
    };
  }
}

/**
 * Complete a worker profile.
 * No welcome email or email verification is required.
 */
export async function completeProfile(
  id: string | undefined,
  data: any
) {
  if (!id) {
    return {
      data: null,
      status: 400,
      error: "Profile ID is required",
    };
  }

  try {
    const existingProfile =
      await prismaClient.workerProfile.findUnique({
        where: {
          id,
        },
      });

    if (!existingProfile) {
      return {
        data: null,
        status: 404,
        error: "Profile Not Found",
      };
    }

    const updatedProfile =
      await prismaClient.workerProfile.update({
        where: {
          id,
        },
        data,
      });

    return {
      data: updatedProfile,
      status: 201,
      error: null,
    };
  } catch (error) {
    console.error("Error completing worker profile:", error);

    return {
      data: null,
      status: 500,
      error: "Profile was not updated",
    };
  }
}

/**
 * Get a worker profile by user ID.
 * Includes the worker's availability.
 */
export async function getDoctorProfileById(
  userId: string | undefined
) {
  if (!userId) {
    return {
      data: null,
      status: 400,
      error: "User ID is required",
    };
  }

  try {
    const profile =
      await prismaClient.workerProfile.findUnique({
        where: {
          userId,
        },
        include: {
          availability: true,
        },
      });

    return {
      data: profile,
      status: 200,
      error: null,
    };
  } catch (error) {
    console.error("Error fetching worker profile:", error);

    return {
      data: null,
      status: 500,
      error: "Profile was not fetched",
    };
  }
}

/**
 * Update availability by ID.
 */
export async function updateAvailabilityById(
  id: string | undefined,
  data: any
) {
  if (!id) {
    return {
      data: null,
      status: 400,
      error: "Availability ID is required",
    };
  }

  try {
    const updatedAva =
      await prismaClient.availability.update({
        where: {
          id,
        },
        data,
      });

    return {
      data: updatedAva,
      status: 201,
      error: null,
    };
  } catch (error) {
    console.error("Error updating availability:", error);

    return {
      data: null,
      status: 500,
      error: "Availability was not updated",
    };
  }
}

/**
 * Create availability for a worker.
 * Supports the legacy doctorProfileId field.
 */
export async function createAvailability(data: any) {
  try {
    const availabilityData = { ...data };

    if (
      availabilityData.doctorProfileId &&
      !availabilityData.workerProfileId
    ) {
      availabilityData.workerProfileId =
        availabilityData.doctorProfileId;

      delete availabilityData.doctorProfileId;
    }

    const newAvail =
      await prismaClient.availability.create({
        data: availabilityData,
      });

    return newAvail;
  } catch (error) {
    console.error("Error creating availability:", error);

    return {
      data: null,
      status: 500,
      error: "Something went wrong",
    };
  }
}


/**
 * Get active services for the worker onboarding form.
 */
export async function getActiveServices() {
  try {
    const services = await prismaClient.service.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        title: "asc",
      },
    });

    return {
      data: services,
      status: 200,
      error: null,
    };
  } catch (error) {
    console.error("Error fetching active services:", error);

    return {
      data: [],
      status: 500,
      error: "Unable to fetch available services.",
    };
  }
}

/**
 * Replace a worker's selected services.
 *
 * An empty serviceIds array clears the worker's existing selections.
 */
export async function updateWorkerServices(
  workerId: string,
  serviceIds: string[]
) {
  if (!workerId) {
    return {
      data: null,
      status: 400,
      error: "Worker profile ID is required.",
    };
  }

  if (!Array.isArray(serviceIds)) {
    return {
      data: null,
      status: 400,
      error: "Invalid services selection.",
    };
  }

  try {
    const uniqueServiceIds = [...new Set(serviceIds)];

    const result = await prismaClient.$transaction(async (tx) => {
      const worker = await tx.workerProfile.findUnique({
        where: { id: workerId },
        select: { id: true },
      });

      if (!worker) {
        throw new Error("Worker profile not found.");
      }

      const activeServices =
        uniqueServiceIds.length > 0
          ? await tx.service.findMany({
              where: {
                id: { in: uniqueServiceIds },
                isActive: true,
              },
              select: {
                id: true,
              },
            })
          : [];

      if (activeServices.length !== uniqueServiceIds.length) {
        throw new Error(
          "One or more selected services are unavailable."
        );
      }

      // Remove the previous selections.
      await tx.workerService.deleteMany({
        where: { workerId },
      });

      // Save the new selections.
      if (activeServices.length > 0) {
        await tx.workerService.createMany({
          data: activeServices.map((service) => ({
            workerId,
            serviceId: service.id,
            isActive: true,
          })),
        });
      }

      return activeServices;
    });

    return {
      data: result,
      status: 200,
      error: null,
    };
  } catch (error) {
    console.error("Error updating worker services:", error);

    return {
      data: null,
      status: 500,
      error:
        error instanceof Error
          ? error.message
          : "Unable to update worker services.",
    };
  }
}
