
import Link from "next/link";
import type { Session } from "next-auth";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  getClientsAdmin,
  getWorkersAdmin,
} from "@/actions/users";

import { getInitials } from "@/utils/generateInitials";
import ApproveBtn from "./ApproveBtn";

export default async function Dashboard({
  session,
}: {
  session: Session | null;
}) {
  const [workers, clients] = await Promise.all([
    getWorkersAdmin(),
    getClientsAdmin(),
  ]);

  const user = session?.user;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <p className="text-sm text-muted-foreground">
        {user?.role}
      </p>

      <h1 className="mb-3 text-2xl font-extrabold tracking-tight">
        Welcome, Admin
      </h1>

      <div className="mx-auto grid w-full max-w-7xl gap-6 xl:grid-cols-2">

        {/* Recent Workers */}
        <Card className="w-full">
          <CardHeader>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>Recent Professionals</CardTitle>

              <Button asChild size="sm">
                <Link href="/dashboard/workers">
                  View All
                </Link>
              </Button>
            </div>
          </CardHeader>

          <CardContent className="grid gap-4">
            {workers.length > 0 ? (
              workers.slice(0, 5).map((worker) => {
                const profile = worker.workerProfile;
                const workerName =
                  worker.name ||
                  `${profile?.firstName || ""} ${profile?.lastName || ""}`.trim() ||
                  "Unnamed worker";

                return (
                  <div
                    key={worker.id}
                    className="flex flex-col gap-3 rounded-lg p-2 transition hover:bg-muted sm:flex-row sm:items-center"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar className="hidden h-9 w-9 sm:flex">
                        <AvatarImage
                          src={profile?.profilePicture || ""}
                          alt={workerName}
                        />

                        <AvatarFallback>
                          {getInitials(workerName)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {workerName}
                        </p>

                        <p className="truncate text-sm text-muted-foreground">
                          {worker.email || "No email provided"}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 sm:ml-auto">
                      <Button
                        size="sm"
                        asChild
                        variant="outline"
                      >
                        <Link
                          href={`/dashboard/workers/view/${worker.id}`}
                        >
                          View
                        </Link>
                      </Button>

                      {profile && (
                        <ApproveBtn
                          status={profile.status}
                          profileId={profile.id}
                        />
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No professionals found.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Clients */}
        <Card className="w-full">
          <CardHeader>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>Recent Clients</CardTitle>

              <Button asChild size="sm">
                <Link href="/dashboard/clients">
                  View All
                </Link>
              </Button>
            </div>
          </CardHeader>

          <CardContent className="grid gap-4">
            {clients.length > 0 ? (
              clients.slice(0, 5).map((client) => {
                const clientName = client.name || "Unnamed client";

                return (
                  <div
                    key={client.id}
                    className="flex flex-col gap-3 rounded-lg p-2 transition hover:bg-muted sm:flex-row sm:items-center"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar className="hidden h-9 w-9 sm:flex">
                        <AvatarImage
                          src={client.image || ""}
                          alt={clientName}
                        />

                        <AvatarFallback>
                          {getInitials(clientName)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {clientName}
                        </p>

                        <p className="truncate text-sm text-muted-foreground">
                          {client.email || "No email provided"}
                        </p>

                        {client.clientProfile?.city && (
                          <p className="truncate text-xs text-muted-foreground">
                            {client.clientProfile.city}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 sm:ml-auto">
                      <Button
                        size="sm"
                        asChild
                        variant="outline"
                      >
                        <Link
                          href={`/dashboard/clients/view/${client.id}`}
                        >
                          View
                        </Link>
                      </Button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No clients found.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
