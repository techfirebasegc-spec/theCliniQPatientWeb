"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { getPatientAppointment, PlatformApiError, type PatientAppointment } from "../../lib/api";
import { useAuth } from "../../providers/AuthProvider";

const labels: Record<PatientAppointment["status"], string> = { PAYMENT_PENDING: "Payment pending", CONFIRMED: "Confirmed", IN_PROGRESS: "Consultation in progress", COMPLETED: "Completed", CANCELLED: "Cancelled", EXPIRED: "Expired", PAYMENT_FAILED: "Payment failed" };
function when(value: string) { const date = new Date(value); return Number.isNaN(date.getTime()) ? "Unavailable" : date.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" }); }
function time(startsAt: string, endsAt: string) { const start = new Date(startsAt), end = new Date(endsAt); return Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) ? "Unavailable" : `${start.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })} – ${end.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit", timeZoneName: "short" })}`; }

export function PatientAppointmentDetail({ appointmentId }: { appointmentId: string }) {
  const { user, loading, platformSessionEstablished } = useAuth(); const [appointment, setAppointment] = useState<PatientAppointment | null>(null); const [error, setError] = useState<string | null>(null);
  const load = useCallback(async () => { if (!user || !platformSessionEstablished) return; setError(null); try { setAppointment((await getPatientAppointment(appointmentId)).appointment); } catch (cause) { setError(cause instanceof PlatformApiError && cause.status === 404 ? "This appointment is not available." : "We couldn’t load this appointment right now."); } }, [appointmentId, platformSessionEstablished, user]);
  useEffect(() => { queueMicrotask(() => { void load(); }); }, [load]);
  if (loading) return <p className="status">Checking your secure session…</p>;
  if (!user || !platformSessionEstablished) return <section className="card account-card"><h1>Sign in to view this appointment</h1><Link className="button" href={`/sign-in?returnTo=${encodeURIComponent(`/appointments/${appointmentId}`)}`}>Sign in</Link></section>;
  if (error) return <section className="card account-card"><p className="error" role="alert">{error}</p><Link className="text-link" href="/appointments">Back to My Appointments</Link></section>;
  if (!appointment) return <p className="status">Loading appointment…</p>;
  return <div className="appointment-list"><Link className="text-link" href="/appointments">← Back to My Appointments</Link><section className="card appointment-card"><div className="appointment-card-heading"><div><p className="eyebrow">Appointment status</p><h1>{labels[appointment.status]}</h1></div><span className="appointment-status">{labels[appointment.status]}</span></div><p className="appointment-time">{appointment.serviceName}</p><p>{when(appointment.startsAt)}</p><p>{time(appointment.startsAt, appointment.endsAt)}</p></section>{appointment.doctor ? <section className="card"><p className="eyebrow">Doctor</p><h2>{appointment.doctor.displayName}</h2><Link className="text-link" href={`/doctors/${encodeURIComponent(appointment.doctor.slug)}`}>View doctor profile →</Link></section> : null}{appointment.clinic ? <section className="card"><p className="eyebrow">Clinic</p><h2>{appointment.clinic.displayName}</h2><Link className="text-link" href={`/clinics/${encodeURIComponent(appointment.clinic.slug)}`}>View clinic profile →</Link></section> : null}</div>;
}
