export class PlatformApiError extends Error {
  public constructor(public readonly status: number, message = "Unable to complete the Platform request.") {
    super(message);
  }
}

export type PublicDoctor = {
  id: string;
  displayName: string | null;
};

export type PublicClinic = {
  id: string;
  displayName: string;
};

export type PublicServiceProvider =
  | { kind: "DOCTOR"; doctorProfileId: string }
  | { kind: "CLINIC"; clinicId: string };

export type PublicService = {
  id: string;
  provider: PublicServiceProvider;
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

type AppointmentIntentState = "APPOINTMENT_INTENT" | "SLOT_RESERVED" | "PAYMENT_PENDING" | "FULFILLED" | "EXPIRED" | "CANCELLED";

export type AppointmentIntent = {
  id: string;
  state: AppointmentIntentState;
};

export type AppointmentBookingResult = {
  intent: AppointmentIntent;
  reservationId?: string;
  paymentPending: boolean;
};

export type DoctorProfile = {
  id: string;
  accountId: string;
  status: "DRAFT" | "PENDING_VERIFICATION" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";
  displayName: string | null;
  professionalVerificationStatus: "NOT_SUBMITTED" | "PENDING" | "VERIFIED" | "REJECTED";
};

export type DoctorApplication = {
  id: string;
  doctorProfileId: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  submittedAt: string;
  reviewedAt: string | null;
  rejectionReason: string | null;
};

export type ClinicApplication = {
  id: string;
  legalName: string;
  clinicName: string;
  ownerEmail: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  submittedAt: string;
  reviewedAt: string | null;
  rejectionReason: string | null;
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

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(platformUrl(path), {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new PlatformApiError(response.status);
  return response.json() as Promise<T>;
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

export function createDoctorProfile(displayName: string): Promise<DoctorProfile> {
  return postJson<DoctorProfile>("/v1/me/doctor-profile", { displayName });
}

export function submitDoctorApplication(doctorProfileId: string): Promise<{ application: DoctorApplication }> {
  return postJson<{ application: DoctorApplication }>(`/v1/me/doctor-profiles/${encodeURIComponent(doctorProfileId)}/application`, {});
}

export function getDoctorApplication(doctorProfileId: string): Promise<{ application: DoctorApplication }> {
  return get<{ application: DoctorApplication }>(`/v1/me/doctor-profiles/${encodeURIComponent(doctorProfileId)}/application`);
}

export function submitClinicApplication(input: { legalName: string; clinicName: string; ownerEmail: string }): Promise<{ application: ClinicApplication }> {
  return postJson<{ application: ClinicApplication }>("/v1/me/clinic-application", input);
}

export function getClinicApplication(): Promise<{ application: ClinicApplication }> {
  return get<{ application: ClinicApplication }>("/v1/me/clinic-application");
}

export function listPublicDoctors(query?: string): Promise<{ items: PublicDoctor[] }> {
  return get(`/v1/public/doctors${query ? `?q=${encodeURIComponent(query)}` : ""}`);
}

export function getPublicDoctor(doctorProfileId: string): Promise<{ doctor: PublicDoctor; services: PublicService[] }> {
  return get(`/v1/public/doctors/${encodeURIComponent(doctorProfileId)}`);
}

export function listPublicClinics(query?: string): Promise<{ items: PublicClinic[] }> {
  return get(`/v1/public/clinics${query ? `?q=${encodeURIComponent(query)}` : ""}`);
}

export function getPublicClinic(clinicId: string): Promise<{ clinic: PublicClinic; services: PublicService[] }> {
  return get(`/v1/public/clinics/${encodeURIComponent(clinicId)}`);
}

export function listPublicServices(filter: { doctorProfileId?: string; clinicId?: string; query?: string } = {}): Promise<{ items: PublicService[] }> {
  const parameters = new URLSearchParams();
  if (filter.doctorProfileId) parameters.set("doctorProfileId", filter.doctorProfileId);
  if (filter.clinicId) parameters.set("clinicId", filter.clinicId);
  if (filter.query) parameters.set("q", filter.query);
  const query = parameters.toString();
  return get(`/v1/public/service-exposures${query ? `?${query}` : ""}`);
}

export function getPublicAvailability(serviceExposureId: string, date: string): Promise<PublicAvailability> {
  return get(`/v1/public/service-exposures/${encodeURIComponent(serviceExposureId)}/availability?date=${encodeURIComponent(date)}`);
}

export async function beginAppointmentBooking(input: { serviceExposureId: string; requestedLocalAt: string; idempotencyKey: string }): Promise<AppointmentBookingResult> {
  const intent = await postJson<AppointmentIntent>("/v1/appointment-intents", input);
  if (intent.state === "PAYMENT_PENDING") return { intent, paymentPending: true };
  if (intent.state !== "APPOINTMENT_INTENT" && intent.state !== "SLOT_RESERVED") throw new PlatformApiError(409);
  const reservation = intent.state === "APPOINTMENT_INTENT"
    ? await postJson<{ id: string }>(`/v1/appointment-intents/${encodeURIComponent(intent.id)}/reserve`, {})
    : undefined;
  await postJson(`/v1/appointment-intents/${encodeURIComponent(intent.id)}/payment-handoffs`, { idempotencyKey: input.idempotencyKey });
  return { intent, reservationId: reservation?.id, paymentPending: true };
}
