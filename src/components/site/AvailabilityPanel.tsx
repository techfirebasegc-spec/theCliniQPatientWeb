"use client";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { beginAppointmentBooking, getPublicAvailability, PlatformApiError, type PublicAvailability } from "../../lib/api";
import { useAuth } from "../../providers/AuthProvider";

const pendingBookingKey = "cliniq.patient.pending-booking.v1";
type Slot = PublicAvailability["slots"][number];
type SelectedSlot = { slot: Slot; idempotencyKey: string };
type StoredBooking = { serviceExposureId: string; requestedLocalAt: string; startsAt: string; endsAt: string; idempotencyKey: string };

function dateToday() { const now = new Date(); return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`; }
function bookingError(error: unknown): string {
  if (error instanceof PlatformApiError) {
    if (error.status === 409) return "That slot is no longer available. Choose another time.";
    if (error.status === 401) return "Please sign in again to continue booking.";
  }
  return "We couldn’t start your booking. Please try again.";
}
function storedSelection(value: unknown, serviceExposureId: string): StoredBooking | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Partial<StoredBooking>;
  return item.serviceExposureId === serviceExposureId && typeof item.requestedLocalAt === "string" && typeof item.startsAt === "string" && typeof item.endsAt === "string" && typeof item.idempotencyKey === "string" ? item as StoredBooking : null;
}

export function AvailabilityPanel({ serviceExposureId }: { serviceExposureId: string }) {
  const router = useRouter();
  const { loading: authenticationLoading, platformSessionEstablished } = useAuth();
  const [date, setDate] = useState(dateToday);
  const [data, setData] = useState<PublicAvailability | null>(null);
  const [selected, setSelected] = useState<SelectedSlot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [paymentPending, setPaymentPending] = useState(false);

  useEffect(() => {
    const raw = window.sessionStorage.getItem(pendingBookingKey);
    if (!raw) return;
    try {
      const pending = storedSelection(JSON.parse(raw), serviceExposureId);
      if (!pending) return;
      void getPublicAvailability(serviceExposureId, pending.requestedLocalAt.slice(0, 10)).then((availability) => {
        setDate(pending.requestedLocalAt.slice(0, 10));
        setData(availability);
        const slot = availability.slots.find((candidate) => candidate.startsAt === pending.startsAt && candidate.endsAt === pending.endsAt && candidate.localStart === pending.requestedLocalAt);
        if (slot) setSelected({ slot, idempotencyKey: pending.idempotencyKey });
        else window.sessionStorage.removeItem(pendingBookingKey);
      }).catch(() => setError("Availability could not be loaded right now."));
    } catch { window.sessionStorage.removeItem(pendingBookingKey); }
  }, [serviceExposureId]);

  const load = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true); setError(null); setSelected(null); setPaymentPending(false);
    try { setData(await getPublicAvailability(serviceExposureId, date)); }
    catch { setData(null); setError("Availability could not be loaded right now."); }
    finally { setLoading(false); }
  };

  const chooseSlot = (slot: Slot) => {
    setSelected({ slot, idempotencyKey: crypto.randomUUID() });
    setError(null); setPaymentPending(false);
  };

  const saveAndSignIn = (selection: SelectedSlot) => {
    const pending: StoredBooking = { serviceExposureId, requestedLocalAt: selection.slot.localStart, startsAt: selection.slot.startsAt, endsAt: selection.slot.endsAt, idempotencyKey: selection.idempotencyKey };
    window.sessionStorage.setItem(pendingBookingKey, JSON.stringify(pending));
    router.push(`/sign-in?returnTo=${encodeURIComponent(`/services/${serviceExposureId}`)}`);
  };

  const continueBooking = async () => {
    if (!selected || submitting) return;
    if (authenticationLoading) { setError("Checking your secure session. Please try again in a moment."); return; }
    if (!platformSessionEstablished) { saveAndSignIn(selected); return; }
    setSubmitting(true); setError(null);
    try {
      await beginAppointmentBooking({ serviceExposureId, requestedLocalAt: selected.slot.localStart, idempotencyKey: selected.idempotencyKey });
      window.sessionStorage.removeItem(pendingBookingKey);
      setPaymentPending(true);
    } catch (cause) {
      if (cause instanceof PlatformApiError && cause.status === 401) saveAndSignIn(selected);
      else setError(bookingError(cause));
    } finally { setSubmitting(false); }
  };

  return <section className="card" aria-labelledby="availability-title">
    <h2 id="availability-title">Check public availability</h2>
    <p>Select an available time to continue with your booking.</p>
    <form className="search-form" onSubmit={load} style={{ marginTop: 18 }}>
      <label className="field"><span className="muted">Date</span><input className="input" type="date" value={date} onChange={(event) => setDate(event.target.value)} required /></label>
      <button className="button" disabled={loading}>{loading ? "Loading…" : "Show times"}</button>
    </form>
    {error ? <p className="error" role="alert">{error}</p> : null}
    {data ? <div className="slot-list" aria-live="polite">{data.slots.length ? data.slots.map((slot) => {
      const chosen = selected?.slot.startsAt === slot.startsAt && selected.slot.endsAt === slot.endsAt;
      return <button type="button" className="slot slot-button" aria-pressed={chosen} onClick={() => chooseSlot(slot)} key={slot.startsAt}>
        <strong>{slot.localStart.slice(11, 16)}</strong><small>{slot.remainingCapacity} remaining · {data.timezone}</small>
      </button>;
    }) : <p className="muted">No public availability is listed for this date.</p>}</div> : null}
    {selected && !paymentPending ? <div className="actions"><button className="button" type="button" disabled={submitting} onClick={() => { void continueBooking(); }}>{submitting ? "Starting booking…" : platformSessionEstablished ? "Continue booking" : "Sign in to continue booking"}</button></div> : null}
    {paymentPending ? <p className="status" role="status">Your slot is reserved and payment is pending. Payment will be available in a future release.</p> : null}
  </section>;
}
