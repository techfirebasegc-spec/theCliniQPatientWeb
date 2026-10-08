"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { getPublicAvailability, getPublicDoctor, listPublicDoctors, listPublicServices, type PublicAvailability, type PublicDoctor, type PublicProfileService, type PublicService } from "../lib/api";

function message(error: unknown): string {
  return error instanceof Error ? error.message : "Unable to load public discovery information.";
}

function price(service: Pick<PublicService, "currency" | "amountMinor">): string {
  try {
    const digits = new Intl.NumberFormat(undefined, { style: "currency", currency: service.currency }).resolvedOptions().maximumFractionDigits ?? 0;
    if (!/^\d+$/.test(service.amountMinor)) throw new Error("Invalid minor amount.");
    const padded = service.amountMinor.padStart(digits + 1, "0");
    const whole = digits ? padded.slice(0, -digits) : padded;
    const fraction = digits ? padded.slice(-digits) : "";
    return `${service.currency} ${whole}${digits ? `.${fraction}` : ""}`;
  } catch {
    return `${service.currency} ${service.amountMinor}`;
  }
}

function today(): string {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function endTime(endsAt: string, timezone: string): string {
  return new Intl.DateTimeFormat(undefined, { timeZone: timezone, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date(endsAt));
}

export function DoctorDirectory() {
  const [query, setQuery] = useState("");
  const [doctors, setDoctors] = useState<PublicDoctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async (nextQuery?: string) => {
    setLoading(true); setError(null);
    try { setDoctors((await listPublicDoctors(nextQuery)).items); } catch (cause) { setError(message(cause)); } finally { setLoading(false); }
  };
  useEffect(() => {
    let active = true;
    void listPublicDoctors().then((result) => { if (active) setDoctors(result.items); }).catch((cause: unknown) => { if (active) setError(message(cause)); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  const search = (event: FormEvent) => { event.preventDefault(); void load(query.trim() || undefined); };

  return <><h1 className="page-title">Find a doctor</h1><form className="actions" onSubmit={search}><label className="field"><span className="muted">Search by name</span><input value={query} onChange={(event) => setQuery(event.target.value)} /></label><button className="button" disabled={loading}>Search</button></form>{loading ? <p className="status">Loading doctors…</p> : null}{error ? <p className="error" role="alert">{error}</p> : null}{!loading && !error && doctors.length === 0 ? <p className="status">No public doctors match your search.</p> : null}<section className="results">{doctors.map((doctor) => <Link className="result-card" href={`/doctors/${encodeURIComponent(doctor.slug)}`} key={doctor.slug}><h2>{doctor.displayName ?? "Doctor"}</h2></Link>)}</section></>;
}

export function DoctorDetail({ doctorProfileId }: { doctorProfileId: string }) {
  const [doctor, setDoctor] = useState<Omit<PublicDoctor, "id"> | null>(null);
  const [services, setServices] = useState<PublicProfileService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { let active = true; void getPublicDoctor(doctorProfileId).then((result) => { if (active) { setDoctor(result.doctor); setServices(result.services); } }).catch((cause: unknown) => { if (active) setError(message(cause)); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, [doctorProfileId]);
  if (loading) return <p className="status">Loading doctor…</p>;
  if (error || !doctor) return <p className="error" role="alert">{error ?? "This doctor is not available."}</p>;
  return <><Link className="back-link" href="/doctors">Back to doctors</Link><h1 className="page-title">{doctor.displayName ?? "Doctor"}</h1>{services.length === 0 ? <p className="status">No public services are currently available.</p> : <section className="results">{services.map((service) => <ServiceCard key={service.id} service={service} />)}</section>}</>;
}

export function ServiceDirectory({ initialQuery = "", initialDoctorProfileId = "" }: { initialQuery?: string; initialDoctorProfileId?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [doctorProfileId, setDoctorProfileId] = useState(initialDoctorProfileId);
  const [services, setServices] = useState<PublicService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const load = async (filter: { query?: string; doctorProfileId?: string } = {}) => { setLoading(true); setError(null); try { setServices((await listPublicServices(filter)).items); } catch (cause) { setError(message(cause)); } finally { setLoading(false); } };
  useEffect(() => {
    let active = true;
    void listPublicServices({ query: initialQuery || undefined, doctorProfileId: initialDoctorProfileId || undefined }).then((result) => { if (active) setServices(result.items); }).catch((cause: unknown) => { if (active) setError(message(cause)); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [initialDoctorProfileId, initialQuery]);
  const search = (event: FormEvent) => { event.preventDefault(); void load({ query: query.trim() || undefined, doctorProfileId: doctorProfileId.trim() || undefined }); };
  return <><h1 className="page-title">Public services</h1><form className="actions" onSubmit={search}><label className="field"><span className="muted">Search services</span><input value={query} onChange={(event) => setQuery(event.target.value)} /></label><label className="field"><span className="muted">Doctor profile ID (optional)</span><input value={doctorProfileId} onChange={(event) => setDoctorProfileId(event.target.value)} /></label><button className="button" disabled={loading}>Search</button></form>{loading ? <p className="status">Loading services…</p> : null}{error ? <p className="error" role="alert">{error}</p> : null}{!loading && !error && services.length === 0 ? <p className="status">No public services match your search.</p> : null}<section className="results">{services.map((service) => <ServiceCard key={service.id} service={service} showDoctorId />)}</section></>;
}

export function ServiceDetail({ serviceExposureId }: { serviceExposureId: string }) {
  const [service, setService] = useState<PublicService | null>(null);
  const [date, setDate] = useState(today);
  const [availability, setAvailability] = useState<PublicAvailability | null>(null);
  const [loadingService, setLoadingService] = useState(true);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { let active = true; void listPublicServices().then((result) => { if (active) setService(result.items.find((item) => item.id === serviceExposureId) ?? null); }).catch((cause: unknown) => { if (active) setError(message(cause)); }).finally(() => { if (active) setLoadingService(false); }); return () => { active = false; }; }, [serviceExposureId]);
  const loadAvailability = async (event: FormEvent) => { event.preventDefault(); setLoadingAvailability(true); setError(null); try { setAvailability(await getPublicAvailability(serviceExposureId, date)); } catch (cause) { setAvailability(null); setError(message(cause)); } finally { setLoadingAvailability(false); } };
  if (loadingService) return <p className="status">Loading service…</p>;
  if (error && !service) return <p className="error" role="alert">{error}</p>;
  if (!service) return <p className="error" role="alert">This service is not available.</p>;
  return <><Link className="back-link" href="/services">Back to services</Link><h1 className="page-title">{service.name}</h1>{service.description ? <p>{service.description}</p> : null}<p className="price">{price(service)}</p><p className="muted">{providerLabel(service)}</p><form className="actions" onSubmit={loadAvailability}><label className="field"><span className="muted">Choose a date</span><input type="date" value={date} onChange={(event) => setDate(event.target.value)} required /></label><button className="button" disabled={loadingAvailability}>{loadingAvailability ? "Loading…" : "Show availability"}</button></form>{error ? <p className="error" role="alert">{error}</p> : null}{availability ? <AvailabilitySlots availability={availability} /> : null}</>;
}

function ServiceCard({ service, showDoctorId = false }: { service: PublicService | PublicProfileService; showDoctorId?: boolean }) {
  return <Link className="result-card" href={`/services/offering/${encodeURIComponent(service.id)}`}><h3>{service.name}</h3>{service.description ? <p>{service.description}</p> : null}<p className="price">{price(service)}</p>{showDoctorId && "provider" in service ? <p className="muted">{providerLabel(service)}</p> : null}</Link>;
}

function providerLabel(service: PublicService): string { return service.provider.kind === "DOCTOR" ? `Doctor profile: ${service.provider.doctorProfileId}` : `Clinic: ${service.provider.clinicId}`; }

function AvailabilitySlots({ availability }: { availability: PublicAvailability }) {
  return <section className="slot-list"><h2>Availability for {availability.date}</h2><p className="muted">Timezone: {availability.timezone}</p>{availability.slots.length === 0 ? <p className="status">No available slots for this date.</p> : availability.slots.map((slot) => <article className="slot" key={slot.startsAt}><strong>{slot.localStart.replace("T", " ")}</strong><p className="muted">Ends at {endTime(slot.endsAt, availability.timezone)} · {slot.remainingCapacity} remaining</p></article>)}</section>;
}
