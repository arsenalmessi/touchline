
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Send, MessageCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { createInboxMessage } from "@/actions/inbox";

interface InboxMessage {
  id: string;
  senderId: string;
  recipientId: string;
  senderName: string;
  subject: string;
  body: string;
  createdAt: Date;
}

interface ConversationPanelProps {
  messages: InboxMessage[];
  currentUserId: string;
  otherUserId: string;
}

function cleanMessage(body: string) {
  return body
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

export default function ConversationPanel({
  messages,
  currentUserId,
  otherUserId,
}: ConversationPanelProps) {
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get the other person's name from either received or sent messages.
  const otherMessage = messages.find(
    (item) => item.senderId === otherUserId
  );

  const conversationTitle =
    otherMessage?.senderName || "Service Provider";

  // Automatically scroll to the latest message.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  async function handleSend() {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      toast.error("Please enter a message");
      return;
    }

    if (!otherUserId) {
      toast.error("Invalid conversation recipient");
      return;
    }

    if (isSending) return;

    setIsSending(true);

    try {
      const result = await createInboxMessage({
        recipientId: otherUserId,
        senderId: currentUserId,
        senderName: "",
        subject: messages[0]?.subject || "Conversation",
        body: trimmedMessage,
      });

      if (result.status !== 201) {
        toast.error(
          typeof result.error === "string"
            ? result.error
            : "Could not send your message"
        );
        return;
      }

      setMessage("");

      toast.success("Message sent successfully");

      router.refresh();
    } catch (error) {
      console.error("Conversation message error:", error);
      toast.error("Something went wrong while sending your message");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="flex min-h-[70vh] flex-col overflow-hidden rounded-xl border border-[#2a2318] bg-[#0c0a08]">

      {/* Conversation Header */}
      <div className="flex items-center gap-3 border-b border-[#2a2318] p-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#b8924a]/40 bg-[#100e0b]">
          <MessageCircle
            className="text-[#b8924a]"
            size={19}
          />
        </div>

        <div>
          <h2 className="font-serif text-lg text-[#f0ebe0]">
            {conversationTitle}
          </h2>

          <p className="text-xs text-[#8b7b65]">
            Your conversation
          </p>
        </div>
      </div>

      {/* Message History */}
      <div className="flex-1 space-y-5 overflow-y-auto p-5">

        {messages.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[#2a2318] bg-[#100e0b]">
              <MessageCircle
                size={25}
                className="text-[#b8924a]"
              />
            </div>

            <h3 className="font-serif text-xl text-[#f0ebe0]">
              Start a conversation
            </h3>

            <p className="mt-2 max-w-sm text-sm text-[#8b7b65]">
              Send your first message to start communicating.
            </p>
          </div>
        ) : (
          messages.map((item) => {
            const isMine = item.senderId === currentUserId;

            return (
              <div
                key={item.id}
                className={`flex ${
                  isMine ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-4 py-3 sm:max-w-[70%] ${
                    isMine
                      ? "bg-[#b8924a] text-[#050403]"
                      : "border border-[#2a2318] bg-[#100e0b] text-[#f0ebe0]"
                  }`}
                >
                  <p
                    className={`mb-2 text-[10px] font-semibold uppercase tracking-wider ${
                      isMine
                        ? "text-[#050403]/60"
                        : "text-[#b8924a]"
                    }`}
                  >
                    {isMine ? "You" : item.senderName}
                  </p>

                  <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                    {cleanMessage(item.body)}
                  </p>

                  <p
                    className={`mt-2 text-right text-[10px] ${
                      isMine
                        ? "text-[#050403]/60"
                        : "text-[#8b7b65]"
                    }`}
                  >
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Composer */}
      <div className="border-t border-[#2a2318] bg-[#100e0b] p-4">
        <div className="flex items-end gap-3">

          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                !event.shiftKey
              ) {
                event.preventDefault();

                if (!isSending) {
                  handleSend();
                }
              }
            }}
            placeholder="Write your message..."
            rows={2}
            disabled={isSending}
            className="min-h-[48px] flex-1 resize-none rounded-lg border border-[#2a2318] bg-[#0c0a08] px-4 py-3 text-sm text-[#f0ebe0] outline-none placeholder:text-[#6b5e50] focus:border-[#b8924a] disabled:opacity-50"
          />

          <button
            type="button"
            onClick={handleSend}
            disabled={isSending || !message.trim()}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#b8924a] text-[#050403] transition hover:bg-[#d4af71] disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Send message"
          >
            {isSending ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={17} />
            )}
          </button>
        </div>

        <p className="mt-2 text-[10px] text-[#6b5e50]">
          Press Enter to send · Shift + Enter for a new line
        </p>
      </div>
    </div>
  );
}
