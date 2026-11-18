import {
  getBookings,
} from "@/actions/bookings";
import PanelHeader from "@/components/Dashboard/Doctor/PanelHeader";
import PatientPanel from "@/components/Dashboard/Doctor/PatientPanel";
import NotAuthorized from "@/components/NotAuthorized";
import { authOptions } from "@/lib/auth";
import {  Users } from "lucide-react";
import { getServerSession } from "next-auth";
import { ReactNode } from "react";
import { ClientProps } from "../worker/clients/layout";

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
  if (user?.role !== "ADMIN") {
    return <NotAuthorized />;
  }
  const appointments = (await getBookings()).data || [];

  const uniqueClientsMap = new Map();

  appointments.forEach((app) => {
    if (!uniqueClientsMap.has(app.clientId)) {
      uniqueClientsMap.set(app.clientId, {
        clientId: app.clientId,
        name: `${app.firstName} ${app.lastName}`,
        phone: app.phone,
        location: app.location,
        gender: app.gender,
        // dob: app.dob,
      });
    }
  });
  const patients = Array.from(uniqueClientsMap.values()) as ClientProps[];
  // console.log(patients);
  return (
    <div>
      <div className="grid grid-cols-12">
        {/* LIST PANNEL */}
        <div className="col-span-4  py-3 border-r border-gray-100">
          <PanelHeader
            title="Clients"
            count={patients.length ?? 0}
            icon={Users}
          />
          <div className="px-3">
            <PatientPanel patients={patients} role={user?.role} />
          </div>
        </div>

        <div className="col-span-8">{children}</div>
      </div>
    </div>
  );
}
