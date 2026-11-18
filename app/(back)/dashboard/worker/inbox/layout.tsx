
import { Suspense } from "react";
import type { ReactNode } from "react";

import {
  getInboxMessages,
  getInboxSentMessages,
} from "@/actions/inbox";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import MailListPanel from "@/components/Dashboard/Doctor/MailListPannel";
import PanelHeader from "@/components/Dashboard/Doctor/PanelHeader";
import NotAuthorized from "@/components/NotAuthorized";

import { authOptions } from "@/lib/auth";
import { Mail } from "lucide-react";
import { getServerSession } from "next-auth";

function InboxLoading() {
  return (
    <div className="min-h-[500px] bg-[#050403] animate-pulse">
      <div className="grid min-h-[500px] grid-cols-1 md:grid-cols-12">
        <div className="order-first bg-[#100e0b] md:order-last md:col-span-8" />

        <div className="order-last space-y-5 border-t border-[#b8924a]/15 p-5 md:order-first md:col-span-4 md:border-r md:border-t-0">
          <div className="h-8 w-36 rounded-lg bg-[#201b13]" />
          <div className="h-11 rounded-lg bg-[#201b13]" />
          <div className="h-20 rounded-xl bg-[#201b13]" />
          <div className="h-20 rounded-xl bg-[#201b13]" />
        </div>
      </div>
    </div>
  );
}


async function InboxLayoutContent({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user?.id || user.role !== "WORKER") {
    return <NotAuthorized />;
  }

  const [receivedResult, sentResult] = await Promise.all([
    getInboxMessages(user.id),
    getInboxSentMessages(user.id),
  ]);

  const receivedMessages = receivedResult.data ?? [];
  const sentMessages = sentResult.data ?? [];

  // Combine incoming and outgoing messages.
  const allMessages = [
    ...receivedMessages,
    ...sentMessages,
  ];

  // Count unique conversations.
  const conversationCount = new Set(
    allMessages.map((message) =>
      message.senderId === user.id
        ? message.recipientId
        : message.senderId
    )
  ).size;

  return (
    <div className="min-h-[600px] overflow-hidden rounded-2xl border border-[#b8924a]/20 bg-[#050403] text-[#f0ebe0] shadow-2xl">

      <div className="border-b border-[#b8924a]/15 bg-gradient-to-r from-[#100e0b] to-[#080705] px-5 py-5 md:px-7">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#b8924a]/30 bg-[#b8924a]/10">
            <Mail className="h-5 w-5 text-[#b8924a]" />
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#b8924a]">
              Private Correspondence
            </p>

            <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#f0ebe0]">
              Your Inbox
            </h2>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12">

        {/* Conversation Panel */}
        <div className="order-first min-h-[500px] min-w-0 bg-[#080705] md:order-last md:col-span-8">
          {children}
        </div>

        {/* Unified Inbox */}
        <aside className="order-last border-t border-[#b8924a]/15 bg-[#0b0907] py-5 md:order-first md:col-span-4 md:border-r md:border-t-0">

          <div className="px-4">
            <PanelHeader
              title="Conversations"
              count={conversationCount}
              icon={Mail}
            />
          </div>

          <div className="px-3 pt-4">
            <MailListPanel
              messages={allMessages}
              role="WORKER"
              currentUserId={user.id}
            />
          </div>

        </aside>
      </div>
    </div>
  );
}


export default function WorkerInboxLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Suspense fallback={<InboxLoading />}>
      <InboxLayoutContent>{children}</InboxLayoutContent>
    </Suspense>
  );
}
