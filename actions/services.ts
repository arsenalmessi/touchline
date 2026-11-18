"use server";

import { prismaClient } from "@/lib/db";
import { ServiceProps } from "@/types/types";
import { revalidatePath } from "next/cache";

export async function createService(data: ServiceProps) {
  try {
    const existingService = await prismaClient.service.findUnique({
      where: {
        slug: data.slug,
      },
    });
    if (existingService) {
      return {
        data: null,
        status: 409,
        error: "Service already existing",
      };
    }
    const newService = await prismaClient.service.create({
      data,
    });
    revalidatePath("/dashboard/services");
    console.log(newService);
    return {
      data: newService,
      status: 201,
      error: null,
    };
  } catch (error) {
    console.log(error);
    return {
      data: null,
      status: 500,
      error,
    };
  }
}
export async function updateService(id: string, data: ServiceProps) {
  try {
    const existingService = await prismaClient.service.findUnique({
      where: {
        id,
      },
    });
    if (!existingService) {
      return {
        data: null,
        status: 404,
        error: "Service with that doest exist",
      };
    }
    const updatedService = await prismaClient.service.update({
      where: {
        id,
      },
      data,
    });
    revalidatePath("/dashboard/services");
    console.log(updatedService);
    return {
      data: updatedService,
      status: 201,
      error: null,
    };
  } catch (error) {
    console.log(error);
    return {
      data: null,
      status: 500,
      error,
    };
  }
}

export interface ServiceWithWorkerCount {
  id: string;
  title: string;
  slug: string;
  image?: string | null;
  _count: {
    workers: number;
  };
}

export async function getServices() {
  try {
    const services = await prismaClient.service.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        slug: true,
        image: true,
        isActive: true,
        _count: {
          select: {
            workers: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      data: services,
      status: 200,
      error: null,
    };
  } catch (error) {
    console.error("Error fetching services:", error);

    return {
      data: null,
      status: 500,
      error: "Failed to fetch services.",
    };
  }
}

export async function getServiceBySlug(slug: string) {
  try {
    if (slug) {
      const service = await prismaClient.service.findUnique({
        where: {
          slug,
        },
      });
      return {
        data: service,
        status: 200,
        error: null,
      };
    }
  } catch (error) {
    console.log(error);
    return {
      data: null,
      status: 500,
      error,
    };
  }
}
export async function deleteService(id: string) {
  try {
    await prismaClient.service.delete({
      where: {
        id,
      },
    });
    revalidatePath("/dashboard/services");
    return {
      ok: true,
      status: 200,
      error: null,
    };
  } catch (error) {
    console.log(error);
    return {
      data: null,
      status: 500,
      error,
    };
  }
}

export async function updateDoctorProfileWithService(
  id: string | undefined,
  data: any
) {
  if (id) {
    try {
      const updatedProfile = await prismaClient.workerProfile.update({
        where: {
          id,
        },
        data,
      });
      console.log(updatedProfile);
      revalidatePath("/dashboard/doctor/settings");
      return {
        data: updatedProfile,
        status: 201,
        error: null,
      };
    } catch (error) {
      console.log(error);
      return {
        data: null,
        status: 500,
        error: "Profile was not updated",
      };
    }
  }
}
