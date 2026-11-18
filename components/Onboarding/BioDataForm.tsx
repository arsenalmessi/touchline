
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import TextInput from "../FormInputs/TextInput";
import SubmitButton from "../FormInputs/SubmitButton";
import RadioInput from "../FormInputs/RadioInput";

import { useOnboardingContext } from "@/context/context";
import { createWorkerProfile } from "@/actions/onboarding";
import { generateTrackingNumber } from "@/lib/generateTracking";

import type { StepFormProps } from "./StepFormProps";

type BioDataValues = {
  firstName: string;
  lastName: string;
  gender: string;
};

export default function BioDataForm({
  title,
  description,
  userId,
  nextPage,
  WorkerProfile,
}: StepFormProps) {
  const router = useRouter();
  const pathname = usePathname();

  const {
    setBioData,
    setWorkerProfileId,
    setTrackingNumber,
    setSavedDBData,
    savedDBData,
  } = useOnboardingContext();

  const [isLoading, setIsLoading] = useState(false);

  const genderOptions = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
  ];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BioDataValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: "",
    },
  });

  useEffect(() => {
    reset({
      firstName:
        WorkerProfile?.firstName ||
        savedDBData?.firstName ||
        "",
      lastName:
        WorkerProfile?.lastName ||
        savedDBData?.lastName ||
        "",
      gender:
        WorkerProfile?.gender ||
        savedDBData?.gender ||
        "",
    });
  }, [WorkerProfile, savedDBData, reset]);

  async function onSubmit(data: BioDataValues) {
    if (!userId) {
      toast.error("User account not found. Please log in again.");
      return;
    }

    setIsLoading(true);

    try {
      const tracking =
        WorkerProfile?.trackingNumber ||
        savedDBData?.trackingNumber ||
        generateTrackingNumber();

      const response = await createWorkerProfile({
        ...data,
        userId,
        trackingNumber: tracking,
      });

      if (!response?.data || ![200, 201].includes(response.status)) {
        throw new Error(
          response?.error || "Unable to save personal information."
        );
      }

      const profile = response.data;

      setBioData(data);
      setWorkerProfileId(profile.id);
      setTrackingNumber(profile.trackingNumber || tracking);
      setSavedDBData((previous: any) => ({
        ...previous,
        ...profile,
      }));

      toast.success("Personal information saved successfully.");

      router.push(`${pathname}?page=${nextPage}`);
    } catch (error) {
      console.error("Bio data error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full text-[#f0ebe0]">
      {/* Form heading */}
      <div className="border-b border-[#b8924a]/20 pb-7 text-center">
        <span className="mb-4 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#b8924a]">
          <span className="h-px w-6 bg-[#b8924a]/60" />
          Step 01 — Personal Details
          <span className="h-px w-6 bg-[#b8924a]/60" />
        </span>

        <h1 className="font-serif text-3xl font-medium tracking-tight text-[#f0ebe0] sm:text-4xl">
          {title}
        </h1>

        <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[#f0ebe0]/50 sm:text-base">
          {description}
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto max-w-3xl space-y-8 px-2 py-8 sm:px-4"
      >
        {/* Personal information */}
        <div className="space-y-5">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b8924a]">
              Your Identity
            </h3>
            <p className="mt-1 text-xs text-[#f0ebe0]/40">
              Enter your legal first and last name.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <TextInput
              label="First Name"
              name="firstName"
              register={register}
              errors={errors}
              placeholder="Enter your first name"
              className="w-full"
            />

            <TextInput
              label="Last Name"
              name="lastName"
              register={register}
              errors={errors}
              placeholder="Enter your last name"
              className="w-full"
            />
          </div>
        </div>

        {/* Gender */}
<div className="space-y-4 border-t border-[#b8924a]/15 pt-7">
  <div>
    <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b8924a]">
      Gender
    </h3>
    <p className="mt-1 text-xs text-[#f0ebe0]/40">
      Select the option that best describes you.
    </p>
  </div>

  <div className="grid grid-cols-2 gap-4">
    {genderOptions.map((option) => (
      <label
        key={option.value}
        className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#b8924a]/20 bg-[#100f0d] p-4 transition hover:border-[#b8924a]/50"
      >
        <input
          type="radio"
          value={option.value}
          {...register("gender", {
            required: "Please select your gender.",
          })}
          className="h-4 w-4 accent-[#b8924a]"
        />

        <span className="text-sm font-medium text-[#f0ebe0]">
          {option.label}
        </span>
      </label>
    ))}
  </div>

  {errors.gender && (
    <p className="text-xs text-red-400">
      {errors.gender.message}
    </p>
  )}
</div>

        {/* Submit */}
        <div className="flex justify-center border-t border-[#b8924a]/20 pt-7">
          <div className="w-full sm:w-auto">
            <SubmitButton
              title="Save and Continue"
              isLoading={isLoading}
              loadingTitle="Saving information..."
            />
          </div>
        </div>
      </form>
    </div>
  );
}
