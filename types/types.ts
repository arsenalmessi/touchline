import {  BookingStatus, WorkerStatus } from "@prisma/client";
import type {
  WorkerProfile as PrismaWorkerProfile,
  Availability,
  WorkerService,
  Service,
} from "@prisma/client";



export type ServiceProps = {
  title: string;
  imageUrl: string;
  slug: string;
};



export interface RegisterInputProps {
  fullName: string;
  phone: string;
  password: string;
  role?: string;
  plan?: string;
}

export type LoginInputProps = {
 
  password: string;
  phone: string;
};

export interface ClientProfileProps {
  firstName: string;
  lastName: string;

  profilePicture?: string | null;
  bio?: string | null;

  // email?: string | null;
  phone?: string | null;

  city?: string | null;
  address?: string | null;

  dateOfBirth?: Date | null;
  gender?: string | null;

  userId: string;
}

export type BioDataFormProps = {
  firstName: string;
  lastName: string;
  dob: Date;
  gender: string;
  page: string;
  userId: string;
  trackingNumber: string;
};

export type ProfileFormProps = {
  profilePicture: string;
  bio: string;
  page: string;
};

export type ContactFormProps = {
  // email: string;
  phone: string;
  town: string;
  city: string;
  page: string;
};

export type WorkerAvailability = {
  monday: string[];
  tuesday: string[];
  wednesday: string[];
  thursday: string[];
  friday: string[];
  saturday: string[];
  sunday: string[];
};




export interface WorkerProfileDetail extends WorkerProfile {
  id: string;
  dob: Date | null;
  userId?: string;
  status: WorkerStatus;
  trackingNumber: string;
}


export interface WorkerProfile
  extends Omit<PrismaWorkerProfile, "id" | "userId"> {
  id?: string;
  userId?: string;

  availability: Availability | null;

  services: (WorkerService & {
    service: Service;
  })[];
}

export interface Worker {
  id: string;
  userId: string;

  name: string;
  firstName: string;
  lastName: string;

  // email: string | null;
  phone: string | null;

  slug: string | null;
  image: string | null;

  workerProfile: WorkerProfile;
}

export interface WorkerDetail {
  id: string;
  name: string;
  // email: string;
  phone: string;
  slug: string;

  workerProfile: WorkerProfileDetail | null;
}

export interface InboxProps {
  recipientId: string;
  senderId: string;
  senderName: string;
  subject: string;
  body: string;
}

export interface BookingProps {
  bookingDate: Date | undefined;

  bookingFormattedDate: string;

  workerId: string;
  workerName: string;

  clientId: string;
  clientName: string;

  /**
   * Selected booking time
   */
  bookingTime: string;

  /**
   * Total booking price
   */
  charge: number;

  /**
   * Home, Spa, Studio, Hotel, etc.
   */
  location: string;

  /**
   * Requested service
   */
  serviceRequested: string;

  /**
   * Additional notes
   */
  notes?: string;

  status: BookingStatus;

  /**
   * Optional video consultation
   */
  meetingLink?: string;

  meetingProvider?: string;

  totalHours: number;

  isCompleted?: boolean;
}

export interface ReviewProps {
  clientId: string;
  clientName: string;

  workerId: string;

  rating: number;

  comment: string;

  createdAt: Date;
}

export interface BlogPost {
  id: string;
  title: string;
  image: string;
  slug: string;
  categories: string[];
  lastUpdated: string;
}

export const MASSAGE_SERVICES = [
  "Swedish Massage",
  "Deep Tissue Massage",
  "Sports Massage",
  "Thai Massage",
  "Hot Stone Massage",
  "Aromatherapy Massage",
  "Prenatal Massage",
  "Reflexology",
  "Lymphatic Drainage Massage",
  "Couples Massage",
  "Relaxation Massage",
  "Trigger Point Therapy",
];