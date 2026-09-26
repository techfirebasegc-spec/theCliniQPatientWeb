import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AvailabilityPanel } from "../../../src/components/site/AvailabilityPanel";
import { Breadcrumbs } from "../../../src/components/site/Breadcrumbs";
import { Container } from "../../../src/components/site/Container";
import { JsonLd } from "../../../src/components/site/JsonLd";
import { Section } from "../../../src/components/site/Section";
import { SiteLayout } from "../../../src/components/site/SiteLayout";
import { pageMetadata, siteUrlValue } from "../../../src/lib/metadata";
import { publicService } from "../../../src/lib/public-api-server";
type Props = { params: Promise<{ serviceExposureId: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { serviceExposureId } = await params; const service = await publicService(serviceExposureId); return pageMetadata(service?.name ?? "Service", "View public service information and availability at The CliniQ.", `/services/${encodeURIComponent(serviceExposureId)}`); }
export default async function ServiceDetailPage({ params }: Props) { const { serviceExposureId } = await params; const service = await publicService(serviceExposureId); if (!service) notFound(); return <SiteLayout><Section tint><Container><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Services", href: "/services" }, { label: service.name }]} /><p className="eyebrow">Public service</p><h1 className="section-heading">{service.name}</h1>{service.description ? <p className="section-copy">{service.description}</p> : <p className="section-copy">Published service details are shown as they become available.</p>}<JsonLd value={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: siteUrlValue }, { "@type": "ListItem", position: 2, name: "Services", item: `${siteUrlValue}/services` }, { "@type": "ListItem", position: 3, name: service.name }] }} /></Container></Section><Section><Container><AvailabilityPanel serviceExposureId={service.id} /></Container></Section></SiteLayout>; }
