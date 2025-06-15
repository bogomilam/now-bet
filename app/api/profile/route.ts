import { NextResponse } from "next/server";
import { verifyToken } from "../../../lib/auth0";

export async function GET(req: Request) {
  const cookieHeader = req.headers.get("cookie") || "";
  const tokenMatch = cookieHeader.match(/access_token=([^;]+)/);
  const token = tokenMatch?.[1];

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized: No token" },
      { status: 401 }
    );
  }

  try {
    const user = await verifyToken(token);
    return NextResponse.json({ user });
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }
}
