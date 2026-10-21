// Step one of signing an editor in: send them to GitHub to approve.
//
// No secrets live in this repo. GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET
// are set in Netlify under Site configuration > Environment variables.
export default async (req) => {
  const url = new URL(req.url);

  if ((url.searchParams.get("provider") || "github") !== "github") {
    return new Response("Only the GitHub provider is supported.", { status: 400 });
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return new Response(
      "GITHUB_CLIENT_ID is not set in this site's environment variables.",
      { status: 500 },
    );
  }

  // random state, checked again on the way back, so the callback cannot be
  // replayed by a third party
  const state = crypto.randomUUID();

  const authorize = new URL("https://github.com/login/oauth/authorize");
  authorize.searchParams.set("client_id", clientId);
  authorize.searchParams.set("redirect_uri", `${url.origin}/callback`);
  authorize.searchParams.set("scope", url.searchParams.get("scope") || "repo,user");
  authorize.searchParams.set("state", state);

  return new Response(null, {
    status: 302,
    headers: {
      Location: authorize.toString(),
      "Set-Cookie": `oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600`,
    },
  });
};

export const config = { path: "/auth" };
