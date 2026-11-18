
import InboxForm from "@/components/Dashboard/InboxForm";
import NotAuthorized from "@/components/NotAuthorized";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { DoctorProps } from "../../doctors/layout";
import { getClientBookings } from "@/actions/bookings";

export default async function page() {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (user?.role !== "USER") {
    return <NotAuthorized />;
  }
  const appointments = (await getClientBookings(user?.id)).data || [];

  const uniquePatientsMap = new Map();

  appointments.forEach((app) => {
    if (!uniquePatientsMap.has(app.workerId)) {
      uniquePatientsMap.set(app.workerId, {
        workerId: app.workerId,
        doctorName: app.workerName ?? "Name Not Provided",
      });
    }
  });
  const doctors = Array.from(uniquePatientsMap.values()) as DoctorProps[];
  // console.log(doctors);
  const users = doctors.map((doctor) => {
    return {
      label: doctor.doctorName,
      value: doctor.doctorId,
    };
  });
  return <InboxForm users={users} session={session} title="New Message" />;
}
