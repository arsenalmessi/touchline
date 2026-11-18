
"use client";

import { type RegisterInputProps } from "@/types/types";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { createUser } from "@/actions/users";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  User,
  Phone,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";

interface RegisterFormProps {
  role: string;
  plan: string;
}

export default function RegisterWithBg({
  role = "CLIENT",
  plan = "",
}: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [phoneErr, setPhoneErr] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterInputProps>();

  const router = useRouter();

  async function onSubmit(data: RegisterInputProps) {
    setIsLoading(true);
    setPhoneErr(null);

    try {
      const user = await createUser({
        ...data,
        role,
        plan,
      });

      if (user.status === 409) {
        setPhoneErr(user.error);
        return;
      }

      if (user.status === 200) {
        reset();
        toast.success("Account created successfully!");

        // No OTP or verification step.
        router.push("/login");
        return;
      }

      toast.error(user.error || "Something went wrong");
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#050403] text-[#f0ebe0]">
      <div className="pt-4 flex items-center justify-center">
        <div className="w-12 h-px bg-[#2a2318]" />
        <div className="w-2 h-2 rounded-full bg-[#b8924a] mx-3" />
        <div className="w-12 h-px bg-[#2a2318]" />
      </div>

      <div className="min-h-[calc(100vh-32px)] flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">

          {/* Logo */}
          <div className="text-center mb-6">
            <Link
              href="/"
              className="inline-block font-serif text-2xl tracking-[0.25em] text-[#d4af71]"
            >
              Touchline
            </Link>
          </div>

          {/* Registration Card */}
          <div className="border border-[#2a2318] bg-[#100e0b] p-6 md:p-8">

            <div className="text-center mb-6">
              <h1 className="font-serif text-3xl md:text-4xl font-light">
                Create Your
                <span className="italic text-[#d4af71]">
                  {" "}Account
                </span>
              </h1>

              <p className="mt-2 text-sm text-[#8b7b65]">
                Begin your wellness journey.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
            >
              {/* Full Name */}
              <div>
                <label className="mb-2 block text-[10px] tracking-[0.3em] uppercase text-[#7a5f32]">
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7a5f32]"
                  />

                  <input
                    type="text"
                    placeholder="John Doe"
                    {...register("fullName", {
                      required: "Full name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters",
                      },
                    })}
                    className="h-12 w-full bg-[#0c0a08] border border-[#2a2318] pl-11 pr-4 text-[#f0ebe0] placeholder:text-[#6b5e50] focus:border-[#b8924a] focus:outline-none transition-all"
                  />
                </div>

                {errors.fullName?.message && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="mb-2 block text-[10px] tracking-[0.3em] uppercase text-[#7a5f32]">
                  Phone Number
                </label>

                <div className="relative">
                  <Phone
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7a5f32]"
                  />

                  <input
                    type="tel"
                    placeholder="+263 77 123 4567"
                    {...register("phone", {
                      required: "Phone number is required",
                      minLength: {
                        value: 7,
                        message: "Enter a valid phone number",
                      },
                    })}
                    className="h-12 w-full bg-[#0c0a08] border border-[#2a2318] pl-11 pr-4 text-[#f0ebe0] placeholder:text-[#6b5e50] focus:border-[#b8924a] focus:outline-none transition-all"
                  />
                </div>

                {errors.phone?.message && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.phone.message}
                  </p>
                )}

                {phoneErr && (
                  <p className="mt-1 text-xs text-red-400">
                    {phoneErr}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-[10px] tracking-[0.3em] uppercase text-[#7a5f32]">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7a5f32]"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    })}
                    className="h-12 w-full bg-[#0c0a08] border border-[#2a2318] pl-11 pr-12 text-[#f0ebe0] placeholder:text-[#6b5e50] focus:border-[#b8924a] focus:outline-none transition-all"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7a5f32] hover:text-[#d4af71] transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>

                {errors.password?.message && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2 pt-1 text-xs text-[#8b7b65]">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="mt-0.5 accent-[#b8924a]"
                />

                <label htmlFor="terms">
                  I agree to the{" "}
                  <Link href="/terms" className="text-[#b8924a]">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-[#b8924a]">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full h-12 mt-2 border transition-all duration-300 flex items-center justify-center gap-2 ${
                  isLoading
                    ? "border-[#6b5e50] text-[#6b5e50] cursor-not-allowed"
                    : "border-[#b8924a] text-[#b8924a] hover:bg-[#b8924a] hover:text-black"
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <span className="uppercase tracking-[0.2em] text-sm">
                      Create Account
                    </span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>

            <div className="text-center text-xs text-[#6b5e50] mt-5">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[#b8924a] hover:text-[#d4af71]"
              >
                Sign In
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
