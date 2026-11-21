
import { Reply } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { getInboxMessageById } from "@/actions/inbox";
import { formatDate } from "date-fns";
import MessageBody from "@/components/MessageBody";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import DeleteMessageBtn from "@/components/DeleteMessageBtn";
import { UserRole } from "@prisma/client";

export default async function MailDisplay({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const mail = await getInboxMessageById(id);
  const session = await getServerSession(authOptions);

  const role = session?.user?.role as UserRole | undefined;
  const userId = session?.user?.id;

  const isSender =
    !!userId && !!mail?.senderId && userId === mail.senderId;

  const replyUrl =
    role === UserRole.WORKER
      ? "/dashboard/worker/inbox/new"
      : "/dashboard/user/inbox/new";

  return (
    <div className="flex h-full flex-col">
      {/* Header actions */}
      <div className="flex items-center p-2">
        {isSender && role && mail?.id && (
          <div className="flex items-center gap-2">
            <DeleteMessageBtn
              role={role}
              id={mail.id}
            />

            <Separator
              orientation="vertical"
              className="mx-1 h-6"
            />
          </div>
        )}

        <div className="ml-auto flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  asChild
                  size="icon"
                  disabled={!mail}
                >
                  <Link href={replyUrl}>
                    <Reply className="h-4 w-4" />
                    <span className="sr-only">Reply</span>
                  </Link>
                </Button>
              </TooltipTrigger>

              <TooltipContent>
                Reply
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <Separator />

      {/* Message content */}
      {mail ? (
        <div className="flex flex-1 flex-col">
          <div className="flex items-start p-4">
            <div className="flex items-start gap-4 text-sm">
              <Avatar>
                <AvatarImage alt={mail.senderName} />

                <AvatarFallback>
                  {mail.senderName
                    .split(" ")
                    .map((chunk) => chunk[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="grid gap-1">
                <div className="font-semibold">
                  {mail.senderName}
                </div>

                <div className="line-clamp-1 text-xs">
                  {mail.subject}
                </div>

                <div className="line-clamp-1 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">
                    Sender ID:
                  </span>{" "}
                  {mail.senderId}
                </div>
              </div>
            </div>

            {mail.createdAt && (
              <div className="ml-auto text-xs text-muted-foreground">
                {formatDate(new Date(mail.createdAt), "PPpp")}
              </div>
            )}
          </div>

          <Separator />

          <div className="flex-1 whitespace-pre-wrap p-4 text-sm">
            <MessageBody html={mail.body} />
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-muted-foreground">
          No message selected
        </div>
      )}
    </div>
  );
}
