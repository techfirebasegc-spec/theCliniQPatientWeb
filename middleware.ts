import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const match = request.nextUrl.pathname.match(/^\/embed\/(doctors|clinics)\/([a-z0-9]+(?:-[a-z0-9]+)*)$/);
  if (!match) return NextResponse.next();
  const base = (process.env.PLATFORM_API_BASE_URL ?? process.env.NEXT_PUBLIC_PLATFORM_API_BASE_URL ?? request.nextUrl.origin).replace(/\/$/, "");
  let ancestors = "'none'";
  try { const response = await fetch(`${base}/v1/public/${match[1]}/${encodeURIComponent(match[2])}`, { cache: "no-store" }); const value = await response.json() as { presentation?: { embedFrameAncestors?: unknown } }; const origins = Array.isArray(value.presentation?.embedFrameAncestors) ? value.presentation.embedFrameAncestors.filter((origin): origin is string => typeof origin === "string") : []; if (origins.length) ancestors = origins.join(" "); } catch { /* deny framing when the public projection cannot be resolved */ }
  const response = NextResponse.next(); response.headers.set("Content-Security-Policy", `frame-ancestors ${ancestors}`); response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin"); return response;
}
export const config = { matcher: ["/embed/:path*"] };
