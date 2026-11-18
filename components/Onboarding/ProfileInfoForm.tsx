
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import TextInput from "../FormInputs/TextInput";
import SubmitButton from "../FormInputs/SubmitButton";
import { TextAreaInput } from "../FormInputs/TextAreaInput";
import ImageInput from "../FormInputs/ImageInput";
import ImageGalleryInput from "../FormInputs/ImageGalleryInput";

import type { StepFormProps } from "./StepFormProps";
import type { WorkerProfessionalData } from "@/context/context";

import { useOnboardingContext } from "@/context/context";

import {
  updateWorkerProfile,
  updateWorkerServices,
} from "@/actions/onboarding";

type ProfileValues = {
  headline: string;
  bio: string;
  age: number;
  mobileService: boolean;
  studioService: boolean;
};

export default function ProfileInfoForm({
  title,
  description,
  nextPage,
  formId,
  WorkerProfile,
  services = [],
}: StepFormProps) {
  const router = useRouter();
  const pathname = usePathname();

  const {
    workerProfileId,
    profileData,
    setProfileData,
    savedDBData,
    setSavedDBData,
  } = useOnboardingContext();

  const [isLoading, setIsLoading] = useState(false);

  // Image states
  const [profileImage, setProfileImage] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [gallery, setGallery] = useState<string[]>([]);

  // Text states
  const [specialtiesText, setSpecialtiesText] = useState("");
  const [languagesText, setLanguagesText] = useState("");

  // Service selection
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);

  const profileId =
    workerProfileId || formId || WorkerProfile?.id || "";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileValues>({
    defaultValues: {
      headline: "",
      bio: "",
      age: 0,
      mobileService: false,
      studioService: true,
    },
  });

  // Load existing profile information
  useEffect(() => {
    const source = {
      ...savedDBData,
      ...profileData,
      ...WorkerProfile,
    };

    reset({
      headline: source.headline ?? "",
      bio: source.bio ?? "",
      age: source.age ?? 0,
      mobileService: source.mobileService ?? false,
      studioService: source.studioService ?? true,
    });

    setProfileImage(source.profilePicture ?? "");
    setCoverImage(source.coverImage ?? "");

    setSpecialtiesText(
      (source.specialties ?? []).join(", ")
    );

    setLanguagesText(
      (source.languages ?? []).join(", ")
    );

    setGallery(
      Array.isArray(source.gallery) ? source.gallery : []
    );

    setSelectedServiceIds(
      WorkerProfile?.services?.map(
        (item: { serviceId: string }) => item.serviceId
      ) ?? []
    );
  }, [
    WorkerProfile,
    profileData,
    savedDBData,
    reset,
  ]);

  // Toggle service selection
  function toggleService(serviceId: string) {
    setSelectedServiceIds((previous) =>
      previous.includes(serviceId)
        ? previous.filter((id) => id !== serviceId)
        : [...previous, serviceId]
    );
  }

  // Convert comma-separated values into arrays
  function parseList(value: string): string[] {
    return [
      ...new Set(
        value
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      ),
    ];
  }

  // Submit profile
  async function onSubmit(data: ProfileValues) {
    if (!profileId) {
      toast.error(
        "Worker profile not found. Complete your personal information first."
      );
      return;
    }

    if (!data.mobileService && !data.studioService) {
      toast.error("Please select at least one service location.");
      return;
    }

    if (data.age < 18 || data.age > 100) {
      toast.error("Please enter a valid age.");
      return;
    }

    setIsLoading(true);

    try {
      const payload: WorkerProfessionalData = {
        headline: data.headline.trim(),
        bio: data.bio.trim(),
        age: Number(data.age),

        specialties: parseList(specialtiesText),
        languages: parseList(languagesText),

        mobileService: data.mobileService,
        studioService: data.studioService,

        profilePicture: profileImage,
        coverImage,
        gallery,
      };

      // Update professional profile
      const profileResponse = await updateWorkerProfile(
        profileId,
        payload
      );

      if (
        !profileResponse ||
        ![200, 201].includes(profileResponse.status)
      ) {
        throw new Error(
          profileResponse?.error ||
            "Unable to save professional profile."
        );
      }

      // Update selected services
      const servicesResponse = await updateWorkerServices(
        profileId,
        selectedServiceIds
      );

      if (
        !servicesResponse ||
        ![200, 201].includes(servicesResponse.status)
      ) {
        throw new Error(
          servicesResponse?.error ||
            "Your profile was saved, but your services could not be saved."
        );
      }

      // Update onboarding context
      setProfileData(payload);

      setSavedDBData((previous: any) => ({
        ...previous,
        ...payload,
        id: profileId,
      }));

      toast.success("Professional profile saved successfully.");

      router.push(`${pathname}?page=${nextPage}`);
    } catch (error) {
      console.error("Profile update error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred while saving your profile."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="border-b border-gray-200 pb-5 text-center dark:border-slate-700">
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
          {title}
        </h1>

        <p className="text-sm text-muted-foreground sm:text-base">
          {description}
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto max-w-3xl space-y-7 px-2 py-6 sm:px-4"
      >
        {/* Professional information */}
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">
              Professional Information
            </h2>

            <p className="text-sm text-muted-foreground">
              Introduce yourself and describe your experience.
            </p>
          </div>

          <TextInput
            label="Professional Headline"
            name="headline"
            register={register}
            errors={errors}
            placeholder="e.g. Professional Massage Therapist"
            className="w-full"
          />

          <TextInput
            label="Age"
            name="age"
            type="number"
            register={register}
            errors={errors}
            placeholder="e.g. 25"
            className="w-full"
          />

          <TextAreaInput
            label="Professional Biography"
            name="bio"
            register={register}
            errors={errors}
            placeholder="Tell clients about your experience, qualifications and approach to massage therapy..."
          />
        </section>

        {/* Specialties */}
        <section className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold">
              Specialties
            </h2>

            <p className="text-sm text-muted-foreground">
              Enter your massage specialties separated by commas.
            </p>
          </div>

          <textarea
            value={specialtiesText}
            onChange={(event) =>
              setSpecialtiesText(event.target.value)
            }
            rows={3}
            placeholder="e.g. Swedish Massage, Deep Tissue, Sports Massage"
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900"
          />
        </section>

        {/* Languages */}
        <section className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold">
              Languages
            </h2>

            <p className="text-sm text-muted-foreground">
              List the languages you can communicate with clients in.
            </p>
          </div>

          <textarea
            value={languagesText}
            onChange={(event) =>
              setLanguagesText(event.target.value)
            }
            rows={2}
            placeholder="e.g. English, Shona, Ndebele"
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900"
          />
        </section>

        {/* Services */}
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">
              Services Offered
            </h2>

            <p className="text-sm text-muted-foreground">
              Select the services clients can book from you.
            </p>
          </div>

          {services.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 rounded-xl border border-gray-200 p-4 sm:grid-cols-2 dark:border-slate-700">
              {services.map((service) => (
                <label
                  key={service.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <input
                    type="checkbox"
                    checked={selectedServiceIds.includes(service.id)}
                    onChange={() => toggleService(service.id)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600"
                  />

                  <span className="text-sm font-medium">
                    {service.title}
                  </span>
                </label>
              ))}
            </div>
          ) : (
            <p className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
              No active services were supplied to this form.
              Load your active Service records and pass them
              through the services prop.
            </p>
          )}
        </section>

        {/* Service locations */}
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">
              Where do you provide services?
            </h2>

            <p className="text-sm text-muted-foreground">
              Select all the ways clients can receive your services.
            </p>
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 p-4 dark:border-slate-700">
            <input
              type="checkbox"
              {...register("mobileService")}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600"
            />

            <span>
              <span className="block text-sm font-semibold">
                Mobile services
              </span>

              <span className="text-xs text-muted-foreground">
                I can travel to clients' homes or preferred locations.
              </span>
            </span>
          </label>

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 p-4 dark:border-slate-700">
            <input
              type="checkbox"
              {...register("studioService")}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600"
            />

            <span>
              <span className="block text-sm font-semibold">
                Studio services
              </span>

              <span className="text-xs text-muted-foreground">
                Clients can visit my studio or business location.
              </span>
            </span>
          </label>
        </section>

        {/* Profile photograph */}
        <section className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold">
              Profile Photograph
            </h2>

            <p className="text-sm text-muted-foreground">
              Upload a professional photograph clients can recognize.
            </p>
          </div>

          <ImageInput
            label="Profile Image"
            imageUrl={profileImage}
            setImageUrl={setProfileImage}
            endpoint="workerProfileImage"
          />
        </section>

        {/* Cover image */}
        <section className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold">
              Cover Image
            </h2>

            <p className="text-sm text-muted-foreground">
              Add a banner image for your professional profile.
            </p>
          </div>

          <ImageInput
            label="Cover Image"
            imageUrl={coverImage}
            setImageUrl={setCoverImage}
            endpoint="workerProfileImage"
          />
        </section>

        {/* Portfolio gallery */}
        <section className="space-y-4">
          <ImageGalleryInput
            gallery={gallery}
            setGallery={setGallery}
            maxImages={10}
          />
        </section>

        {/* Submit */}
        <div className="flex justify-center border-t border-gray-200 pt-6 dark:border-slate-700">
          <SubmitButton
            title="Save and Continue"
            isLoading={isLoading}
            loadingTitle="Saving professional profile..."
          />
        </div>
      </form>
    </div>
  );
}
