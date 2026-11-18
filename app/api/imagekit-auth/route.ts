
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getUploadAuthParams } from "@imagekit/next/server";

import { authOptions } from "@/lib/auth";
import { prismaClient } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const role = session?.user?.role;

    if (!userId) {
      return NextResponse.json(
        { error: "Please sign in before uploading." },
        { status: 401 }
      );
    }

    if (role !== "WORKER") {
      return NextResponse.json(
        { error: "Only workers can upload profile images." },
        { status: 403 }
      );
    }

    // Confirm that this account owns a worker profile.
    const workerProfile = await prismaClient.workerProfile.findUnique({
      where: {
        userId,
      },
      select: {
        id: true,
      },
    });

    if (!workerProfile) {
      return NextResponse.json(
        { error: "Worker profile not found." },
        { status: 403 }
      );
    }

    const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;

    if (!publicKey || !privateKey) {
      console.error("ImageKit environment variables are missing.");

      return NextResponse.json(
        { error: "Image upload is not configured." },
        { status: 500 }
      );
    }

    const authParams = getUploadAuthParams({
      publicKey,
      privateKey,
    });

    return NextResponse.json(
      {
        ...authParams,
        publicKey,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("ImageKit auth error:", error);

    return NextResponse.json(
      { error: "Unable to authorize image upload." },
      { status: 500 }
    );
  }
}
