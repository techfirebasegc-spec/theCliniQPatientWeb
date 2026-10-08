"use client";

import { useState } from "react";

export function ShareButton({ href, title, variant = "prominent", ariaLabel = "Share" }: { href: string; title: string; variant?: "prominent" | "compact"; ariaLabel?: string }) {
  const [status, setStatus] = useState<"idle" | "copied">("idle");
  const share = async () => {
    const url = new URL(href, window.location.origin).toString();
    if (navigator.share) {
      try { await navigator.share({ title, url }); return; } catch (error) { if (error instanceof DOMException && error.name === "AbortError") return; }
    }
    await navigator.clipboard.writeText(url); setStatus("copied"); window.setTimeout(() => setStatus("idle"), 2_500);
  };
  if (variant === "compact") return <button className="card-share-button" type="button" aria-label={ariaLabel} title={ariaLabel} onClick={() => { void share(); }}>
    <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.7 10.6 6.6-3.8M8.7 13.4l6.6 3.8" /></svg><span className="sr-only">{status === "copied" ? "Link copied" : "Share"}</span>
  </button>;
  return <button className="share-button" type="button" onClick={() => { void share(); }}>{status === "copied" ? "Link copied" : "Share"}</button>;
}
