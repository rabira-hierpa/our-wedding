import { NextRequest, NextResponse } from "next/server";
import {
  createSessionToken,
  getAdminPassword,
  setSessionCookie,
  verifyPassword,
} from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  try {
    if (!getAdminPassword()) {
      return NextResponse.json(
        { error: "Admin login is not configured" },
        { status: 503 }
      );
    }

    const body = await request.json();
    const password = typeof body.password === "string" ? body.password : "";

    if (!verifyPassword(password)) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    setSessionCookie(response, await createSessionToken());
    return response;
  } catch (error) {
    console.error("Error in POST /api/admin/login:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
