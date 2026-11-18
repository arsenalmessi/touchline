
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getInboxConversation } from "@/actions/inbox";
import NotAuthorized from "@/components/NotAuthorized";
import ConversationPanel from "@/components/Dashboard/ConversationPanel";
import { MessageSquare, Plus, ArrowRight, Inbox } from "lucide-react";

interface InboxPageProps {
  searchParams: Promise<{
    workerId?: string;
  }>;
}

export default async function InboxPage({
  searchParams,
}: InboxPageProps) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user?.id || user.role !== "CLIENT") {
    return <NotAuthorized />;
  }

  const { workerId } = await searchParams;

  // If a worker was selected, load that conversation.
  if (workerId) {
    const result = await getInboxConversation(workerId);

    return (
      <div className="min-h-screen bg-[#050403] text-[#f0ebe0]">
        <div className="border-b border-[#2a2318] px-5 py-5 md:px-8">
          <div className="mx-auto max-w-5xl">
            <Link
              href="/dashboard/user/inbox"
              className="text-xs uppercase tracking-widest text-[#b8924a] hover:text-[#d4af71]"
            >
              ← Back to inbox
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 py-6 md:px-8">
          <ConversationPanel
            messages={result.data ?? []}
            currentUserId={user.id}
            otherUserId={workerId}
          />
        </div>
      </div>
    );
  }

  // No worker selected: show the inbox landing page.
  return (
    <div className="min-h-screen bg-[#050403] text-[#f0ebe0]">
      <div className="border-b border-[#2a2318] px-5 py-5 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-[#b8924a]">
              Your Messages
            </p>

            <h1 className="font-serif text-3xl font-light">
              Inbox
            </h1>

            <p className="mt-1 text-sm text-[#8b7b65]">
              View your conversations and connect with service providers.
            </p>
          </div>

          <Link
            href="/dashboard/user/inbox/new"
            className="inline-flex items-center justify-center gap-2 bg-[#b8924a] px-5 py-3 text-xs uppercase tracking-[0.15em] text-[#050403] transition-colors hover:bg-[#d4af71]"
          >
            <Plus size={15} />
            New Message
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-8 md:px-8">
        <div className="border border-[#2a2318] bg-[#100e0b]">
          <div className="flex items-center gap-3 border-b border-[#2a2318] p-5">
            <div className="flex h-10 w-10 items-center justify-center border border-[#2a2318]">
              <MessageSquare size={18} className="text-[#b8924a]" />
            </div>

            <div>
              <h2 className="font-serif text-xl">
                Your Conversations
              </h2>
              <p className="mt-1 text-xs text-[#8b7b65]">
                All your messages in one place.
              </p>
            </div>
          </div>

          <div className="px-5 py-16 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center border border-[#2a2318] bg-[#0c0a08]">
              <Inbox size={27} className="text-[#b8924a]" />
            </div>

            <h3 className="mb-2 font-serif text-2xl">
              Select a conversation
            </h3>

            <p className="mx-auto max-w-md text-sm leading-relaxed text-[#8b7b65]">
              Choose a conversation from your messages or find a service
              provider to start a new one.
            </p>

            <Link
              href="/search"
              className="mt-6 inline-flex items-center gap-2 border border-[#b8924a] px-6 py-3 text-xs uppercase tracking-[0.15em] text-[#d4af71] transition-all hover:bg-[#b8924a] hover:text-black"
            >
              Find Services
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
