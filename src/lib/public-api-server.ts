import type { PublicDoctor, PublicService } from "./api";
const base = (process.env.PLATFORM_API_BASE_URL ?? process.env.NEXT_PUBLIC_PLATFORM_API_BASE_URL ?? "").replace(/\/$/, "");
async function read<T>(path: string): Promise<T | null> { if (!base) return null; try { const response = await fetch(`${base}${path}`, { next: { revalidate: 60 } }); return response.ok ? await response.json() as T : null; } catch { return null; } }
export async function publicDoctors(query?: string): Promise<PublicDoctor[]> { return (await read<{ items: PublicDoctor[] }>(`/v1/public/doctors${query ? `?q=${encodeURIComponent(query)}` : ""}`))?.items ?? []; }
export async function publicDoctor(id: string): Promise<{ doctor: PublicDoctor; services: PublicService[] } | null> { return read(`/v1/public/doctors/${encodeURIComponent(id)}`); }
export async function publicServices(query?: string): Promise<PublicService[]> { return (await read<{ items: PublicService[] }>(`/v1/public/service-exposures${query ? `?q=${encodeURIComponent(query)}` : ""}`))?.items ?? []; }
export async function publicService(id: string): Promise<PublicService | null> { return (await publicServices()).find((service) => service.id === id) ?? null; }
