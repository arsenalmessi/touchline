import { getWorkerBookings } from "@/actions/bookings";
// import HomeDisplayCard from "@/components/Dashboard/Doctor/HomeDisplayCard";
// import NewButton from "@/components/Dashboard/Doctor/NewButton";
import NotAuthorized from "@/components/NotAuthorized";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import React from "react";
// import { PatientProps } from "./layout";
// import generateSlug from "@/utils/generateSlug";

export default async function page() {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (user?.role !== "WORKER") {
    return <NotAuthorized />;
  }
  // const slug = generateSlug(user?.name ?? "");
  const appointments = (await getWorkerBookings(user?.id)).data || [];

  const uniquePatientsMap = new Map();

  appointments.forEach((app) => {
    if (!uniquePatientsMap.has(app.clientId)) {
      uniquePatientsMap.set(app.clientId, {
        clientId: app.clientId,
        name: `${app.firstName} ${app.lastName}`,
        phone: app.phone,
        location: app.location,
        gender: app.gender,
        // dob: app.dob,
      });
    }
  });
  // const patients = Array.from(uniquePatientsMap.values()) as PatientProps[];
  // console.log(patients);
  //doctors/doctor-asuman-jb
  return (
    <div>
      {/* <div className="py-2  border-b border-gray-200 flex items-center justify-end px-4">
        <div className="flex items-center gap-4">
          <NewButton title="New Client" href={`/doctors/${slug}`} />
        </div>
      </div>
      <HomeDisplayCard
        title="Clients"
        newAppointmentLink={`/doctors/${slug}`}
        count={patients.length}
      /> */}
    </div>
  );
}
