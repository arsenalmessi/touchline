
import HomeDisplayCard from "@/components/Dashboard/Doctor/HomeDisplayCard";
import NewButton from "@/components/Dashboard/Doctor/NewButton";
import { getBookings } from "@/actions/bookings";
import { ClientProps } from "../worker/clients/layout";

export default async function page() {
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
  //doctors/doctor-asuman-jb
  return (
    <div>
      <div className="py-2  border-b border-gray-200 flex items-center justify-end px-4">
        <div className="flex items-center gap-4">
          <NewButton title="New Client" href={``} />
        </div>
      </div>
      <HomeDisplayCard
        title="Client"
        newAppointmentLink={""}
        count={patients.length}
      />
    </div>
  );
}
