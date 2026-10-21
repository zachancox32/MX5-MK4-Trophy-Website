// Step two: GitHub sends the editor back here with a code. Swap it for a
// token and hand that to the CMS window that opened this popup.
export default async (req) => {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const saved = /oauth_state=([^;]+)/.exec(req.headers.get("cookie") || "")?.[1];

  if (!code) return new Response("No code returned from GitHub.", { status: 400 });
  if (!state || state !== saved) {
    return new Response("State mismatch. Start the sign in again.", { status: 400 });
  }

  const res = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const data = await res.json();
  const ok = Boolean(data.access_token);
  const payload = JSON.stringify(
    ok
      ? { token: data.access_token, provider: "github" }
      : { error: data.error_description || "GitHub did not return a token." },
  );

  // the CMS listens for this exact message shape
  const body = `<!doctype html>
<meta charset="utf-8">
<title>Signing you in</title>
<p style="font:15px system-ui;padding:24px">Signing you in…</p>
<script>
  (function () {
    function reply(e) {
      window.opener.postMessage(
        'authorization:github:${ok ? "success" : "error"}:' + ${JSON.stringify(payload)},
        e.origin
      );
      window.removeEventListener('message', reply, false);
    }
    window.addEventListener('message', reply, false);
    window.opener.postMessage('authorizing:github', '*');
  })();
</script>`;

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "Set-Cookie": "oauth_state=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0",
    },
  });
};

export const config = { path: "/callback" };
