import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  try {
    const tokenResponse = await fetch(
      `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          grant_type: "authorization_code",
          client_id: process.env.AUTH0_CLIENT_ID,
          client_secret: process.env.AUTH0_CLIENT_SECRET,
          code,
          redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
        }),
      }
    );

    const tokens = await tokenResponse.json();

    if (tokens.error) {
      return NextResponse.json(
        { error: tokens.error_description || "Token error" },
        { status: 400 }
      );
    }

    // Create cookie string for access token (example, adjust name/expiry)
    const cookie = `access_token=${tokens.access_token}; HttpOnly; Path=/; Secure; SameSite=Lax; Max-Age=${
      tokens.expires_in ?? 3600
    }`;

    const response = NextResponse.redirect(new URL("/", req.url)); // redirect to home or wherever

    // Set the cookie in the response headers
    response.headers.append("Set-Cookie", cookie);

    return response;
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
