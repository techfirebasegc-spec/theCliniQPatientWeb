"use client";

import Link from "next/link";
import { useAuth } from "../../providers/AuthProvider";

function value(value: string | null | undefined) { return value?.trim() || "Not provided"; }
function date(value: string | null | undefined) { if (!value) return "Not provided"; const parsed = new Date(value); return Number.isNaN(parsed.getTime()) ? "Not provided" : parsed.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" }); }
function ProfileItem({ label, children }: { label: string; children: string }) { return <div className="patient-profile-item"><dt>{label}</dt><dd>{children}</dd></div>; }

export function PatientAccount() {
  const { user, loading, patientProfile, platformSessionEstablished } = useAuth();

  if (loading) return <p className="status" role="status">Checking your secure session…</p>;
  if (!user || !platformSessionEstablished) return <SignedOutAccount />;

  const name = patientProfile?.displayName ?? user.displayName;
  return <div className="patient-profile">
    <section className="patient-profile-intro"><p className="eyebrow">Patient account</p><h2>My Profile</h2><p>Review the information associated with your secure patient account.</p></section>
    <div className="patient-profile-grid">
      <section className="patient-profile-card"><p className="eyebrow">Personal information</p><h3>About you</h3><dl><ProfileItem label="Full name">{value(name)}</ProfileItem><ProfileItem label="Date of birth">Not provided</ProfileItem><ProfileItem label="Gender / sex">Not provided</ProfileItem></dl></section>
      <section className="patient-profile-card"><p className="eyebrow">Contact information</p><h3>How we reach you</h3><dl><ProfileItem label="Email">{value(user.email)}</ProfileItem><ProfileItem label="Mobile / phone">{value(user.phoneNumber)}</ProfileItem></dl></section>
      <section className="patient-profile-card"><p className="eyebrow">Account information</p><h3>Your account</h3><dl><ProfileItem label="Profile status">{patientProfile?.status ?? "Not provided"}</ProfileItem><ProfileItem label="Account created">{date(user.metadata.creationTime)}</ProfileItem></dl></section>
      <section className="patient-profile-card patient-profile-card--appointments"><p className="eyebrow">Appointments</p><h3>Your care history</h3><p>View upcoming and past appointments from your secure account.</p><Link className="text-link" href="/appointments">My appointments →</Link></section>
    </div>
  </div>;
}

function SignedOutAccount() {
  return <section className="card account-card">
    <p className="eyebrow">Patient account</p><h2>Sign in to view your profile</h2><p>Your profile and appointments are available after you sign in securely.</p>
    <div className="actions"><Link className="button" href="/sign-in?returnTo=/account">Sign in</Link></div>
  </section>;
}
