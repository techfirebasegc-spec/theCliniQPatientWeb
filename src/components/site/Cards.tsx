import Link from "next/link";
import type { PublicClinic, PublicDoctor, PublicService } from "../../lib/api";

function price(service: PublicService) {
  const currency = service.currency || "INR";
  const digits = new Intl.NumberFormat(undefined, { style: "currency", currency }).resolvedOptions().maximumFractionDigits ?? 0;
  if (!/^\d+$/.test(service.amountMinor)) return `${currency} ${service.amountMinor}`;
  const padded = service.amountMinor.padStart(digits + 1, "0");
  return `${currency} ${digits ? `${padded.slice(0, -digits)}.${padded.slice(-digits)}` : padded}`;
}
export function DoctorCard({ doctor }: { doctor: PublicDoctor }) {
  return <Link className="card card-link doctor-card" href={`/doctors/${encodeURIComponent(doctor.id)}`}>
    <div className="doctor-card-top"><span className="profile-symbol" aria-hidden="true"><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="24" cy="17" r="7" /><path d="M10 40v-5c0-7 6-11 14-11s14 4 14 11v5M17 26v9m14-9v9" /><circle cx="17" cy="37" r="2" /><path d="M28 38v-3h6v3" /></svg></span><span className="eyebrow">Doctor profile</span></div>
    <h3>{doctor.displayName ?? "Doctor profile"}</h3><p>Explore this doctor’s listed services and availability.</p><div className="card-bottom"><span>View profile</span><span aria-hidden="true">↗</span></div>
  </Link>;
}
export function ServiceCard({ service }: { service: PublicService }) {
  return <Link className="card card-link service-card" href={`/services/${encodeURIComponent(service.id)}`}><p className="eyebrow">Healthcare service</p><h3>{service.name}</h3><p>{service.description ?? "Explore service details and current availability."}</p><div className="card-bottom"><span>{price(service)}</span><span>View service <span aria-hidden="true">↗</span></span></div></Link>;
}
export function ClinicCard({ clinic }: { clinic: PublicClinic }) {
  return <Link className="card card-link" href={`/clinics/${encodeURIComponent(clinic.id)}`}><p className="eyebrow">Clinic</p><h3>{clinic.displayName}</h3><p>Explore this clinic&apos;s published services and availability.</p><div className="card-bottom"><span>View clinic</span><span aria-hidden="true">↗</span></div></Link>;
}
export function SpecialtyCard({ title, description, slug }: { title: string; description: string; slug: string }) {
  return <Link className="card card-link" href={`/specialties/${slug}`}><p className="eyebrow">Explore care</p><h3>{title}</h3><p>{description}</p><div className="card-bottom"><span>Learn more</span><span aria-hidden="true">↗</span></div></Link>;
}
