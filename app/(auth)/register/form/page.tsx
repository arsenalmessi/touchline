
import RegisterWithBg from "@/components/Auth/Register";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { connection } from "next/server";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{
    role?: string;
    plan?: string;
  }>;
}) {
  // Force request-time rendering instead of prerendering.
  await connection();

  const resolvedSearchParams = await searchParams;

  const role = resolvedSearchParams.role || "USER";
  const plan = resolvedSearchParams.plan || "";

  const session = await getServerSession(authOptions);

  // Redirect authenticated users.
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div>
      <RegisterWithBg role={role} plan={plan} />
    </div>
  );
}
