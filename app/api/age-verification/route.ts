
import { NextRequest, NextResponse } from "next/server";
import { signAgeCookie } from "@/lib/age-gate";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.isAdult !== true) {
      const response = NextResponse.json(
        { success: false, message: "Access restricted." },
        { status: 403 }
      );

      response.cookies.set("serafine_age_verified", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      });

      return response;
    }

    const response = NextResponse.json({ success: true });

    response.cookies.set(
      "serafine_age_verified",
      signAgeCookie(),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      }
    );

    return response;
  } catch (error) {
    console.error("Age verification error:", error);

    return NextResponse.json(
      { success: false, message: "Verification failed." },
      { status: 500 }
    );
  }
}
