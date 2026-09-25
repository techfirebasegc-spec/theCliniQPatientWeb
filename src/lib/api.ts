export class PlatformApiError extends Error {
  public constructor(public readonly status: number, message = "Unable to complete the Platform request.") {
    super(message);
  }
}

export type PublicDoctor = {
  id: string;
  displayName: string | null;
};

export type PublicService = {
  id: string;
  doctorProfileId: string;
  name: string;
  description: string | null;
  currency: string;
  amountMinor: string;
};

export type PublicAvailability = {
  date: string;
  timezone: string;
  slots: Array<{
    localStart: string;
    startsAt: string;
    endsAt: string;
    remainingCapacity: number;
  }>;
};

function platformUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_PLATFORM_API_BASE_URL?.replace(/\/$/, "") ?? "";
  return `${base}${path}`;
}

async function post(path: string, body?: unknown, allowUnauthorized = false): Promise<void> {
  const response = await fetch(platformUrl(path), {
    method: "POST",
    credentials: "include",
    headers: body === undefined ? undefined : { "content-type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (response.status === 204 || (allowUnauthorized && response.status === 401)) return;
  throw new PlatformApiError(response.status);
}

async function get<T>(path: string): Promise<T> {
  const response = await fetch(platformUrl(path), { credentials: "include" });
  if (!response.ok) throw new PlatformApiError(response.status);
  return response.json() as Promise<T>;
}

export function establishPlatformSession(idToken: string): Promise<void> {
  return post("/v1/auth/firebase/session", { idToken });
}

export function logoutPlatformSession(): Promise<void> {
  return post("/v1/auth/session/logout", undefined, true);
}

export function listPublicDoctors(query?: string): Promise<{ items: PublicDoctor[] }> {
  return get(`/v1/public/doctors${query ? `?q=${encodeURIComponent(query)}` : ""}`);
}

export function getPublicDoctor(doctorProfileId: string): Promise<{ doctor: PublicDoctor; services: PublicService[] }> {
  return get(`/v1/public/doctors/${encodeURIComponent(doctorProfileId)}`);
}

export function listPublicServices(filter: { doctorProfileId?: string; query?: string } = {}): Promise<{ items: PublicService[] }> {
  const parameters = new URLSearchParams();
  if (filter.doctorProfileId) parameters.set("doctorProfileId", filter.doctorProfileId);
  if (filter.query) parameters.set("q", filter.query);
  const query = parameters.toString();
  return get(`/v1/public/service-exposures${query ? `?${query}` : ""}`);
}

export function getPublicAvailability(serviceExposureId: string, date: string): Promise<PublicAvailability> {
  return get(`/v1/public/service-exposures/${encodeURIComponent(serviceExposureId)}/availability?date=${encodeURIComponent(date)}`);
}
