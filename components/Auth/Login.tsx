
"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { LoginInputProps } from "@/types/types";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";

import {
  AlertCircle,
  Phone,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";

interface LoginFormProps {
  returnUrl: string;
}

export default function LoginFormWithBg({
  returnUrl,
}: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginInputProps>();

  async function onSubmit(data: LoginInputProps) {
    setIsLoading(true);
    setShowNotification(false);

    try {
      const loginData = await signIn("credentials", {
        phone: data.phone.trim().replace(/\s+/g, ""),
        password: data.password,
        redirect: false,
      });

      if (!loginData || loginData.error || !loginData.ok) {
        setShowNotification(true);
        toast.error("Incorrect phone number or password.");
        return;
      }

      // Get the authenticated user's session
      const session = await getSession();

      if (!session?.user) {
        toast.error("Unable to retrieve your account details.");
        return;
      }

      reset();
      toast.success("Welcome back!");

      // Redirect based on user role
      const role = session.user.role?.toUpperCase();

      let destination = "/dashboard";

      switch (role) {
        case "CLIENT":
          destination = "/search";
          break;

        case "WORKER":
          destination = "/dashboard";
          break;

        case "ADMIN":
          destination = "/dashboard";
          break;

        default:
          destination = returnUrl || "/dashboard";
          break;
      }

      router.replace(destination);
      router.refresh();

    } catch (error) {
      console.error("Login error:", error);
      toast.error("Unable to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#050403] text-[#f0ebe0]">
      {/* Top Accent */}
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

          {/* Card */}
          <div className="border border-[#2a2318] bg-[#100e0b] p-6 md:p-8">

            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="font-serif text-3xl md:text-4xl font-light">
                Welcome
                <span className="italic text-[#d4af71]">
                  {" "}Back
                </span>
              </h1>

              <p className="mt-2 text-sm text-[#8b7b65]">
                Sign in to continue.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
            >
              {/* Error Notification */}
              {showNotification && (
                <div className="flex items-center gap-2 border border-red-900/50 bg-red-950/20 px-4 py-3 text-red-400 text-sm">
                  <AlertCircle size={16} />
                  Invalid phone number or password.
                </div>
              )}

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
                    autoComplete="tel"
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
                    autoComplete="current-password"
                    {...register("password", {
                      required: "Password is required",
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

              {/* Forgot Password */}
              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-xs text-[#b8924a] hover:text-[#d4af71]"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full h-12 border transition-all duration-300 flex items-center justify-center gap-2 ${
                  isLoading
                    ? "border-[#6b5e50] text-[#6b5e50] cursor-not-allowed"
                    : "border-[#b8924a] text-[#b8924a] hover:bg-[#b8924a] hover:text-black"
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <span className="uppercase tracking-[0.2em] text-sm">
                      Sign In
                    </span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="text-center text-xs text-[#6b5e50] mt-5">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-[#b8924a] hover:text-[#d4af71]"
              >
                Create Account
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
