"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import TextInput from "../FormInputs/TextInput";
import SubmitButton from "../FormInputs/SubmitButton";
import SelectInput from "../FormInputs/SelectInput";

import type { StepFormProps } from "./StepFormProps";
import { useOnboardingContext } from "@/context/context";
import { updateWorkerContact } from "@/actions/onboarding";
import { locations } from "@/lib/locations";

type ContactValues = {
  email: string;
  phone: string;
  city: string;
  country: string;
};

export default function ContactInfo({
  title,
  description,
  nextPage,
  userId,
  formId,
  WorkerProfile,
}: StepFormProps) {
  const router = useRouter();
  const pathname = usePathname();

  const {
    savedDBData,
    setSavedDBData,
    setContactData,
    workerProfileId,
  } = useOnboardingContext();

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactValues>({
    defaultValues: {
      email: "",
      phone: "",
      city: "",
      country: "Zimbabwe",
    },
  });

  // Populate form with existing information.
  useEffect(() => {
    reset({
      email: savedDBData?.email || "",
      phone: savedDBData?.phone || "",
      city: WorkerProfile?.city || savedDBData?.city || "",
      country: "Zimbabwe",
    });
  }, [WorkerProfile, savedDBData, reset]);

  async function onSubmit(data: ContactValues) {
    const profileId =
      workerProfileId || formId || WorkerProfile?.id;

    if (!userId || !profileId) {
      toast.error(
        "Worker profile not found. Complete personal information first."
      );
      return;
    }

    if (!data.email.trim() && !data.phone.trim()) {
      toast.error("Please provide an email address or phone number.");
      return;
    }

    if (!data.city.trim()) {
      toast.error("Please select your city.");
      return;
    }

    setIsLoading(true);

    try {
      const payload: ContactValues = {
        email: data.email.trim().toLowerCase(),
        phone: data.phone.trim(),
        city: data.city.trim(),
        country: "Zimbabwe",
      };

      const response = await updateWorkerContact(
        userId,
        profileId,
        payload
      );

      if (!response || ![200, 201].includes(response.status)) {
        throw new Error(
          response?.error || "Unable to update contact information."
        );
      }

      setContactData(payload);

      setSavedDBData((previous: any) => ({
        ...previous,
        ...payload,
        id: profileId,
      }));

      toast.success("Contact information saved successfully.");

      router.push(`${pathname}?page=${nextPage}`);
    } catch (error) {
      console.error("Contact information error:", error);

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
    <div className="w-full">
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
        className="mx-auto max-w-3xl space-y-6 px-4 py-6"
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <TextInput
            label="Email Address"
            name="email"
            register={register}
            errors={errors}
            placeholder="name@example.com"
            className="w-full"
          />

          <TextInput
            label="Phone Number"
            name="phone"
            register={register}
            errors={errors}
            placeholder="+263 77 000 0000"
            className="w-full"
          />

          <SelectInput
            label="Select City"
            register={register}
            name="city"
            options={locations}
            className="col-span-full text-white"
          />

          {/* Fixed country */}
          <div className="col-span-full">
            {/* <TextInput
              label="Country"
              name="country"
              register={register}
              errors={errors}
              className="w-full"
              
            /> */}
          </div>
        </div>

        <div className="flex justify-center border-t border-gray-200 pt-6 dark:border-slate-700">
          <SubmitButton
            title="Save and Continue"
            isLoading={isLoading}
            loadingTitle="Saving contact information..."
          />
        </div>
      </form>
    </div>
  );
}