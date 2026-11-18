import { getWorkerBookings } from "@/actions/bookings";
import InboxForm from "@/components/Dashboard/InboxForm";
import NotAuthorized from "@/components/NotAuthorized";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { ClientProps } from "../../clients/layout";

export default async function page() {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (user?.role !== "WORKER") {
    return <NotAuthorized />;
  }
  const appointments = (await getWorkerBookings(user?.id)).data || [];

  const uniqueClientsMap = new Map();

  appointments.forEach((app) => {
    if (!uniqueClientsMap.has(app.clientId)) {
      uniqueClientsMap.set(app.clientId, {
        clientId: app.clientId,
        name: `${app.firstName} ${app.lastName}`,
        phone: app.phone,
        location: app.location,
        gender: app.gender,
      });
    }
  });
  const clients = Array.from(uniqueClientsMap.values()) as ClientProps[];
  const users = clients.map((patient) => {
    return {
      label: patient.name,
      value: patient.clientId,
    };
  });
  return <InboxForm users={users} session={session} title="New Message" />;
}
