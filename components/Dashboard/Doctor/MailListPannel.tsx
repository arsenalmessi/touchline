
"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import type { Inbox, UserRole } from "@prisma/client";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Mail, MessageCircle } from "lucide-react";

interface MailListPanelProps {
  messages: Inbox[];
  role: UserRole;
  currentUserId: string;
}

interface Conversation {
  participantId: string;
  participantName: string;
  latestMessage: Inbox;
  count: number;
}

export default function MailListPanel({
  messages,
  role,
  currentUserId,
}: MailListPanelProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isWorker = role === "WORKER";

  const inboxPath = isWorker
    ? "/dashboard/worker/inbox"
    : "/dashboard/user/inbox";

  const queryKey = isWorker ? "clientId" : "workerId";

  // Group incoming and outgoing messages by participant.
  const conversationMap = new Map<string, Conversation>();

  messages.forEach((message) => {
    const isSentByCurrentUser =
      message.senderId === currentUserId;

    const participantId = isSentByCurrentUser
      ? message.recipientId
      : message.senderId;

    if (!participantId) return;

    const existing = conversationMap.get(participantId);

    if (!existing) {
      conversationMap.set(participantId, {
        participantId,
        participantName: isSentByCurrentUser
          ? (isWorker ? "Client" : "Worker")
          : message.senderName || "Unknown sender",
        latestMessage: message,
        count: 1,
      });
    } else {
      existing.count += 1;

      // Recover the participant's name from an incoming message.
      if (!isSentByCurrentUser && message.senderName) {
        existing.participantName = message.senderName;
      }

      if (
        new Date(message.createdAt).getTime() >
        new Date(existing.latestMessage.createdAt).getTime()
      ) {
        existing.latestMessage = message;
      }
    }
  });

  const conversations = Array.from(
    conversationMap.values()
  ).sort(
    (a, b) =>
      new Date(b.latestMessage.createdAt).getTime() -
      new Date(a.latestMessage.createdAt).getTime()
  );

  if (!conversations.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[#b8924a]/20 bg-[#b8924a]/5">
          <Mail size={23} className="text-[#b8924a]" />
        </div>

        <p className="text-sm font-medium text-[#f0ebe0]">
          No conversations yet
        </p>

        <p className="mt-1 text-xs text-[#8b7b65]">
          Your conversations will appear here.
        </p>
      </div>
    );
  }

  const selectedId = searchParams.get(queryKey);

  return (
    <ScrollArea className="h-[calc(100vh-220px)] w-full">
      <div className="flex flex-col gap-2 p-2">
        {conversations.map((conversation) => {
          const {
            participantId,
            participantName,
            latestMessage,
            count,
          } = conversation;

          const isSent =
            latestMessage.senderId === currentUserId;

          const isSelected =
            pathname === inboxPath &&
            selectedId === participantId;

          return (
            <Link
              key={participantId}
              href={`${inboxPath}?${queryKey}=${participantId}`}
              className={cn(
                "group flex flex-col gap-3 rounded-xl border p-4 transition-all duration-200",
                "border-[#b8924a]/10 bg-[#100e0b]",
                "hover:border-[#b8924a]/40 hover:bg-[#171109]",
                isSelected &&
                  "border-[#b8924a]/50 bg-[#1a150c] shadow-md shadow-black/20"
              )}
            >
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border",
                    isSelected
                      ? "border-[#b8924a]/50 bg-[#b8924a]/15"
                      : "border-[#b8924a]/20 bg-[#b8924a]/5"
                  )}
                >
                  <Mail size={16} className="text-[#b8924a]" />
                </div>

                {/* Person and latest message */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#f0ebe0]">
                    {participantName}
                  </p>

                  <p className="mt-1 truncate text-xs text-[#a49b8a]">
                    {isSent && (
                      <span className="text-[#b8924a]">
                        You:{" "}
                      </span>
                    )}
                    {latestMessage.subject || "No subject"}
                  </p>
                </div>

                {/* Timestamp and count */}
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <span className="text-[10px] text-[#8b7b65]">
                    {formatDistanceToNow(
                      new Date(latestMessage.createdAt),
                      { addSuffix: true }
                    )}
                  </span>

                  {count > 1 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#b8924a]/15 px-1.5 text-[10px] font-semibold text-[#b8924a]">
                      {count}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-[#b8924a]/10 pt-2">
                <div className="flex items-center gap-1.5">
                  <MessageCircle
                    size={12}
                    className="text-[#8b7b65]"
                  />

                  <span className="text-[10px] text-[#8b7b65]">
                    {count} {count === 1 ? "message" : "messages"}
                  </span>
                </div>

                <span className="text-[10px] font-medium uppercase tracking-wider text-[#b8924a] opacity-0 transition-opacity group-hover:opacity-100">
                  View conversation
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </ScrollArea>
  );
}
