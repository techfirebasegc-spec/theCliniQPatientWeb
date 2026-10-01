"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createDoctorProfile, getDoctorApplication, PlatformApiError, submitDoctorApplication, type DoctorApplication } from "../lib/api";
import { useAuth } from "../providers/AuthProvider";

export function DoctorApplicationPanel() {
  const { user, loading, platformSessionEstablished } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [application, setApplication] = useState<DoctorApplication | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const storageKey = useMemo(() => user ? `cliniq.doctor-application.profile.${user.uid}` : null, [user]);

  useEffect(() => {
    if (!storageKey || !platformSessionEstablished) return;
    const savedProfileId = window.localStorage.getItem(storageKey);
    if (!savedProfileId) return;
    void getDoctorApplication(savedProfileId).then(({ application: current }) => {
      setProfileId(savedProfileId);
      setApplication(current);
    }).catch((error: unknown) => {
      if (error instanceof PlatformApiError && error.status === 401) {
        setProfileId(savedProfileId);
        setMessage("Your secure session has ended. Sign in again and continue your application.");
        return;
      }
      window.localStorage.removeItem(storageKey);
      setProfileId(null);
    });
  }, [platformSessionEstablished, storageKey]);

  async function submit() {
    if (!platformSessionEstablished || !user || !storageKey || !displayName.trim()) return;
    setBusy(true); setMessage(null);
    try {
      let id = profileId;
      if (!id) {
        const profile = await createDoctorProfile(displayName.trim());
        id = profile.id;
        window.localStorage.setItem(storageKey, id);
        setProfileId(id);
      }
      const result = await submitDoctorApplication(id);
      setApplication(result.application);
    } catch (error) {
      setMessage(applicationMessage(error));
    } finally { setBusy(false); }
  }

  if (loading) return <section className="form-card application-card"><p className="auth-status">Checking your sign-in…</p></section>;
  if (!platformSessionEstablished) return <section className="form-card application-card"><p className="eyebrow">Doctor application</p><h1>Sign in to begin your application</h1><p className="section-copy">Use the existing secure The CliniQ sign-in to create or access your application.</p><div className="actions"><Link className="button" href="/sign-in?returnTo=/join-us/doctor">Sign in to continue</Link><Link className="button button--secondary" href="/join-us">Back to Join Us</Link></div></section>;
  if (application) return <ApplicationStatus application={application} busy={busy} onResubmit={() => void submit()} />;

  return <section className="form-card application-card">
    <p className="eyebrow">Doctor application</p><h1>Apply to join The CliniQ</h1>
    <p className="section-copy">Your application is reviewed by The CliniQ Platform Admin. Provider access is available only after approval.</p>
    <form className="application-form" onSubmit={(event) => { event.preventDefault(); void submit(); }}>
      <label className="field"><span>Display name</span><input className="input" autoComplete="name" disabled={busy} value={displayName} onChange={(event) => setDisplayName(event.target.value)} required /></label>
      <p className="field-help">Use the name that should appear on your Doctor profile.</p>
      <button className="button" disabled={busy} type="submit">{busy ? "Submitting…" : "Submit application"}</button>
    </form>
    {message ? <p className="error" role="alert">{message}</p> : null}
  </section>;
}

function ApplicationStatus({ application, busy, onResubmit }: { application: DoctorApplication; busy: boolean; onResubmit: () => void }) {
  if (application.status === "REJECTED") return <section className="form-card application-card"><p className="eyebrow">Doctor application</p><h1>Application needs an update</h1><p className="section-copy">{application.rejectionReason ?? "Your application was not approved. Review the requested update and resubmit when ready."}</p><div className="actions"><button className="button" disabled={busy} onClick={onResubmit}>{busy ? "Resubmitting…" : "Resubmit application"}</button><Link className="button button--secondary" href="/join-us">Back to Join Us</Link></div></section>;
  if (application.status === "APPROVED") return <section className="form-card application-card"><p className="eyebrow">Doctor application</p><h1>Application approved</h1><p className="section-copy">Your Doctor profile has been approved. Continue through the existing Provider sign-in and onboarding process.</p><Link className="button" href="/join-us">Back to Join Us</Link></section>;
  return <section className="form-card application-card"><p className="eyebrow">Doctor application</p><h1>Application submitted</h1><p className="section-copy">Your application is pending Platform Admin review. Provider access is not available until the application is approved.</p><p className="status" role="status">Status: Pending review</p><Link className="button button--secondary" href="/join-us">Back to Join Us</Link></section>;
}

function applicationMessage(error: unknown): string {
  if (error instanceof PlatformApiError && error.status === 409) return "An existing Doctor profile could not be connected to this application from this browser. Please continue using the same browser session or contact The CliniQ support.";
  if (error instanceof PlatformApiError && error.status === 401) return "Your secure session has ended. Sign in again and continue your application.";
  return "We couldn’t submit your Doctor application. Please try again.";
}
