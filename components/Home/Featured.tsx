
import { prismaClient } from "@/lib/db";
import WorkerCard from "@/components/WorkerCard";
import { Worker } from "@/types/types";

export const revalidate = 60;

export default async function Featured() {
  const profiles = await prismaClient.workerProfile.findMany({
    where: {
      isFeatured: true,
      isActive: true,
      status: "APPROVED",
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
      user: {
        select: {
          id: true,
          name: true,
          phone: true,
          image: true,
          slug: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const workers: Worker[] = profiles.map((profile) => ({
    id: profile.user.id,
    userId: profile.userId,
    name: profile.user.name,
    firstName: profile.firstName,
    lastName: profile.lastName,
    phone: profile.user.phone,
    slug: profile.slug,
    image: profile.user.image,
    workerProfile: profile,
  }));

  return (
    <main className="min-h-screen bg-[#0d0b08]">
      <section className="relative overflow-hidden px-8 pt-16 text-center">
        <div className="mb-6 flex items-center justify-center gap-4">
          <div className="h-px w-16 bg-[#2a2318]" />
          <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#7a5f32]">
            The Artisans
          </span>
          <div className="h-px w-16 bg-[#2a2318]" />
        </div>

        <h1 className="mb-4 font-serif text-xl font-light leading-none text-[#f0ebe0] md:text-3xl">
          Featured
          <br />
          <em className="font-light italic text-[#b8924a]">
            Professionals
          </em>
        </h1>
      </section>

      <section className="px-6 pb-24 md:px-8">
        <div className="mx-auto max-w-7xl">
          {workers.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {workers.map((worker) => (
                <WorkerCard key={worker.id} worker={worker} />
              ))}
            </div>
          ) : (
            <div className="border border-[#2a2318] py-24 text-center">
              <h3 className="mb-3 font-serif text-2xl text-[#b8924a]">
                Something Beautiful Is Coming
              </h3>
              <p className="text-sm text-[#6b5e50]">
                Our featured professionals will be available here soon.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
