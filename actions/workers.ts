
"use server";

import { prismaClient } from "@/lib/db";

export interface WorkerSearchFilters {
  gender?: string;
  minAge?: number;
  maxAge?: number;
  minExperience?: number;
  minPrice?: number;
  maxPrice?: number;
  country?: string
}

export async function getworkersBySearch(
  city?: string,
  specialization?: string,
  filters: WorkerSearchFilters = {}
) {
  try {
    const citySearch = city?.trim();

    const specializationSearch = specialization
      ?.trim()
      .toLowerCase()
      .replace(/-/g, " ");

    const {
      gender,
      country,
      minAge,
      maxAge,
      minExperience,
      minPrice,
      maxPrice,
    } = filters;

    const profiles =
      await prismaClient.workerProfile.findMany({
        where: {
          status: "APPROVED",
          isActive: true,

          ...(citySearch
            ? {
                city: {
                  contains: citySearch,
                  mode: "insensitive",
                },
              }
            : {}),
            ...(country
              ? {
                  country: {
                    equals: country,
                    mode: "insensitive",
                  },
                }
              : {}),

          ...(gender
            ? {
                gender: {
                  equals: gender,
                  mode: "insensitive",
                },
              }
            : {}),

            age: {
              gte: Math.max(18, minAge ?? 18),
              ...(maxAge !== undefined ? { lte: maxAge } : {}),
            },

          ...(minExperience !== undefined
            ? {
                yearsOfExperience: {
                  gte: minExperience,
                },
              }
            : {}),

          ...(minPrice !== undefined || maxPrice !== undefined
            ? {
                hourlyRate: {
                  ...(minPrice !== undefined
                    ? { gte: minPrice }
                    : {}),
                  ...(maxPrice !== undefined
                    ? { lte: maxPrice }
                    : {}),
                },
              }
            : {}),
        },

        include: {
          user: {
            select: {
              id: true,
              name: true,
              phone: true,
              image: true,
            },
          },

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

        orderBy: {
          createdAt: "desc",
        },
      });

    // Specialization filtering
    const filteredProfiles = specializationSearch
      ? profiles.filter((profile) =>
          profile.specialties.some((specialty) =>
            specialty
              .toLowerCase()
              .replace(/-/g, " ")
              .includes(specializationSearch)
          )
        )
      : profiles;

    // Format frontend workers
    const workers = filteredProfiles.map((profile) => {
      const { user, ...workerProfile } = profile;

      return {
        id: user.id,
        userId: profile.userId,

        name: `${profile.firstName} ${profile.lastName}`.trim(),

        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: user.phone || "",

        slug: profile.slug,

        image:
          profile.profilePicture ||
          user.image ||
          "",

        workerProfile,
      };
    });

    return {
      success: true,
      workers,
    };
  } catch (error) {
    console.error("GET WORKERS ERROR:", error);

    throw new Error("Failed to fetch workers.");
  }
}


/**
 * Get an approved worker by their WorkerProfile slug.
 */
export async function getWorkerBySlug(slug: string) {
  try {
    if (!slug?.trim()) {
      return {
        success: false,
        worker: null,
      };
    }

    const profile = await prismaClient.workerProfile.findFirst({
      where: {
        slug: slug.trim(),
        status: "APPROVED",
        isActive: true,
      },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            image: true,
          },
        },

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

    if (!profile || !profile.user) {
      return {
        success: false,
        worker: null,
      };
    }

    const { user, ...workerProfile } = profile;

    return {
      success: true,

      worker: {
        id: user.id,
        userId: profile.userId,

        slug: profile.slug,

        name: `${profile.firstName} ${profile.lastName}`.trim(),

        firstName: profile.firstName,
        lastName: profile.lastName,

        phone: user.phone || "",

        image: profile.profilePicture || user.image || "",

        workerProfile,
      },
    };
  } catch (error) {
    console.error("GET WORKER BY SLUG ERROR:", error);

    throw new Error("Failed to fetch worker details.");
  }
}
