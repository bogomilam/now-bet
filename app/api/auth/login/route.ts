import { NextResponse } from "next/server";

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
const AUTH0_REDIRECT_URI =
  process.env.AUTH0_REDIRECT_URI || "http://localhost:3000/callback";

export async function GET() {
  const params = new URLSearchParams({
    client_id: AUTH0_CLIENT_ID || "",
    response_type: "code",
    scope: "openid profile email",
    redirect_uri: AUTH0_REDIRECT_URI,
    // optional: audience if you want an access token for your API
    // audience: 'YOUR_API_IDENTIFIER',
  });

  const authUrl = `https://${AUTH0_DOMAIN}/authorize?${params.toString()}`;

  return NextResponse.redirect(authUrl);
}
