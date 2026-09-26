import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "../../../src/components/site/Breadcrumbs";
import { ServiceCard } from "../../../src/components/site/Cards";
import { Container } from "../../../src/components/site/Container";
import { JsonLd } from "../../../src/components/site/JsonLd";
import { Section } from "../../../src/components/site/Section";
import { SiteLayout } from "../../../src/components/site/SiteLayout";
import { pageMetadata, siteUrlValue } from "../../../src/lib/metadata";
import { publicDoctor } from "../../../src/lib/public-api-server";
type Props = { params: Promise<{ doctorProfileId: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { doctorProfileId } = await params; const data = await publicDoctor(doctorProfileId); return pageMetadata(data?.doctor.displayName ?? "Doctor profile", "View currently published public services for this doctor at The CliniQ.", `/doctors/${encodeURIComponent(doctorProfileId)}`); }
export default async function DoctorDetailPage({ params }: Props) { const { doctorProfileId } = await params; const data = await publicDoctor(doctorProfileId); if (!data) notFound(); const label = data.doctor.displayName ?? "Doctor profile"; return <SiteLayout><Section tint><Container><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Doctors", href: "/doctors" }, { label }]} /><p className="eyebrow">Public doctor profile</p><h1 className="section-heading">{label}</h1><p className="section-copy">This profile displays services that are currently published for public discovery.</p><JsonLd value={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: siteUrlValue }, { "@type": "ListItem", position: 2, name: "Doctors", item: `${siteUrlValue}/doctors` }, { "@type": "ListItem", position: 3, name: label }] }} /></Container></Section><Section><Container><p className="eyebrow">Available services</p><h2 className="section-heading">Explore this doctor&apos;s published services.</h2>{data.services.length ? <div className="grid grid--three">{data.services.map((service) => <ServiceCard service={service} key={service.id} />)}</div> : <p className="directory-empty">No public services are currently listed for this profile.</p>}</Container></Section></SiteLayout>; }
