const APEX_PREFIX = "/calculator";
const RATEPOCKET_HOST = "ratepocket.tradali.com";
const LEGACY_HOST = "calculator.tradali.com";

function isApexHost(hostname) {
  return hostname === "tradali.com" || hostname === "www.tradali.com";
}

function isProductHost(hostname) {
  return hostname === RATEPOCKET_HOST || hostname === LEGACY_HOST;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.protocol === "http:") {
      url.protocol = "https:";
      return Response.redirect(url.toString(), 301);
    }

    // Legacy subdomain → RatePocket
    if (url.hostname === LEGACY_HOST) {
      const target = new URL(url.toString());
      target.hostname = RATEPOCKET_HOST;
      return Response.redirect(target.toString(), 301);
    }

    // Apex alias → canonical RatePocket host
    if (isApexHost(url.hostname) && url.pathname.startsWith(APEX_PREFIX)) {
      const rest = url.pathname.slice(APEX_PREFIX.length) || "/";
      const target = new URL(`https://${RATEPOCKET_HOST}${rest === "" ? "/" : rest}`);
      target.search = url.search;
      target.hash = url.hash;
      return Response.redirect(target.toString(), 301);
    }

    if (isProductHost(url.hostname) || url.hostname.endsWith(".workers.dev")) {
      return env.ASSETS.fetch(request);
    }

    return new Response("Not found", { status: 404 });
  },
};
