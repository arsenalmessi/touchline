
import { getInboxMessages, getInboxSentMessages } from "@/actions/inbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import MailListPanel from "@/components/Dashboard/Doctor/MailListPannel";
import PanelHeader from "@/components/Dashboard/Doctor/PanelHeader";
import NotAuthorized from "@/components/NotAuthorized";
import { authOptions } from "@/lib/auth";
import { Mail } from "lucide-react";
import { getServerSession } from "next-auth";
import React, { ReactNode } from "react";

export default async function AppointmentLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user || user.role !== "USER") {
    return <NotAuthorized />;
  }

  const messages = (await getInboxMessages(user.id)).data || [];
  const sentMessages = (await getInboxSentMessages(user.id)).data || [];

  return (
    <div>
      <div className="grid grid-cols-12">
        {/* LIST PANEL */}
        <div className="col-span-4 border-r border-gray-100 py-3">
          <PanelHeader
            title="Messages"
            count={messages.length}
            icon={Mail}
          />

          <div className="px-3">
            <Tabs defaultValue="received">
              <TabsList>
                <TabsTrigger value="received">
                  Received ({messages.length.toString().padStart(2, "0")})
                </TabsTrigger>

                <TabsTrigger value="sent">
                  Sent ({sentMessages.length.toString().padStart(2, "0")})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="received">
                <MailListPanel
                  messages={messages}
                  role={user.role}
                  currentUserId={user.id}
                />
              </TabsContent>

              <TabsContent value="sent">
                <MailListPanel
                  messages={sentMessages}
                  role={user.role}
                  currentUserId={user.id}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* MESSAGE CONTENT */}
        <div className="col-span-8">{children}</div>
      </div>
    </div>
  );
}
