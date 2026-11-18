
import { Suspense } from "react";
import { connection } from "next/server";
import UserTypeSelection from "@/components/Auth/UserTypeSelection";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default function RegisterPage() {
  return (
    <Suspense fallback={<RegisterLoading />}>
      <RegisterContent />
    </Suspense>
  );
}

async function RegisterContent() {
  // Defer authentication until an actual request
  await connection();

  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/home");
  }

  return <UserTypeSelection />;
}

function RegisterLoading() {
  return (
    <div className="min-h-screen bg-[#050403] flex items-center justify-center text-[#d4af71]">
      Loading...
    </div>
  );
}
