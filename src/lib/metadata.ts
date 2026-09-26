import type { Metadata } from "next";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://thecliniq.co.in";
export function pageMetadata(title: string, description: string, path: string): Metadata { const url = new URL(path, siteUrl).toString(); return { title, description, alternates: { canonical: url }, openGraph: { title: `${title} | The CliniQ`, description, url, siteName: "The CliniQ", type: "website" }, twitter: { card: "summary", title: `${title} | The CliniQ`, description } }; }
export const siteUrlValue = siteUrl;
