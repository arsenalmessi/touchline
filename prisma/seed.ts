import "dotenv/config";

import {
  PrismaClient,
  UserRole,
  ClientStatus,
  WorkerStatus,
} from "@prisma/client";

import { hash } from "bcrypt";

const prisma = new PrismaClient();
  
  async function main() {
    const passwordHash = await hash("Touchline@123", 10);
  
    // =====================================
    // CREATE ADMIN
    // =====================================
  
    const admin = await prisma.user.upsert({
      where: { email: "admin@touchline.com" },
      update: {
        name: "Touchline Admin",
        role: UserRole.ADMIN,
        password: passwordHash,
      },
      create: {
        name: "Touchline Admin",
        email: "admin@touchline.com",
        password: passwordHash,
        role: UserRole.ADMIN,
        slug: "touchline-admin",
        phone: "+263771000001",
        isVerified: true,
      },
    });
  
    console.log("Admin created:", admin.email);
  
    // =====================================
    // CREATE CLIENTS
    // =====================================
  
    const clients = [
      {
        name: "John Doe",
        email: "john@example.com",
        phone: "+263771000002",
        slug: "john-doe",
        trackingNumber: "CLI100001",
        city: "Harare",
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "+263771000003",
        slug: "jane-smith",
        trackingNumber: "CLI100002",
        city: "Bulawayo",
      },
      {
        name: "Michael Johnson",
        email: "michael@example.com",
        phone: "+263771000004",
        slug: "michael-johnson",
        trackingNumber: "CLI100003",
        city: "Johannesburg",
      },
    ];
  
    for (const data of clients) {
      const client = await prisma.user.upsert({
        where: { email: data.email },
        update: {
          name: data.name,
          role: UserRole.CLIENT,
          password: passwordHash,
        },
        create: {
          name: data.name,
          email: data.email,
          password: passwordHash,
          role: UserRole.CLIENT,
          slug: data.slug,
          phone: data.phone,
          isVerified: true,
        },
      });
  
      await prisma.clientProfile.upsert({
        where: { userId: client.id },
        update: {
          status: ClientStatus.APPROVED,
          phone: data.phone,
          city: data.city,
        },
        create: {
          userId: client.id,
          status: ClientStatus.APPROVED,
          trackingNumber: data.trackingNumber,
          phone: data.phone,
          city: data.city,
        },
      });
  
      console.log("Client created:", client.email);
    }
  
    // =====================================
    // CREATE WORKERS
    // =====================================
  
    const workers = [
      {
        name: "Sarah Williams",
        email: "sarah@example.com",
        phone: "+263771000005",
        userSlug: "sarah-williams",
        profileSlug: "sarah-williams",
        trackingNumber: "WRK100001",
        firstName: "Sarah",
        lastName: "Williams",
        gender: "Female",
        headline: "Professional Massage Therapist",
        bio: "Experienced massage therapist offering relaxing and therapeutic treatments.",
        age: 29,
        specialties: ["Swedish Massage", "Deep Tissue Massage", "Relaxation"],
        languages: ["English", "Shona"],
        city: "Harare",
        country: "Zimbabwe",
        mobileService: true,
        studioService: true,
      },
      {
        name: "David Brown",
        email: "david@example.com",
        phone: "+263771000006",
        userSlug: "david-brown",
        profileSlug: "david-brown",
        trackingNumber: "WRK100002",
        firstName: "David",
        lastName: "Brown",
        gender: "Male",
        headline: "Sports & Deep Tissue Therapist",
        bio: "Specialising in sports recovery, deep tissue massage and muscle relaxation.",
        age: 34,
        specialties: ["Sports Massage", "Deep Tissue Massage"],
        languages: ["English"],
        city: "Bulawayo",
        country: "Zimbabwe",
        mobileService: true,
        studioService: false,
      },
      {
        name: "Amanda Johnson",
        email: "amanda@example.com",
        phone: "+263771000007",
        userSlug: "amanda-johnson",
        profileSlug: "amanda-johnson",
        trackingNumber: "WRK100003",
        firstName: "Amanda",
        lastName: "Johnson",
        gender: "Female",
        headline: "Beauty & Wellness Specialist",
        bio: "Dedicated wellness professional providing personalised beauty and relaxation services.",
        age: 31,
        specialties: ["Aromatherapy", "Relaxation Massage", "Wellness"],
        languages: ["English", "Shona"],
        city: "Harare",
        country: "Zimbabwe",
        mobileService: true,
        studioService: true,
      },
    ];
  
    for (const data of workers) {
      const worker = await prisma.user.upsert({
        where: { email: data.email },
        update: {
          name: data.name,
          role: UserRole.WORKER,
          password: passwordHash,
        },
        create: {
          name: data.name,
          email: data.email,
          password: passwordHash,
          role: UserRole.WORKER,
          slug: data.userSlug,
          phone: data.phone,
          isVerified: true,
        },
      });
  
      await prisma.workerProfile.upsert({
        where: { userId: worker.id },
        update: {
          status: WorkerStatus.APPROVED,
          firstName: data.firstName,
          lastName: data.lastName,
          gender: data.gender,
          headline: data.headline,
          bio: data.bio,
          age: data.age,
          specialties: data.specialties,
          languages: data.languages,
          city: data.city,
          country: data.country,
          mobileService: data.mobileService,
          studioService: data.studioService,
          isActive: true,
          isAvailable: true,
          onboardingCompleted: true,
        },
        create: {
          userId: worker.id,
          status: WorkerStatus.APPROVED,
          trackingNumber: data.trackingNumber,
          slug: data.profileSlug,
          firstName: data.firstName,
          lastName: data.lastName,
          gender: data.gender,
          headline: data.headline,
          bio: data.bio,
          age: data.age,
          specialties: data.specialties,
          languages: data.languages,
          city: data.city,
          country: data.country,
          mobileService: data.mobileService,
          studioService: data.studioService,
          isActive: true,
          isAvailable: true,
          onboardingCompleted: true,
        },
      });
  
      console.log("Worker created:", worker.email);
    }
  
    console.log("--------------------------------");
    console.log("Touchline database seeded!");
    console.log("1 Admin");
    console.log(`${clients.length} Clients`);
    console.log(`${workers.length} Workers`);
    console.log("--------------------------------");
  }
  
  main()
    .catch((error) => {
      console.error("Seed error:", error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
  