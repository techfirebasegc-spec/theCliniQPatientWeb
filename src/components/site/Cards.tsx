import Link from "next/link";
import type { ReactNode } from "react";
import type { PublicCatalogProvider, PublicCatalogService, PublicClinic, PublicClinicReference, PublicDoctor, PublicDoctorReference, PublicProfileService, PublicService } from "../../lib/api";
import { ShareButton } from "./ShareButton";

type CardProps = { children: ReactNode; className?: string };
export function CardContainer({ children, className = "" }: CardProps) { return <article className={`professional-card ${className}`.trim()}>{children}</article>; }
export function CardHeader({ label, shareHref, shareTitle, shareLabel }: { label: string; shareHref?: string; shareTitle?: string; shareLabel?: string }) { return <header className="professional-card-header"><p className="eyebrow">{label}</p>{shareHref && shareTitle ? <ShareButton variant="compact" href={shareHref} title={shareTitle} ariaLabel={shareLabel ?? `Share ${shareTitle}`} /> : null}</header>; }
export function CardMetadata({ children }: { children: ReactNode }) { return <div className="professional-card-metadata">{children}</div>; }
export function CardActions({ children }: { children: ReactNode }) { return <footer className="professional-card-actions">{children}</footer>; }

function ServiceIcon({ serviceName }: { serviceName: string }) {
  const normalizedName = serviceName.toLowerCase();
  if (normalizedName.includes("home visit")) return <path d="M4 11.5 12 5l8 6.5V20H4v-8.5ZM9 20v-5h6v5" />;
  if (normalizedName.includes("physiotherapy") || normalizedName.includes("physio")) return <path d="M13 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM10 9l2-1 2 1 2 3M12 8v5l-3 3M12 13l4 2 2 4M9 20l2-4" />;
  return <path d="M9 4v5a3 3 0 0 0 6 0V4M12 12v8M8 20h8M5 6h4M15 6h4" />;
}

function IdentityMark({ kind, serviceName }: { kind: "service" | "clinic"; serviceName?: string }) { return <span className={`card-identity-mark card-identity-mark--${kind}`} aria-hidden="true"><svg viewBox="0 0 24 24">{kind === "service" ? <ServiceIcon serviceName={serviceName ?? ""} /> : <path d="M4 20V9l8-5 8 5v11M9 20v-5h6v5M8 10h.01M12 10h.01M16 10h.01" />}</svg></span>; }
function CardStat({ children }: { children: ReactNode }) { return <span className="card-stat">{children}</span>; }

export function formatPublicServicePrice(service: Pick<PublicService, "currency" | "amountMinor">) {
  const currency = service.currency || "INR";
  const digits = new Intl.NumberFormat("en-IN", { style: "currency", currency }).resolvedOptions().maximumFractionDigits ?? 0;
  if (!/^\d+$/.test(service.amountMinor)) return `${currency} ${service.amountMinor}`;
  const padded = service.amountMinor.padStart(digits + 1, "0");
  const amount = digits ? `${padded.slice(0, -digits)}.${padded.slice(-digits)}` : padded;
  return currency === "INR" ? `₹${amount}` : `${currency} ${amount}`;
}

function DoctorPhoto({ doctor }: { doctor?: Pick<PublicDoctor, "displayName" | "photo"> }) { return doctor?.photo?.url ? <img className="card-avatar" src={doctor.photo.url} alt={`${doctor.displayName ?? "Doctor"} profile photo`} /> : <span className="card-avatar card-avatar--fallback" aria-hidden="true">Dr</span>; }
function ClinicPhoto({ clinic }: { clinic: Pick<PublicClinic, "displayName" | "photo"> }) { return clinic.photo?.url ? <img className="card-avatar card-avatar--clinic" src={clinic.photo.url} alt={`${clinic.displayName} profile photo`} /> : <IdentityMark kind="clinic" />; }

export function DoctorCard({ doctor }: { doctor: Pick<PublicDoctor, "slug" | "displayName" | "specialties" | "photo"> }) {
  const href = `/doctors/${encodeURIComponent(doctor.slug)}`; const name = doctor.displayName ?? "Doctor profile";
  return <CardContainer className="doctor-card"><CardHeader label="Doctor" shareHref={href} shareTitle={`${name} | The CliniQ`} shareLabel={`Share ${name}`} /><div className="professional-card-identity"><DoctorPhoto doctor={doctor} /><div><h3>{name}</h3>{doctor.specialties?.length ? <p className="card-specialty">{doctor.specialties.join(" · ")}</p> : null}</div></div><p className="card-description">Explore this doctor&apos;s listed services and appointment availability.</p><CardActions><Link className="card-action card-action--secondary" href={href}>View profile</Link></CardActions></CardContainer>;
}

export function ServiceCard({ service, href }: { service: Pick<PublicService | PublicProfileService, "id" | "name" | "description" | "currency" | "amountMinor">; href?: string }) {
  const cardHref = href ?? `/services/offering/${encodeURIComponent(service.id)}`; const hasPrice = Boolean(service.currency) && /^\d+$/.test(service.amountMinor);
  return <CardContainer className="service-card"><CardHeader label="Healthcare service" shareHref={cardHref} shareTitle={`${service.name} | The CliniQ`} shareLabel={`Share ${service.name}`} /><div className="professional-card-identity"><IdentityMark kind="service" serviceName={service.name} /><h3>{service.name}</h3></div><p className="card-description">{service.description ?? "Explore service details and appointment availability."}</p>{hasPrice ? <CardMetadata><CardStat><strong>From {formatPublicServicePrice(service)}</strong></CardStat></CardMetadata> : null}<CardActions><Link className="card-action card-action--primary" href={cardHref}>View service →</Link></CardActions></CardContainer>;
}

export function CatalogServiceCard({ service }: { service: PublicCatalogService }) {
  const href = `/services/${encodeURIComponent(service.slug)}`; const counts = [service.doctorCount ? `${service.doctorCount} ${service.doctorCount === 1 ? "doctor" : "doctors"}` : null, service.clinicCount ? `${service.clinicCount} ${service.clinicCount === 1 ? "clinic" : "clinics"}` : null].filter(Boolean);
  return <CardContainer className="service-card"><CardHeader label="Healthcare service" shareHref={href} shareTitle={`${service.name} | The CliniQ`} shareLabel={`Share ${service.name}`} /><div className="professional-card-identity"><IdentityMark kind="service" serviceName={service.name} /><h3>{service.name}</h3></div><p className="card-description">{service.description ?? "Find doctors and clinics offering this service."}</p><CardMetadata>{service.startingPrice ? <CardStat><strong>From {formatPublicServicePrice(service.startingPrice)}</strong></CardStat> : null}{counts.map((count) => <CardStat key={count}>{count}</CardStat>)}</CardMetadata><CardActions><Link className="card-action card-action--primary" href={href}>View providers →</Link></CardActions></CardContainer>;
}

export function ClinicServiceCard({ clinic, service }: { clinic: Pick<PublicClinic, "slug" | "displayName" | "address" | "photo">; service: Pick<PublicProfileService, "id" | "name" | "description" | "currency" | "amountMinor"> }) {
  const profileHref = `/clinics/${encodeURIComponent(clinic.slug)}`; const bookingHref = `/services/offering/${encodeURIComponent(service.id)}`; const location = clinic.address ? [clinic.address.locality, clinic.address.region].filter(Boolean).join(", ") : null;
  return <CardContainer className="clinic-service-card"><CardHeader label="Clinic" shareHref={profileHref} shareTitle={`${clinic.displayName} | The CliniQ`} shareLabel={`Share ${clinic.displayName}`} /><div className="professional-card-identity"><ClinicPhoto clinic={clinic} /><div><h3>{clinic.displayName}</h3><p className="card-service-name">{service.name}</p></div></div><p className="card-description">{service.description ?? "View this clinic service and available appointment times."}</p><CardMetadata>{/^[0-9]+$/.test(service.amountMinor) ? <CardStat><strong>{formatPublicServicePrice(service)} consultation fee</strong></CardStat> : null}{location ? <CardStat>{location}</CardStat> : null}</CardMetadata><CardActions><Link className="card-action card-action--primary" href={bookingHref}>Book appointment →</Link><Link className="card-action card-action--secondary" href={profileHref}>View clinic</Link></CardActions></CardContainer>;
}

export function DoctorServiceCard({ provider, serviceName, doctor }: { provider: PublicCatalogProvider; serviceName: string; doctor?: Pick<PublicDoctor, "displayName" | "specialties" | "photo"> }) {
  const profileHref = `/doctors/${encodeURIComponent(provider.slug)}`; const bookingHref = `/services/offering/${encodeURIComponent(provider.serviceExposureId)}`;
  return <CardContainer className="doctor-card"><CardHeader label="Doctor" shareHref={profileHref} shareTitle={`${provider.displayName} | The CliniQ`} shareLabel={`Share ${provider.displayName}`} /><div className="professional-card-identity"><DoctorPhoto doctor={doctor ?? { displayName: provider.displayName, photo: null }} /><div><h3>{provider.displayName}</h3>{doctor?.specialties?.length ? <p className="card-specialty">{doctor.specialties.join(" · ")}</p> : null}</div></div><p className="card-service-name">{serviceName}</p><CardMetadata><CardStat><strong>From {formatPublicServicePrice(provider.price)}</strong></CardStat></CardMetadata><CardActions><Link className="card-action card-action--primary" href={bookingHref}>Book appointment →</Link><Link className="card-action card-action--secondary" href={profileHref}>View profile</Link></CardActions></CardContainer>;
}

export function ClinicProviderCard({ provider, serviceName }: { provider: PublicCatalogProvider; serviceName: string }) {
  const profileHref = `/clinics/${encodeURIComponent(provider.slug)}`; const bookingHref = `/services/offering/${encodeURIComponent(provider.serviceExposureId)}`;
  return <CardContainer className="clinic-service-card"><CardHeader label="Clinic" shareHref={profileHref} shareTitle={`${provider.displayName} | The CliniQ`} shareLabel={`Share ${provider.displayName}`} /><div className="professional-card-identity"><IdentityMark kind="clinic" /><div><h3>{provider.displayName}</h3><p className="card-service-name">{serviceName}</p></div></div><p className="card-description">Book this published clinic service or view the clinic profile.</p><CardMetadata><CardStat><strong>{formatPublicServicePrice(provider.price)} consultation fee</strong></CardStat></CardMetadata><CardActions><Link className="card-action card-action--primary" href={bookingHref}>Book appointment →</Link><Link className="card-action card-action--secondary" href={profileHref}>View clinic</Link></CardActions></CardContainer>;
}

export function ClinicCard({ clinic }: { clinic: Pick<PublicClinic, "slug" | "displayName" | "address" | "photo" | "about"> }) {
  const href = `/clinics/${encodeURIComponent(clinic.slug)}`; const location = clinic.address ? [clinic.address.locality, clinic.address.region].filter(Boolean).join(", ") : null;
  return <CardContainer className="clinic-card"><CardHeader label="Clinic" shareHref={href} shareTitle={`${clinic.displayName} | The CliniQ`} shareLabel={`Share ${clinic.displayName}`} /><div className="professional-card-identity"><ClinicPhoto clinic={clinic} /><h3>{clinic.displayName}</h3></div><p className="card-description">{clinic.about ?? "Explore this clinic&apos;s published services and appointment availability."}</p><CardMetadata>{location ? <CardStat>{location}</CardStat> : null}</CardMetadata><CardActions><Link className="card-action card-action--primary" href={href}>View clinic →</Link></CardActions></CardContainer>;
}

export function DoctorReferenceCard({ doctor }: { doctor: PublicDoctorReference }) { return <DoctorCard doctor={{ ...doctor, specialties: [], photo: null }} />; }
export function ClinicReferenceCard({ clinic }: { clinic: PublicClinicReference }) { return <ClinicCard clinic={{ ...clinic, address: null, photo: null, about: null }} />; }
export function SpecialtyCard({ title, description, slug }: { title: string; description: string; slug: string }) { return <CardContainer><CardHeader label="Explore care" /><h3>{title}</h3><p className="card-description">{description}</p><CardActions><Link className="card-action card-action--primary" href={`/specialties/${slug}`}>Learn more →</Link></CardActions></CardContainer>; }
