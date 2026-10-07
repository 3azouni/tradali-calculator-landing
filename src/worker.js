const APEX_PREFIX = "/calculator";
const RATEPOCKET_HOST = "ratepocket.tradali.com";
const LEGACY_HOST = "calculator.tradali.com";
const SUPPORT_EMAIL = "support.tradali@gmail.com";
const NTFY_TOPIC = "ratepocket-testers-dstfwc0r";

function isLocalHost(hostname) {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";
}

function isApexHost(hostname) {
  return hostname === "tradali.com" || hostname === "www.tradali.com";
}

function isProductHost(hostname) {
  return hostname === RATEPOCKET_HOST || hostname === LEGACY_HOST;
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 160;
}

async function notifySupport({ email, name }) {
  const results = [];

  // 1) Instant push (open https://ntfy.sh/ratepocket-tradali-testers)
  try {
    const ntfy = await fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
      method: "POST",
      headers: {
        Title: "RatePocket tester signup",
        Priority: "high",
        Tags: "email,raising_hand",
      },
      body: `New closed-testing signup\nEmail: ${email}\nName: ${name || "(none)"}\nAdd in Play Console → Closed testing`,
    });
    results.push({ channel: "ntfy", ok: ntfy.ok, status: ntfy.status });
  } catch (err) {
    results.push({ channel: "ntfy", ok: false, error: String(err) });
  }

  // 2) Email via FormSubmit (needs one-time activation in support inbox)
  try {
    const body = new URLSearchParams();
    body.set("email", email);
    body.set("name", name || "(not provided)");
    body.set(
      "message",
      `New RatePocket closed-testing signup.\n\nEmail: ${email}\nName: ${name || "(not provided)"}\n\nAdd this Google email in Play Console → Closed testing.`,
    );
    body.set("_subject", `RatePocket tester list: ${email}`);
    body.set("_template", "table");
    body.set("_captcha", "false");

    const res = await fetch(`https://formsubmit.co/ajax/${SUPPORT_EMAIL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: body.toString(),
    });
    const text = await res.text();
    let parsed = null;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { raw: text };
    }
    results.push({ channel: "formsubmit", ok: res.ok, status: res.status, body: parsed });
  } catch (err) {
    results.push({ channel: "formsubmit", ok: false, error: String(err) });
  }

  return {
    ok: results.some((r) => r.ok),
    results,
  };
}

async function handleJoin(request, env) {
  if (request.method === "OPTIONS") return json({ ok: true });
  if (request.method !== "POST") return json({ ok: false, error: "Method not allowed" }, 405);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid JSON" }, 400);
  }

  const email = String(body.email || "")
    .trim()
    .toLowerCase();
  const name = String(body.name || "")
    .trim()
    .slice(0, 80);
  const consent = body.consent === true || body.consent === "yes";
  const honey = String(body.company || body._honey || "").trim();

  if (honey) return json({ ok: true, saved: true, notified: true });
  if (!isValidEmail(email)) return json({ ok: false, error: "Enter a valid Google email." }, 400);
  if (!consent) {
    return json({ ok: false, error: "Please confirm you want to join closed testing." }, 400);
  }
  if (!env.TESTER_SIGNUPS) {
    return json({ ok: false, error: "Signup storage is not configured." }, 500);
  }

  const now = new Date().toISOString();
  const existing = await env.TESTER_SIGNUPS.get(`signup:${email}`, "json");
  const record = {
    email,
    name,
    consent: true,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
    userAgent: request.headers.get("user-agent") || "",
    ip: request.headers.get("cf-connecting-ip") || "",
  };

  await env.TESTER_SIGNUPS.put(`signup:${email}`, JSON.stringify(record));

  const index = (await env.TESTER_SIGNUPS.get("index", "json")) || [];
  if (!index.includes(email)) {
    index.push(email);
    await env.TESTER_SIGNUPS.put("index", JSON.stringify(index));
  }

  let notifyDetail = null;
  try {
    notifyDetail = await notifySupport({ email, name });
  } catch (err) {
    notifyDetail = { ok: false, error: String(err) };
  }

  return json({
    ok: true,
    saved: true,
    notified: Boolean(notifyDetail?.ok),
    message:
      "You’re on the list. We’ll add your Google email in Play Console — then use step 2 to install.",
  });
}

async function handleSignupsList(request, env) {
  if (request.method === "OPTIONS") return json({ ok: true });
  if (request.method !== "GET") return json({ ok: false, error: "Method not allowed" }, 405);

  const url = new URL(request.url);
  const key = url.searchParams.get("key") || request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!env.SIGNUPS_ADMIN_KEY || key !== env.SIGNUPS_ADMIN_KEY) {
    return json({ ok: false, error: "Unauthorized" }, 401);
  }

  const index = (await env.TESTER_SIGNUPS.get("index", "json")) || [];
  const rows = [];
  for (const email of index) {
    const row = await env.TESTER_SIGNUPS.get(`signup:${email}`, "json");
    if (row) rows.push(row);
  }

  if (url.searchParams.get("format") === "csv") {
    const lines = ["email,name,createdAt,updatedAt"];
    for (const r of rows) {
      const cells = [r.email, r.name || "", r.createdAt || "", r.updatedAt || ""].map((v) =>
        `"${String(v).replaceAll('"', '""')}"`,
      );
      lines.push(cells.join(","));
    }
    return new Response(lines.join("\n"), {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="ratepocket-tester-signups.csv"',
        "Cache-Control": "no-store",
      },
    });
  }

  return json({ ok: true, count: rows.length, signups: rows });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.protocol === "http:") {
      url.protocol = "https:";
      return Response.redirect(url.toString(), 301);
    }

    if (url.hostname === LEGACY_HOST) {
      const target = new URL(url.toString());
      target.hostname = RATEPOCKET_HOST;
      return Response.redirect(target.toString(), 301);
    }

    if (isApexHost(url.hostname) && url.pathname.startsWith(APEX_PREFIX)) {
      const rest = url.pathname.slice(APEX_PREFIX.length) || "/";
      const target = new URL(`https://${RATEPOCKET_HOST}${rest === "" ? "/" : rest}`);
      target.search = url.search;
      target.hash = url.hash;
      return Response.redirect(target.toString(), 301);
    }

    if (isProductHost(url.hostname) || url.hostname.endsWith(".workers.dev")) {
      const path = url.pathname.replace(/\/+$/, "") || "/";

      if (path === "/api/join") return handleJoin(request, env);
      if (path === "/api/signups") return handleSignupsList(request, env);

      // A scanned QR code (/join?code=...) gets the page at once: no redirect to /join/ first.
      let assetRequest = request;
      if (url.pathname === "/join") {
        const page = new URL(url.toString());
        page.pathname = "/join/";
        assetRequest = new Request(page.toString(), request);
      } else if (path === "/auth/callback" || path === "/invite" || path === "/join") {
        const bridge = new URL(url.toString());
        bridge.pathname = `${path}/`;
        if (bridge.pathname !== url.pathname) {
          return Response.redirect(bridge.toString(), 302);
        }
      }

      // Group invite link in path form (/join/K7QM2-XPA9D): same page, code as a query.
      const joinPath = path.match(/^\/join\/([0-9A-Za-z-]{10,11})$/);
      if (joinPath) {
        const target = new URL(url.toString());
        target.pathname = "/join/";
        target.search = `?code=${encodeURIComponent(joinPath[1])}`;
        return Response.redirect(target.toString(), 302);
      }

      const response = await env.ASSETS.fetch(assetRequest);
      const headers = new Headers(response.headers);
      const assetPath = url.pathname;

      if (/\.(?:jpg|jpeg|png|svg|webp|woff2|css|js|ico)$/i.test(assetPath)) {
        headers.set("Cache-Control", "public, max-age=604800, stale-while-revalidate=86400");
      } else if (assetPath === "/robots.txt" || assetPath === "/sitemap.xml") {
        headers.set("Cache-Control", "public, max-age=3600");
      } else if (response.headers.get("content-type")?.includes("text/html")) {
        headers.set("Cache-Control", "public, max-age=0, must-revalidate");
      }

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }

    return new Response("Not found", { status: 404 });
  },
};
