"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getClinicApplication, PlatformApiError, submitClinicApplication, type ClinicApplication } from "../lib/api";
import { useAuth } from "../providers/AuthProvider";

export function ClinicApplicationPanel() {
  const { loading, platformSessionEstablished } = useAuth();
  const [application, setApplication] = useState<ClinicApplication | null>(null);
  const [legalName, setLegalName] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!platformSessionEstablished) return;
    void getClinicApplication().then(({ application: current }) => {
      setApplication(current); setLegalName(current.legalName); setClinicName(current.clinicName); setOwnerEmail(current.ownerEmail);
    }).catch((error: unknown) => {
      if (error instanceof PlatformApiError && error.status === 401) {
        setMessage("Your secure session has ended. Sign in again to continue.");
      } else if (!(error instanceof PlatformApiError && error.status === 404)) {
        setMessage("We couldn’t load your Clinic application.");
      }
    });
  }, [platformSessionEstablished]);

  async function submit() {
    if (!platformSessionEstablished || !legalName.trim() || !clinicName.trim() || !ownerEmail.trim()) return;
    setBusy(true); setMessage(null);
    try { const result = await submitClinicApplication({ legalName: legalName.trim(), clinicName: clinicName.trim(), ownerEmail: ownerEmail.trim() }); setApplication(result.application); }
    catch (error) { setMessage(error instanceof PlatformApiError && error.status === 409 ? "Your application cannot be changed while it is pending or approved." : error instanceof PlatformApiError && error.status === 401 ? "Your secure session has ended. Sign in again to continue." : "We couldn’t submit your Clinic application. Please try again."); }
    finally { setBusy(false); }
  }

  if (loading) return <section className="form-card application-card"><p className="auth-status">Checking your sign-in…</p></section>;
  if (!platformSessionEstablished) return <section className="form-card application-card"><p className="eyebrow">Clinic application</p><h1>Sign in to begin your application</h1><p className="section-copy">Use the existing secure The CliniQ sign-in to submit and review your Clinic application.</p><div className="actions"><Link className="button" href="/sign-in?returnTo=/join-us/clinic">Sign in to continue</Link><Link className="button button--secondary" href="/join-us">Back to Join Us</Link></div></section>;
  if (application?.status === "PENDING" || application?.status === "APPROVED") return <Status application={application} />;
  return <section className="form-card application-card"><p className="eyebrow">Clinic application</p><h1>{application ? "Update your Clinic application" : "Apply to join The CliniQ"}</h1><p className="section-copy">A Platform Admin reviews your application. Approval creates the existing Clinic Owner invitation; clinic activation happens separately after owner onboarding.</p>{application?.rejectionReason ? <p className="error">Previous review: {application.rejectionReason}</p> : null}<form className="application-form" onSubmit={(event) => { event.preventDefault(); void submit(); }}><div className="form-grid"><label className="field"><span>Clinic name</span><input className="input" disabled={busy} value={clinicName} onChange={(event) => setClinicName(event.target.value)} required /></label><label className="field"><span>Legal name</span><input className="input" disabled={busy} value={legalName} onChange={(event) => setLegalName(event.target.value)} required /></label><label className="field field--full"><span>Clinic Owner email</span><input className="input" autoComplete="email" disabled={busy} type="email" value={ownerEmail} onChange={(event) => setOwnerEmail(event.target.value)} required /></label></div><p className="field-help">Use the email address that will receive the existing Clinic Owner invitation after approval.</p><button className="button" disabled={busy} type="submit">{busy ? "Submitting…" : application ? "Resubmit application" : "Submit application"}</button></form>{message ? <p className="error" role="alert">{message}</p> : null}</section>;
}

function Status({ application }: { application: ClinicApplication }) {
  if (application.status === "APPROVED") return <section className="form-card application-card"><p className="eyebrow">Clinic application</p><h1>Application approved</h1><p className="section-copy">The existing Clinic Owner invitation process has been started for {application.ownerEmail}. The clinic remains DRAFT until owner onboarding is complete and a Platform Admin performs the separate activation step.</p><Link className="button button--secondary" href="/join-us">Back to Join Us</Link></section>;
  return <section className="form-card application-card"><p className="eyebrow">Clinic application</p><h1>Application submitted</h1><p className="section-copy">Your Clinic application is pending Platform Admin review. No clinic, tenant, invitation, or Provider access is created while it is pending.</p><p className="status" role="status">Status: Pending review</p><Link className="button button--secondary" href="/join-us">Back to Join Us</Link></section>;
}
