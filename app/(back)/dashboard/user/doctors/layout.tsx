import { getClientBookings } from "@/actions/bookings";
import DoctorsPanel from "@/components/Dashboard/Doctor/DoctorsPanel";
import PanelHeader from "@/components/Dashboard/Doctor/PanelHeader";
import NotAuthorized from "@/components/NotAuthorized";
import { authOptions } from "@/lib/auth";
import { Users } from "lucide-react";
import { getServerSession } from "next-auth";
import { UserRole } from "@prisma/client";
import type { ReactNode } from "react";

export interface DoctorProps {
  doctorId: string;
  doctorName: string;
}

export default async function PatientLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  const authorizedRoles: UserRole[] = [
    UserRole.USER,
    UserRole.CLIENT,
  ];

  if (
    !user?.id ||
    !authorizedRoles.includes(user.role as UserRole)
  ) {
    return <NotAuthorized />;
  }

  const appointments = (await getClientBookings(user.id)).data || [];

  const uniqueWorkers = new Map<string, DoctorProps>();

  appointments.forEach((app) => {
    if (!uniqueWorkers.has(app.workerId)) {
      uniqueWorkers.set(app.workerId, {
        doctorId: app.workerId,
        doctorName: app.workerName ?? "Name Not Provided",
      });
    }
  });

  const doctors = Array.from(uniqueWorkers.values());

  return (
    <div>
      <div className="grid grid-cols-12">
        {/* Professionals panel */}
        <div className="col-span-6 border-r border-gray-100 py-3">
          <PanelHeader
            title="Professionals"
            count={doctors.length}
            icon={Users}
          />

          <div className="px-3">
            <DoctorsPanel
              doctors={doctors}
              role={user.role as UserRole}
            />
          </div>
        </div>

        {/* Conversation / details panel */}
        <div className="col-span-6">
          {children}
        </div>
      </div>
    </div>
  );
}