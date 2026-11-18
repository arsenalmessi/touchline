
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getInboxConversation } from "@/actions/inbox";
import ConversationPanel from "@/components/Dashboard/ConversationPanel";

interface InboxPageProps {
  searchParams: Promise<{
    clientId?: string;
  }>;
}

export default async function InboxPage({
  searchParams,
}: InboxPageProps) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user?.id || user.role !== "WORKER") {
    redirect("/login");
  }

  const { clientId } = await searchParams;

  if (!clientId) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center p-8 text-center">
        <div>
          <h2 className="text-lg font-semibold text-[#f0ebe0]">
            Your Inbox
          </h2>
          <p className="mt-2 text-sm text-[#8b7b65]">
            Select a client conversation to view your messages.
          </p>
        </div>
      </div>
    );
  }

  const result = await getInboxConversation(clientId);

  return (
    <ConversationPanel
      messages={result.data ?? []}
      currentUserId={user.id}
      otherUserId={clientId}
    />
  );
}
