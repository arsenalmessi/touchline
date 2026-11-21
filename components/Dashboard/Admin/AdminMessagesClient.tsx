
"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  MessageSquare,
  Search,
  Clock,
  ShieldCheck,
  MessagesSquare,
} from "lucide-react";

type Message = {
  id: string;
  senderId: string;
  recipientId: string;
  subject: string | null;
  body: string;
  createdAt: Date | string;
  sender: {
    id: string;
    name: string | null;
    role: string;
  };
  recipient: {
    id: string;
    name: string | null;
    role: string;
  };
};

type Conversation = {
  id: string;
  client: Message["sender"];
  worker: Message["sender"];
  messages: Message[];
};

interface Props {
  messages: Message[];
}

function formatTime(date: Date | string) {
  return new Date(date).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(date: Date | string) {
  const messageDate = new Date(date);
  const today = new Date();

  if (messageDate.toDateString() === today.toDateString()) {
    return formatTime(date);
  }

  return messageDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
}

function getInitials(name: string | null) {
  if (!name) return "U";

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function AdminMessagesClient({ messages }: Props) {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const conversations = useMemo(() => {
    const grouped = new Map<string, Conversation>();

    messages.forEach((message) => {
      const client =
        message.sender.role === "CLIENT"
          ? message.sender
          : message.recipient;

      const worker =
        message.sender.role === "WORKER"
          ? message.sender
          : message.recipient;

      const id = `${client.id}_${worker.id}`;

      if (!grouped.has(id)) {
        grouped.set(id, {
          id,
          client,
          worker,
          messages: [],
        });
      }

      grouped.get(id)!.messages.push(message);
    });

    return Array.from(grouped.values())
      .map((conversation) => ({
        ...conversation,
        messages: [...conversation.messages].sort(
          (a, b) =>
            new Date(a.createdAt).getTime() -
            new Date(b.createdAt).getTime()
        ),
      }))
      .sort((a, b) => {
        const aLatest =
          a.messages[a.messages.length - 1]?.createdAt;

        const bLatest =
          b.messages[b.messages.length - 1]?.createdAt;

        return (
          new Date(bLatest || 0).getTime() -
          new Date(aLatest || 0).getTime()
        );
      });
  }, [messages]);

  const filteredConversations = conversations.filter((conversation) => {
    const query = search.toLowerCase();

    return (
      conversation.client.name?.toLowerCase().includes(query) ||
      conversation.worker.name?.toLowerCase().includes(query) 
    );
  });

  const selectedConversation =
    conversations.find((conversation) => conversation.id === selectedId) ||
    null;

  return (
    <div className="flex h-[calc(100vh-120px)] min-h-[550px] overflow-hidden rounded-2xl border border-white/10 bg-[#0c0b09] text-[#f0ebe0]">

      {/* LEFT: CONVERSATION LIST */}
      <aside
        className={`w-full flex-col border-r border-white/10 bg-[#100e0b] md:flex md:w-[360px] md:shrink-0 lg:w-[390px] ${
          selectedId ? "hidden" : "flex"
        }`}
      >
        <div className="border-b border-white/10 p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">
                Messages
              </h1>
              <p className="mt-1 text-xs text-[#918b80]">
                Monitor client and worker conversations
              </p>
            </div>

            <div className="rounded-xl border border-[#b8924a]/20 bg-[#b8924a]/10 p-3">
              <MessagesSquare
                size={20}
                className="text-[#b8924a]"
              />
            </div>
          </div>

          <div className="relative">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777168]"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations..."
              className="h-11 w-full rounded-xl border border-white/10 bg-black/30 pl-10 pr-4 text-sm outline-none placeholder:text-[#777168] focus:border-[#b8924a]/50"
            />
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-[#918b80]">
              All conversations
            </span>

            <span className="rounded-full bg-[#b8924a]/10 px-2.5 py-1 text-xs text-[#b8924a]">
              {conversations.length}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conversation) => {
              const latest =
                conversation.messages[
                  conversation.messages.length - 1
                ];

              const isSelected = selectedId === conversation.id;

              return (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedId(conversation.id)}
                  className={`w-full border-b border-white/[0.06] p-4 text-left transition hover:bg-white/[0.04] ${
                    isSelected
                      ? "bg-[#b8924a]/[0.09] md:border-l-2 md:border-l-[#b8924a]"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#b8924a]/20 bg-[#b8924a]/10 text-sm font-semibold text-[#b8924a]">
                      {getInitials(conversation.client.name)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="truncate text-sm font-semibold">
                          {conversation.client.name || "Unknown client"}
                        </h3>

                        {latest && (
                          <span className="shrink-0 text-[10px] text-[#918b80]">
                            {formatDate(latest.createdAt)}
                          </span>
                        )}
                      </div>

                      <p className="mt-1 truncate text-xs text-[#b8924a]">
                        With {conversation.worker.name || "Unknown worker"}
                      </p>

                      <p className="mt-2 truncate text-xs text-[#918b80]">
                        {latest?.body || "No messages"}
                      </p>

                      <div className="mt-2 flex items-center gap-2">
                        <span className="rounded-full bg-white/[0.05] px-2 py-0.5 text-[10px] text-[#aaa397]">
                          {conversation.messages.length} messages
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="p-8 text-center">
              <MessageSquare
                className="mx-auto mb-3 text-[#777168]"
                size={30}
              />
              <p className="text-sm text-[#918b80]">
                No conversations found.
              </p>
            </div>
          )}
        </div>
      </aside>

      {/* RIGHT: CHAT WINDOW */}
      <section
        className={`min-w-0 flex-1 flex-col ${
          selectedId ? "flex" : "hidden md:flex"
        }`}
      >
        {selectedConversation ? (
          <>
            {/* Chat header */}
            <div className="flex items-center gap-3 border-b border-white/10 bg-[#100e0b] p-4 sm:p-5">
              <button
                onClick={() => setSelectedId(null)}
                className="rounded-lg p-2 text-[#aaa397] hover:bg-white/[0.05] md:hidden"
                aria-label="Back to conversations"
              >
                <ArrowLeft size={20} />
              </button>

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#b8924a]/10 text-sm font-semibold text-[#b8924a]">
                {getInitials(selectedConversation.client.name)}
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="truncate text-sm font-semibold">
                  {selectedConversation.client.name || "Unknown client"}
                  <span className="mx-2 text-[#777168]">↔</span>
                  {selectedConversation.worker.name || "Unknown worker"}
                </h2>

              
              </div>

              <div className="hidden items-center gap-2 rounded-full border border-[#b8924a]/20 bg-[#b8924a]/10 px-3 py-2 sm:flex">
                <ShieldCheck size={14} className="text-[#b8924a]" />
                <span className="text-[11px] text-[#b8924a]">
                  Admin view
                </span>
              </div>
            </div>

            {/* Conversation details */}
            <div className="flex flex-wrap gap-3 border-b border-white/[0.06] px-5 py-3 text-xs text-[#918b80]">
              <span>
                Client:{" "}
                <span className="text-[#f0ebe0]">
                  {selectedConversation.client.name}
                </span>
              </span>

              <span className="hidden sm:inline">•</span>

              <span>
                Worker:{" "}
                <span className="text-[#f0ebe0]">
                  {selectedConversation.worker.name}
                </span>
              </span>

              <span className="hidden sm:inline">•</span>

              <span>
                {selectedConversation.messages.length} messages
              </span>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-6 overflow-y-auto bg-[#080706] p-4 sm:p-6">
              <div className="py-2 text-center">
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[10px] text-[#918b80]">
                  Conversation history
                </span>
              </div>

              {selectedConversation.messages.map((message, index) => {
                const isClient = message.sender.role === "CLIENT";

                const previous =
                  selectedConversation.messages[index - 1];

                const showDate =
                  !previous ||
                  new Date(previous.createdAt).toDateString() !==
                    new Date(message.createdAt).toDateString();

                return (
                  <div key={message.id}>
                    {showDate && (
                      <div className="my-5 text-center">
                        <span className="rounded-full bg-white/[0.04] px-3 py-1 text-[10px] text-[#918b80]">
                          {new Date(message.createdAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    )}

                    <div
                      className={`flex ${
                        isClient ? "justify-start" : "justify-end"
                      }`}
                    >
                      <div className="max-w-[88%] sm:max-w-[75%]">
                        <div
                          className={`mb-1 flex items-center gap-2 text-[10px] text-[#918b80] ${
                            isClient ? "" : "justify-end"
                          }`}
                        >
                          <span>
                            {message.sender.name || "Unknown sender"}
                          </span>

                          <span>
                            {isClient ? "CLIENT" : "WORKER"}
                          </span>
                        </div>

                        <div
                          className={`rounded-2xl border p-4 ${
                            isClient
                              ? "rounded-tl-sm border-white/10 bg-[#171512]"
                              : "rounded-tr-sm border-[#b8924a]/20 bg-[#b8924a]/[0.09]"
                          }`}
                        >
                          {message.subject && (
                            <p className="mb-2 text-sm font-semibold text-[#b8924a]">
                              {message.subject}
                            </p>
                          )}

                          <p className="whitespace-pre-wrap break-words text-sm leading-6 text-[#e4ded3]">
                            {message.body}
                          </p>

                          <div
                            className={`mt-2 flex items-center gap-1 text-[10px] text-[#918b80] ${
                              isClient ? "justify-start" : "justify-end"
                            }`}
                          >
                            <Clock size={11} />
                            {formatTime(message.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Read-only footer */}
            <div className="border-t border-white/10 bg-[#100e0b] p-4">
              <div className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] p-3">
                <ShieldCheck size={15} className="text-[#b8924a]" />

                <p className="text-xs text-[#918b80]">
                  This is a read-only conversation view for administration.
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <div className="mb-5 rounded-2xl border border-[#b8924a]/20 bg-[#b8924a]/10 p-6">
              <MessagesSquare
                size={38}
                className="text-[#b8924a]"
              />
            </div>

            <h2 className="text-lg font-semibold">
              Your conversations
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-6 text-[#918b80]">
              Select a conversation from the left to view the complete
              message history between a client and a professional.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
