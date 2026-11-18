
import { Suspense } from "react";
import { connection } from "next/server";
import LoginFormWithBg from "@/components/Auth/Login";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

interface LoginPageProps {
  searchParams: Promise<{
    returnUrl?: string;
  }>;
}

export default function LoginPage({
  searchParams,
}: LoginPageProps) {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginContent searchParams={searchParams} />
    </Suspense>
  );
}

async function LoginContent({
  searchParams,
}: LoginPageProps) {

  // Force request-time rendering in Next.js 16
  await connection();

  const resolvedSearchParams = await searchParams;

  const requestedUrl = resolvedSearchParams.returnUrl;

  const returnUrl =
    requestedUrl?.startsWith("/") &&
    !requestedUrl.startsWith("//")
      ? requestedUrl
      : "/dashboard";

  // Check authentication
  const session = await getServerSession(authOptions);

  if (session) {
    redirect(returnUrl);
  }

  return <LoginFormWithBg returnUrl={returnUrl} />;
}

function LoginLoading() {
  return (
    <div className="min-h-screen bg-[#050403] flex items-center justify-center text-[#d4af71]">
      Loading...
    </div>
  );
}
