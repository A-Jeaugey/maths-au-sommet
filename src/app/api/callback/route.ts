import { NextRequest, NextResponse } from "next/server";

// Step 2 of the GitHub OAuth handshake. GitHub redirects here with a code;
// we exchange it for an access token and hand that token back to the CMS
// window via postMessage, following the Decap/Sveltia CMS protocol.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function postMessagePage(
  status: "success" | "error",
  payload: Record<string, unknown>
) {
  const message = `authorization:github:${status}:${JSON.stringify(payload)}`;
  // Handshake: tell the opener we're authorizing, wait for its acknowledgement,
  // then post the result back to the exact origin that replied.
  return `<!doctype html>
<html lang="fr">
  <head><meta charset="utf-8" /><title>Connexion…</title></head>
  <body style="font-family: system-ui, sans-serif; padding: 2rem; color: #0f172a;">
    <p>Connexion en cours… Cette fenêtre va se fermer automatiquement.</p>
    <script>
      (function () {
        var message = ${JSON.stringify(message)};
        function send(origin) {
          if (window.opener) window.opener.postMessage(message, origin || "*");
        }
        window.addEventListener(
          "message",
          function (e) {
            send(e.origin);
            window.close();
          },
          false
        );
        if (window.opener) {
          window.opener.postMessage("authorizing:github", "*");
        } else {
          document.body.innerHTML =
            "<p>Ouvrez cette page depuis l'interface d'administration.</p>";
        }
      })();
    </script>
  </body>
</html>`;
}

function html(body: string) {
  return new NextResponse(body, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieState = req.cookies.get("cms_oauth_state")?.value;

  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  const clientSecret = process.env.OAUTH_GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return html(
      postMessagePage("error", {
        message:
          "OAuth non configuré (variables OAUTH_GITHUB_CLIENT_ID / OAUTH_GITHUB_CLIENT_SECRET manquantes).",
      })
    );
  }
  if (!code) {
    return html(postMessagePage("error", { message: "Code d'autorisation manquant." }));
  }
  if (!state || !cookieState || state !== cookieState) {
    return html(
      postMessagePage("error", { message: "Validation de sécurité échouée (state)." })
    );
  }

  let tokenData: { access_token?: string; error_description?: string };
  try {
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: `${url.origin}/api/callback`,
      }),
    });
    tokenData = await tokenRes.json();
  } catch {
    return html(
      postMessagePage("error", { message: "Impossible de contacter GitHub." })
    );
  }

  if (!tokenData.access_token) {
    return html(
      postMessagePage("error", {
        message: tokenData.error_description ?? "Échec de l'obtention du token.",
      })
    );
  }

  const res = html(
    postMessagePage("success", { token: tokenData.access_token, provider: "github" })
  );
  // One-time state, clear it.
  res.cookies.set("cms_oauth_state", "", { path: "/", maxAge: 0 });
  return res;
}
