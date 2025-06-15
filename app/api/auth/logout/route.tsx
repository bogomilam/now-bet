import { NextResponse } from "next/server";

export async function GET() {
  const res = NextResponse.redirect("/");
  res.headers.append(
    "Set-Cookie",
    "access_token=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Lax"
  );
  return res;
}
