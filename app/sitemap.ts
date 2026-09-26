import type { MetadataRoute } from "next";
const routes = ["", "/about", "/contact", "/locations", "/careers", "/partners", "/doctors", "/services", "/specialties", "/health", "/privacy", "/terms", "/sign-in"];
export default function sitemap(): MetadataRoute.Sitemap { const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://thecliniq.co.in"; return routes.map((path) => ({ url: `${base}${path}`, lastModified: new Date() })); }
