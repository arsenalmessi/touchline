
import { redirect, notFound } from "next/navigation";
import { getInboxMessageById } from "@/actions/inbox";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface MailDisplayProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MailDisplay({
  params,
}: MailDisplayProps) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user?.id || !["WORKER", "CLIENT"].includes(user.role)) {
    redirect("/login");
  }

  const mail = await getInboxMessageById(id);

  if (!mail) {
    notFound();
  }

  let otherUserId: string;

  if (mail.senderId === user.id) {
    otherUserId = mail.recipientId;
  } else if (mail.recipientId === user.id) {
    otherUserId = mail.senderId;
  } else {
    notFound();
  }

  if (user.role === "WORKER") {
    redirect(`/dashboard/worker/inbox?clientId=${otherUserId}`);
  }

  redirect(`/dashboard/user/inbox?workerId=${otherUserId}`);
}
