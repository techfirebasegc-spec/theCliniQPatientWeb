"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { listPatientAppointments, PlatformApiError, type PatientAppointment } from "../../lib/api";
import { useAuth } from "../../providers/AuthProvider";
import { AppointmentCard } from "./AppointmentCard";

const pageSize = 10;

function AppointmentGroup({ label, items }: { label: string; items: PatientAppointment[] }) {
  const [page, setPage] = useState(1);
  if (!items.length) return null;
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleItems = items.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  return <section className="appointment-group"><div className="directory-toolbar"><div><p className="eyebrow">{label === "Past" ? "Appointments" : label}</p><h2 className="section-heading">{label} ({items.length})</h2></div></div><div className="appointment-list">{visibleItems.map((appointment) => <AppointmentCard key={appointment.id} appointment={appointment} />)}</div>{items.length > pageSize ? <nav className="card-pagination" aria-label={`${label} appointments pages`}><span>Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, items.length)} of {items.length}</span><button type="button" disabled={currentPage === 1} onClick={() => setPage((value) => value - 1)}>← Previous</button><span>{currentPage} of {totalPages}</span><button type="button" disabled={currentPage === totalPages} onClick={() => setPage((value) => value + 1)}>Next →</button></nav> : null}</section>;
}

export function PatientAppointments() {
  const { user, loading: authenticationLoading, platformSessionEstablished } = useAuth();
  const router = useRouter();
  const [appointments, setAppointments] = useState<PatientAppointment[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadedAt, setLoadedAt] = useState(0);

  const load = useCallback(async () => {
    if (!user || !platformSessionEstablished) return;
    setError(null);
    try { const result = await listPatientAppointments(); setLoadedAt(Date.now()); setAppointments(result.items); } catch (cause) {
      if (cause instanceof PlatformApiError && cause.status === 401) { router.replace("/sign-in?returnTo=/appointments"); return; }
      setError("We couldn’t load your appointments right now.");
    }
  }, [platformSessionEstablished, router, user]);

  useEffect(() => { queueMicrotask(() => { void load(); }); }, [load]);
  const groups = useMemo(() => {
    if (!appointments) return null;
    return {
      upcoming: appointments.filter((item) => !["CANCELLED", "EXPIRED", "PAYMENT_FAILED", "COMPLETED"].includes(item.status) && new Date(item.endsAt).getTime() >= loadedAt).sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()),
      past: appointments.filter((item) => item.status === "COMPLETED" || new Date(item.endsAt).getTime() < loadedAt).sort((a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime()),
      cancelled: appointments.filter((item) => ["CANCELLED", "EXPIRED", "PAYMENT_FAILED"].includes(item.status)),
    };
  }, [appointments, loadedAt]);

  if (authenticationLoading) return <p className="status" role="status">Checking your secure session…</p>;
  if (!user || !platformSessionEstablished) return <section className="card account-card"><p className="eyebrow">Appointments</p><h2>Taking you to sign in</h2><p>Sign in securely to view your appointments.</p></section>;
  if (error) return <section className="card account-card"><p className="error" role="alert">{error}</p><button className="button" type="button" onClick={() => { void load(); }}>Try again</button></section>;
  if (!groups) return <p className="status" role="status">Loading your appointments…</p>;
  if (!appointments?.length) return <section className="discovery-empty"><div><h2>You don&apos;t have any appointments yet.</h2><p>Find a service and book your first appointment.</p></div><Link className="text-link" href="/services">Explore services →</Link></section>;

  return <><AppointmentGroup label="Upcoming" items={groups.upcoming} /><AppointmentGroup label="Past" items={groups.past} /><AppointmentGroup label="Cancelled" items={groups.cancelled} /></>;
}
