import { NextRequest, NextResponse } from "next/server";
import {
  createAdminToken,
  setAdminCookie,
  clearAdminCookie,
  validateAdminCredentials,
  getAdminSession,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (!(await validateAdminCredentials(email, password))) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = await createAdminToken({ role: "admin", email });
    await setAdminCookie(token);

    return NextResponse.json({ success: true, message: "Logged in successfully" });
  } catch (error) {
    console.error("POST /api/auth/login error:", error);
    return NextResponse.json(
      { success: false, error: "Login failed" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await clearAdminCookie();
    return NextResponse.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("DELETE /api/auth/login error:", error);
    return NextResponse.json(
      { success: false, error: "Logout failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, authenticated: false }, { status: 401 });
    }
    return NextResponse.json({ success: true, authenticated: true, email: session.email });
  } catch (error) {
    console.error("GET /api/auth/login error:", error);
    return NextResponse.json(
      { success: false, error: "Session check failed" },
      { status: 500 }
    );
  }
}
