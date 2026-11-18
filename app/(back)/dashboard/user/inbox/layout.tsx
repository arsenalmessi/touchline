
import {
  getInboxMessages,
  getInboxSentMessages,
} from "@/actions/inbox";

import MailListPanel from "@/components/Dashboard/Doctor/MailListPannel";
import PanelHeader from "@/components/Dashboard/Doctor/PanelHeader";
import NotAuthorized from "@/components/NotAuthorized";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { Mail } from "lucide-react";
import type { ReactNode } from "react";
import { UserRole } from "@prisma/client";

export default async function InboxLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  // Client inbox authorization
  if (
    !user?.id ||
    !user.role ||
    !["CLIENT", "ADMIN"].includes(user.role)
  ) {
    return <NotAuthorized />;
  }

  const [receivedResult, sentResult] = await Promise.all([
    getInboxMessages(user.id),
    getInboxSentMessages(user.id),
  ]);

  const receivedMessages = receivedResult?.data ?? [];
  const sentMessages = sentResult?.data ?? [];

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
    <div className="min-h-screen bg-[#050403] text-[#f0ebe0]">

      <div className="grid min-h-[calc(100vh-80px)] grid-cols-1 md:grid-cols-12">

        {/* Conversation Content */}
        <div className="order-first min-w-0 bg-[#080705] md:order-last md:col-span-8">
          {children}
        </div>

        {/* Unified Inbox Sidebar */}
        <aside className="order-last border-t border-[#b8924a]/15 bg-[#0b0907] py-5 md:order-first md:col-span-4 md:border-r md:border-t-0">

          {/* Header */}
          <div className="border-b border-[#b8924a]/15 px-4 pb-5">
            <PanelHeader
              title="Conversations"
              count={conversationCount}
              icon={Mail}
            />
          </div>

          {/* Unified Message List */}
          <div className="px-3 pt-4">
            <MailListPanel
              messages={allMessages}
              role={user.role as UserRole}
              currentUserId={user.id}
            />
          </div>

        </aside>

      </div>
    </div>
  );
}
