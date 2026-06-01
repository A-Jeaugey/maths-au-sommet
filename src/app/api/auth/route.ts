import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "node:crypto";

// Step 1 of the GitHub OAuth handshake for the admin (Sveltia/Decap CMS).
// The CMS opens this endpoint in a popup; we redirect to GitHub's consent
// screen. GitHub then redirects back to /api/callback. Hosting this inside
// the site itself means there is no separate auth service to deploy — the
// admin's "Publish" button can commit & push on its own once the two
// environment variables below are set.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  if (!clientId) {
    return new NextResponse(
      "Connexion impossible : la variable d'environnement OAUTH_GITHUB_CLIENT_ID n'est pas configurée sur l'hébergeur.",
      { status: 500 }
    );
  }

  const origin = new URL(req.url).origin;
  const state = randomBytes(16).toString("hex");

  const authUrl = new URL("https://github.com/login/oauth/authorize");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", `${origin}/api/callback`);
  authUrl.searchParams.set("scope", "repo");
  authUrl.searchParams.set("state", state);

  const res = NextResponse.redirect(authUrl.toString());
  // Short-lived, httpOnly cookie used to validate the callback (CSRF guard).
  res.cookies.set("cms_oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  return res;
}
