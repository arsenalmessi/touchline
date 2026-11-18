
"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

export interface WorkerBioData {
  firstName: string;
  lastName: string;
  gender: string;
}

export interface WorkerContactData {
  email: string;
  phone: string;
  city: string;
  country: string;
}

export interface WorkerProfessionalData {
  headline: string;
  bio: string;
  age: number;
  specialties: string[];
  languages: string[];
  mobileService: boolean;
  studioService: boolean;
  profilePicture: string;
  coverImage: string;
  gallery: string[];
}

interface OnboardingContextData {
  workerProfileId: string;
  setWorkerProfileId: (value: string) => void;

  trackingNumber: string;
  setTrackingNumber: (value: string) => void;

  bioData: WorkerBioData;
  setBioData: (data: WorkerBioData) => void;

  contactData: WorkerContactData;
  setContactData: (data: WorkerContactData) => void;

  profileData: WorkerProfessionalData;
  setProfileData: (data: WorkerProfessionalData) => void;

  savedDBData: any;
  setSavedDBData: (data: any) => void;
}

const initialBioData: WorkerBioData = {
  firstName: "",
  lastName: "",
  gender: "",
};

const initialContactData: WorkerContactData = {
  email: "",
  phone: "",
  city: "",
  country: "Zimbabwe",
};

const initialProfileData: WorkerProfessionalData = {
  headline: "",
  bio: "",
  age: 0,
  specialties: [],
  languages: [],
  mobileService: false,
  studioService: true,
  profilePicture: "",
  coverImage: "",
  gallery: [],
};

const OnboardingContext = createContext<OnboardingContextData | undefined>(
  undefined
);

export function OnboardingContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [workerProfileId, setWorkerProfileId] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");

  const [bioData, setBioData] = useState(initialBioData);
  const [contactData, setContactData] = useState(initialContactData);
  const [profileData, setProfileData] = useState(initialProfileData);

  const [savedDBData, setSavedDBData] = useState<any>({});

  const value: OnboardingContextData = {
    workerProfileId,
    setWorkerProfileId,
    trackingNumber,
    setTrackingNumber,
    bioData,
    setBioData,
    contactData,
    setContactData,
    profileData,
    setProfileData,
    savedDBData,
    setSavedDBData,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboardingContext() {
  const context = useContext(OnboardingContext);

  if (!context) {
    throw new Error(
      "useOnboardingContext must be used inside OnboardingContextProvider"
    );
  }

  return context;
}

export default OnboardingContext;
