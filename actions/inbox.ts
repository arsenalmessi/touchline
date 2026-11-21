
"use server";

import { prismaClient } from "@/lib/db";
import type { InboxProps } from "@/types/types";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";


export async function createInboxMessage(data: InboxProps) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user?.id || !user.role) {
      return {
        data: null,
        status: 401,
        error: "You must be logged in to send a message.",
      };
    }

    if (
      user.role !== UserRole.CLIENT &&
      user.role !== UserRole.WORKER
    ) {
      return {
        data: null,
        status: 403,
        error: "You are not authorized to send messages.",
      };
    }

    if (!data.recipientId || !data.subject?.trim() || !data.body?.trim()) {
      return {
        data: null,
        status: 400,
        error: "Recipient, subject and message are required.",
      };
    }

    if (data.recipientId === user.id) {
      return {
        data: null,
        status: 400,
        error: "You cannot send a message to yourself.",
      };
    }

    const recipient = await prismaClient.user.findUnique({
      where: { id: data.recipientId },
      select: {
        id: true,
        role: true,
      },
    });

    if (!recipient) {
      return {
        data: null,
        status: 404,
        error: "Recipient not found.",
      };
    }

    const validRecipient =
      (user.role === UserRole.CLIENT &&
        recipient.role === UserRole.WORKER) ||
      (user.role === UserRole.WORKER &&
        recipient.role === UserRole.CLIENT);

    if (!validRecipient) {
      return {
        data: null,
        status: 403,
        error: "You can only message clients or service providers.",
      };
    }

    const newMessage = await prismaClient.inbox.create({
      data: {
        recipientId: data.recipientId,
        senderId: user.id,
        senderName: user.name ?? "User",
        subject: data.subject.trim(),
        body: data.body,
      },
    });

    revalidatePath("/dashboard/user/inbox");
    revalidatePath("/dashboard/inbox");

    return {
      data: newMessage,
      status: 201,
      error: null,
    };
  } catch (error) {
    console.error("createInboxMessage error:", error);

    return {
      data: null,
      status: 500,
      error: "Unable to send message.",
    };
  }
}

/**
 * Get messages received by the logged-in user.
 */
export async function getInboxMessages(receiverId: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.id !== receiverId) {
      return { data: [], status: 403, error: "Unauthorized." };
    }

    const messages = await prismaClient.inbox.findMany({
      where: {
        recipientId: receiverId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      data: messages,
      status: 200,
      error: null,
    };
  } catch (error) {
    console.error("getInboxMessages error:", error);

    return {
      data: [],
      status: 500,
      error: "Unable to retrieve messages.",
    };
  }
}

/**
 * Get messages sent by the logged-in user.
 */
export async function getInboxSentMessages(senderId: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.id !== senderId) {
      return { data: [], status: 403, error: "Unauthorized." };
    }

    const messages = await prismaClient.inbox.findMany({
      where: {
        senderId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      data: messages,
      status: 200,
      error: null,
    };
  } catch (error) {
    console.error("getInboxSentMessages error:", error);

    return {
      data: [],
      status: 500,
      error: "Unable to retrieve sent messages.",
    };
  }
}

/**
 * Get the complete conversation between the logged-in user
 * and one other user.
 */
export async function getInboxConversation(otherUserId: string) {
  try {
    const session = await getServerSession(authOptions);
    const currentUser = session?.user;

    if (!currentUser?.id || !currentUser.role) {
      return {
        data: [],
        status: 401,
        error: "You must be logged in.",
      };
    }

    if (
      currentUser.role !== UserRole.CLIENT &&
      currentUser.role !== UserRole.WORKER
    ) {
      return {
        data: [],
        status: 403,
        error: "Unauthorized.",
      };
    }

    if (!otherUserId || otherUserId === currentUser.id) {
      return {
        data: [],
        status: 400,
        error: "Invalid conversation.",
      };
    }

    const otherUser = await prismaClient.user.findUnique({
      where: {
        id: otherUserId,
      },
      select: {
        id: true,
        role: true,
      },
    });

    if (!otherUser) {
      return {
        data: [],
        status: 404,
        error: "User not found.",
      };
    }

    const validConversation =
      (currentUser.role === UserRole.CLIENT &&
        otherUser.role === UserRole.WORKER) ||
      (currentUser.role === UserRole.WORKER &&
        otherUser.role === UserRole.CLIENT);

    if (!validConversation) {
      return {
        data: [],
        status: 403,
        error: "Invalid conversation participants.",
      };
    }

    const messages = await prismaClient.inbox.findMany({
      where: {
        OR: [
          {
            senderId: currentUser.id,
            recipientId: otherUserId,
          },
          {
            senderId: otherUserId,
            recipientId: currentUser.id,
          },
        ],
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return {
      data: messages,
      status: 200,
      error: null,
    };
  } catch (error) {
    console.error("getInboxConversation error:", error);

    return {
      data: [],
      status: 500,
      error: "Unable to load conversation.",
    };
  }
}

export async function getInboxMessageById(id: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) return null;

    const message = await prismaClient.inbox.findFirst({
      where: {
        id,
        OR: [
          { senderId: session.user.id },
          { recipientId: session.user.id },
        ],
      },
    });

    return message;
  } catch (error) {
    console.error("getInboxMessageById error:", error);
    return null;
  }
}

export async function deleteMessage(id: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { ok: false, status: 401, error: "Unauthorized." };
    }

    const message = await prismaClient.inbox.findFirst({
      where: {
        id,
        OR: [
          { senderId: session.user.id },
          { recipientId: session.user.id },
        ],
      },
      select: { id: true },
    });

    if (!message) {
      return { ok: false, status: 404, error: "Message not found." };
    }

    await prismaClient.inbox.delete({
      where: { id },
    });

    revalidatePath("/dashboard/user/inbox");
    revalidatePath("/dashboard/inbox");

    return {
      ok: true,
      status: 200,
      error: null,
    };
  } catch (error) {
    console.error("deleteMessage error:", error);

    return {
      ok: false,
      status: 500,
      error: "Unable to delete message.",
    };
  }
}



export async function getAdminMessages() {
  try {
    const session = await getServerSession(authOptions);

    // Only admins can access the complete message history.
    if (!session?.user || session.user.role !== "ADMIN") {
      return {
        data: [],
        status: 403,
        error: "You are not authorized to view these messages.",
      };
    }

    const messages = await prismaClient.inbox.findMany({
      where: {
        OR: [
          {
            sender: {
              role: "CLIENT",
            },
            recipient: {
              role: "WORKER",
            },
          },
          {
            sender: {
              role: "WORKER",
            },
            recipient: {
              role: "CLIENT",
            },
          },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
        recipient: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      data: messages,
      status: 200,
      error: null,
    };
  } catch (error) {
    console.error("Error fetching admin messages:", error);

    return {
      data: [],
      status: 500,
      error: "Unable to fetch messages.",
    };
  }
}
