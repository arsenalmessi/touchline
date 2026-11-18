import Dashboard from "@/components/Dashboard/Dashboard";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import WorkerDashboard from "@/components/Dashboard/WorkerDashboard";
import ClientDashboard from "@/components/Dashboard/ClientDashboard";

export default async function page() {
  const session = await getServerSession(authOptions);
  
  // Redirect to login if not authenticated
  if (!session || !session.user) {
    redirect("/login");
  }
  
  const user = session.user;
  const role = user.role;
  
  // Only ADMIN can access Dashboard
  if (role === "ADMIN") {
    return <Dashboard session={session} />;
  }
  
  // DOCTOR role gets DoctorDashboard
  if (role === "WORKER") {
    return <WorkerDashboard session={session} />;
  }
  
  // USER, CLIENT, and INDIVIDUALCLIENT all get PatientDashboard
  if (role === "USER" || role === "CLIENT" ) {
    return <ClientDashboard session={session} />;
  }
  
  // If none of the above roles match, redirect to an unauthorized page
  redirect("/unauthorized");
}