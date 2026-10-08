import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AvailabilityPanel } from "../../../../src/components/site/AvailabilityPanel";
import { Breadcrumbs } from "../../../../src/components/site/Breadcrumbs";
import { Container } from "../../../../src/components/site/Container";
import { JsonLd } from "../../../../src/components/site/JsonLd";
import { ProfileSummary } from "../../../../src/components/site/ProfileSummary";
import { Section } from "../../../../src/components/site/Section";
import { ShareButton } from "../../../../src/components/site/ShareButton";
import { SiteLayout } from "../../../../src/components/site/SiteLayout";
import { pageMetadata, siteUrlValue } from "../../../../src/lib/metadata";
import { publicClinic, publicClinics, publicDoctor, publicDoctors, publicEligibleDoctors, publicService } from "../../../../src/lib/public-api-server";
import { publicPresentation } from "../../../../src/lib/public-presentation";
import type { PublicPresentation } from "../../../../src/lib/api";

type Props = { params: Promise<{ serviceExposureId: string }>; searchParams: Promise<{ doctor?: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { serviceExposureId } = await params; const service = await publicService(serviceExposureId); return { ...pageMetadata(`Book ${service?.name ?? "an appointment"}`, "Choose an available appointment time with The CliniQ.", `/services/offering/${encodeURIComponent(serviceExposureId)}`), robots: { index: false, follow: true } }; }

export default async function ServiceOfferingPage({ params, searchParams }: Props) {
  const { serviceExposureId } = await params; const { doctor: requestedDoctorSlug } = await searchParams; const service = await publicService(serviceExposureId); if (!service) notFound();
  let providerName: string; let presentation: PublicPresentation;
  if (service.provider.kind === "DOCTOR") { const doctorProfileId = service.provider.doctorProfileId; const reference = (await publicDoctors()).find((doctor) => doctor.id === doctorProfileId); const profile = reference ? await publicDoctor(reference.slug) : null; if (!profile) notFound(); providerName = profile.doctor.displayName ?? "Doctor"; presentation = profile.presentation; }
  else { const clinicId = service.provider.clinicId; const reference = (await publicClinics()).find((clinic) => clinic.id === clinicId); const profile = reference ? await publicClinic(reference.slug) : null; if (!profile) notFound(); providerName = profile.clinic.displayName; presentation = profile.presentation; }
  const eligibleDoctors = service.provider.kind === "CLINIC" ? await publicEligibleDoctors(service.id) : [];
  const validRequestedDoctor = requestedDoctorSlug && eligibleDoctors.some((doctor) => doctor.slug === requestedDoctorSlug) ? requestedDoctorSlug : undefined;
  const bookingPath = `/services/offering/${encodeURIComponent(service.id)}`;
  const resolvedPresentation = publicPresentation(presentation), hero = resolvedPresentation.assets.find((asset) => asset.kind === "HERO_IMAGE"), background = resolvedPresentation.assets.find((asset) => asset.kind === "BACKGROUND_IMAGE"), logo = resolvedPresentation.assets.find((asset) => asset.kind === "LOGO"), centered = resolvedPresentation.layoutOptions.heroLayout === "centered", style = { "--presentation-primary": resolvedPresentation.primaryColor ?? "#14345e", "--presentation-accent": resolvedPresentation.accentColor ?? "#13796b", "--presentation-surface": resolvedPresentation.secondaryColor ?? "#edf5f3" } as React.CSSProperties;
  return <SiteLayout><main className={`booking-presentation template-${resolvedPresentation.templateKey}${centered ? " layout-centered" : ""}`} style={style}>{background ? <img className="presentation-background" src={background.url} alt="" /> : null}<Section tint><Container><div className={`booking-presentation-hero${hero ? " booking-presentation-has-hero-image" : ""}`}>{hero ? <img className="presentation-hero-image" src={hero.url} alt="" /> : null}{logo ? <img className="presentation-logo" src={logo.url} alt="" /> : null}<div className="booking-presentation-content"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Services", href: "/services" }, { label: service.name }]} /><p className="eyebrow">Book an appointment</p><h1 className="section-heading">{service.name}</h1>{service.description ? <div className="booking-description"><p className="eyebrow">About this service</p><ProfileSummary expandLabel="Read more" collapseLabel="Read less">{service.description}</ProfileSummary></div> : null}<div className="booking-hero-actions"><ShareButton href={bookingPath} title={`Book ${service.name} | The CliniQ`} /></div></div></div><JsonLd value={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: siteUrlValue }, { "@type": "ListItem", position: 2, name: "Services", item: `${siteUrlValue}/services` }, { "@type": "ListItem", position: 3, name: service.name }] }} /></Container></Section><Section><Container><AvailabilityPanel serviceExposureId={service.id} serviceName={service.name} provider={{ kind: service.provider.kind, name: providerName }} presentation={resolvedPresentation} eligibleDoctors={eligibleDoctors} preferredDoctorSlug={validRequestedDoctor} /></Container></Section></main></SiteLayout>;
}
