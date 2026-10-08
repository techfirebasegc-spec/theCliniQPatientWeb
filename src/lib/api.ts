export class PlatformApiError extends Error {
  public constructor(public readonly status: number, message = "Unable to complete the Platform request.", public readonly code?: string) {
    super(message);
  }
}

export type PublicDoctor = {
  id: string;
  slug: string;
  displayName: string | null;
  specialties: string[];
  professionalTitle?: string | null;
  shortIntroduction?: string | null;
  biography?: string | null;
  yearsExperience?: number | null;
  photo?: { url: string } | null;
  qualifications?: Array<{ credential: string; institution: string; completionYear: number | null }>;
  languages?: string[];
};

export type PatientProfile = {
  id: string;
  status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
  displayName: string | null;
};

export type PublicClinic = {
  id: string;
  slug: string;
  displayName: string;
  about?: string | null;
  photo?: { url: string } | null;
  contact?: { phone: string | null; email: string | null };
  address?: { line1: string; line2: string | null; locality: string; region: string; postalCode: string; countryCode: string } | null;
  operatingHours?: Array<{ weekday: number; opensAt: string; closesAt: string }>;
};
export type PublicPresentation = { templateKey: "professional" | "premium" | "minimal"; rendererKey: "professional-v1" | "premium-v1" | "minimal-v1"; primaryColor: string | null; secondaryColor: string | null; accentColor: string | null; layoutOptions: Record<string, unknown>; sectionVisibility: Record<string, unknown>; assets: Array<{ kind: "LOGO" | "HERO_IMAGE" | "BACKGROUND_IMAGE"; url: string }>; embedFrameAncestors?: string[] };

export type PublicDoctorReference = Pick<PublicDoctor, "slug" | "displayName">;
export type PublicClinicReference = Pick<PublicClinic, "slug" | "displayName">;

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
export type PublicClinicServiceDoctorAssignment = { assignmentId: string; slug: string; displayName: string };

export type PublicProfileService = Omit<PublicService, "provider">;

export type PublicCatalogService = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  doctorCount: number;
  clinicCount: number;
  startingPrice: { currency: string; amountMinor: string } | null;
};

export type PublicCatalogProvider = {
  kind: "DOCTOR" | "CLINIC";
  slug: string;
  displayName: string;
  serviceExposureId: string;
  price: { currency: string; amountMinor: string };
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

export type PublicApplicableServiceVersion = {
  serviceOfferingId: string;
  versionId: string;
  versionNumber: number;
  effectiveFrom: string;
  price: {
    currency: string;
    amountMinor: string;
  };
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

export type AppointmentPaymentOrder = {
  state: "PENDING_PROVIDER" | "PROCESSING";
  providerOrderId?: string;
  amountMinor?: string;
  currency?: string;
  razorpayKeyId?: string;
};

export type AppointmentPaymentRecovery = {
  status: "CONFIRMED" | "REPLAYED" | "RECONCILIATION_REQUIRED" | "IGNORED";
};

export type PatientAppointment = {
  id: string;
  status: "PAYMENT_PENDING" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "EXPIRED" | "PAYMENT_FAILED";
  startsAt: string;
  endsAt: string;
  serviceName: string;
  doctor: { displayName: string; slug: string } | null;
  clinic: { displayName: string; slug: string } | null;
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

async function postJson<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(platformUrl(path), {
    method: "POST",
    credentials: "include",
    headers: body === undefined ? undefined : { "content-type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!response.ok) throw await errorFrom(response);
  return response.json() as Promise<T>;
}

async function get<T>(path: string): Promise<T> {
  const response = await fetch(platformUrl(path), { credentials: "include" });
  if (!response.ok) throw new PlatformApiError(response.status);
  return response.json() as Promise<T>;
}

async function errorFrom(response: Response): Promise<PlatformApiError> {
  const body = await response.json().catch(() => null) as { error?: { code?: unknown; message?: unknown } } | null;
  return new PlatformApiError(response.status, typeof body?.error?.message === "string" ? body.error.message : undefined, typeof body?.error?.code === "string" ? body.error.code : undefined);
}

export function establishPlatformSession(idToken: string): Promise<void> {
  return post("/v1/auth/firebase/session", { idToken });
}

export function logoutPlatformSession(): Promise<void> {
  return post("/v1/auth/session/logout", undefined, true);
}

export function getPatientProfile(): Promise<PatientProfile> {
  return patientProfileRequest("GET");
}

export function createPatientProfile(displayName?: string): Promise<PatientProfile> {
  return patientProfileRequest("POST", displayName ? { displayName } : {});
}

async function patientProfileRequest(method: "GET" | "POST", body?: Record<string, string>): Promise<PatientProfile> {
  const response = await fetch(platformUrl("/v1/me/patient-profile"), {
    method,
    credentials: "include",
    headers: body === undefined ? undefined : { "content-type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!response.ok) throw await errorFrom(response);
  return response.json() as Promise<PatientProfile>;
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

export function getPublicDoctor(slug: string): Promise<{ doctor: Omit<PublicDoctor, "id">; presentation: PublicPresentation; services: PublicProfileService[]; clinics: PublicClinicReference[] }> {
  return get(`/v1/public/doctors/${encodeURIComponent(slug)}`);
}

export function listPublicClinics(query?: string): Promise<{ items: PublicClinic[] }> {
  return get(`/v1/public/clinics${query ? `?q=${encodeURIComponent(query)}` : ""}`);
}

export function getPublicClinic(slug: string): Promise<{ clinic: Omit<PublicClinic, "id">; presentation: PublicPresentation; services: PublicProfileService[]; doctors: PublicDoctorReference[] }> {
  return get(`/v1/public/clinics/${encodeURIComponent(slug)}`);
}

export function listPublicServices(filter: { doctorProfileId?: string; clinicId?: string; query?: string } = {}): Promise<{ items: PublicService[] }> {
  const parameters = new URLSearchParams();
  if (filter.doctorProfileId) parameters.set("doctorProfileId", filter.doctorProfileId);
  if (filter.clinicId) parameters.set("clinicId", filter.clinicId);
  if (filter.query) parameters.set("q", filter.query);
  const query = parameters.toString();
  return get(`/v1/public/service-exposures${query ? `?${query}` : ""}`);
}

export function listPublicCatalogServices(query?: string): Promise<{ items: PublicCatalogService[] }> {
  return get(`/v1/public/services${query ? `?q=${encodeURIComponent(query)}` : ""}`);
}

export function getPublicCatalogService(slug: string): Promise<{ service: PublicCatalogService; doctors: PublicCatalogProvider[]; clinics: PublicCatalogProvider[] }> {
  return get(`/v1/public/services/${encodeURIComponent(slug)}`);
}

export function getPublicAvailability(serviceExposureId: string, date: string): Promise<PublicAvailability> {
  return get(`/v1/public/service-exposures/${encodeURIComponent(serviceExposureId)}/availability?date=${encodeURIComponent(date)}`);
}

export function getPublicApplicableServiceVersion(serviceExposureId: string, at: string): Promise<PublicApplicableServiceVersion> {
  return get(`/v1/public/service-exposures/${encodeURIComponent(serviceExposureId)}/version?at=${encodeURIComponent(at)}`);
}

export function getPublicEligibleDoctors(serviceExposureId: string): Promise<PublicClinicServiceDoctorAssignment[]> {
  return get(`/v1/public/service-exposures/${encodeURIComponent(serviceExposureId)}/eligible-doctors`);
}

export async function beginAppointmentBooking(input: { serviceExposureId: string; requestedLocalAt: string; idempotencyKey: string; clinicServiceDoctorAssignmentId?: string }): Promise<AppointmentBookingResult> {
  const { serviceExposureId, requestedLocalAt, idempotencyKey, clinicServiceDoctorAssignmentId } = input;
  const intent = await postJson<AppointmentIntent>("/v1/appointment-intents", {
    serviceExposureId,
    requestedLocalAt,
    idempotencyKey,
    ...(clinicServiceDoctorAssignmentId ? { clinicServiceDoctorAssignmentId } : {}),
  });
  if (intent.state === "PAYMENT_PENDING") return { intent, paymentPending: true };
  if (intent.state !== "APPOINTMENT_INTENT" && intent.state !== "SLOT_RESERVED") throw new PlatformApiError(409);
  const reservation = intent.state === "APPOINTMENT_INTENT"
    ? await postJson<{ id: string }>(`/v1/appointment-intents/${encodeURIComponent(intent.id)}/reserve`, {})
    : undefined;
  await postJson(`/v1/appointment-intents/${encodeURIComponent(intent.id)}/payment-handoffs`, { idempotencyKey: input.idempotencyKey });
  return { intent, reservationId: reservation?.id, paymentPending: true };
}

export function createAppointmentPaymentOrder(intentId: string): Promise<AppointmentPaymentOrder> {
  return postJson<AppointmentPaymentOrder>(`/v1/appointment-intents/${encodeURIComponent(intentId)}/payment-order`);
}

export function recoverAppointmentPayment(intentId: string): Promise<AppointmentPaymentRecovery> {
  return postJson<AppointmentPaymentRecovery>(`/v1/appointment-intents/${encodeURIComponent(intentId)}/payment-recovery`);
}

export function listPatientAppointments(): Promise<{ items: PatientAppointment[] }> {
  return get("/v1/me/appointments");
}

export function getPatientAppointment(appointmentId: string): Promise<{ appointment: PatientAppointment }> {
  return get(`/v1/me/appointments/${encodeURIComponent(appointmentId)}`);
}
