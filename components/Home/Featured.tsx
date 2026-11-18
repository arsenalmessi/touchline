
import Link from "next/link";
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
      user: true,
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
  
    email: profile.user.email,
    phone: profile.user.phone,
  
    slug: profile.slug,
    image: profile.user.image,
  
    workerProfile: profile,
  }));

  return (
    <main className="min-h-screen bg-[#0d0b08]">

      <section className="px-8 pt-16 text-center relative overflow-hidden">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-16 h-px bg-[#2a2318]" />

          <span className="font-sans text-[10px] tracking-[0.25em] text-[#7a5f32] uppercase">
            The Artisans
          </span>

          <div className="w-16 h-px bg-[#2a2318]" />
        </div>

        <h1 className="font-serif text-xl md:text-3xl font-light text-[#f0ebe0] leading-none mb-4">
          Meet the Hands
          <br />
          <em className="italic text-[#b8924a] font-light">
            Behind the Magic
          </em>
        </h1>

    
      </section>



      <section className="px-6 md:px-8 pb-24">
        <div className="max-w-7xl mx-auto">

          {workers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {workers.map((worker) => (
                <WorkerCard
                  key={worker.id}
                  worker={worker}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 border border-[#2a2318]">
              <h3 className="font-serif text-2xl text-[#b8924a] mb-3">
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
