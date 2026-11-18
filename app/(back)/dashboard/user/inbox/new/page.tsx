
import { getClientBookings } from "@/actions/bookings";
import InboxForm from "@/components/Dashboard/InboxForm";
import NotAuthorized from "@/components/NotAuthorized";
import { authOptions } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";
// import { UserRole } from "@/lib/generated/prisma";

interface WorkerOption {
  label: string;
  value: string;
}

export default async function Page() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  const authorizedRoles: UserRole[] = [
    UserRole.CLIENT,
  ];

  if (!user?.role || !authorizedRoles.includes(user.role as UserRole)) {
    return <NotAuthorized />;
  }

  const appointments = (await getClientBookings(user.id)).data || [];

  const uniqueWorkersMap = new Map<
    string,
    { workerId: string; workerName: string }
  >();

  appointments.forEach((app) => {
    if (!uniqueWorkersMap.has(app.workerId)) {
      uniqueWorkersMap.set(app.workerId, {
        workerId: app.workerId,
        workerName: app.workerName ?? "Name Not Provided",
      });
    }
  });

  const users: WorkerOption[] = Array.from(
    uniqueWorkersMap.values()
  ).map((worker) => ({
    label: worker.workerName,
    value: worker.workerId,
  }));

  return (
    <InboxForm
      users={users}
      session={session}
      title="New Message"
    />
  );
}
