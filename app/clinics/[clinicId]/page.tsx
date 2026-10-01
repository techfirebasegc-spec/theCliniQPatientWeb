import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "../../../src/components/site/Breadcrumbs";
import { ServiceCard } from "../../../src/components/site/Cards";
import { Container } from "../../../src/components/site/Container";
import { Section } from "../../../src/components/site/Section";
import { SiteLayout } from "../../../src/components/site/SiteLayout";
import { pageMetadata } from "../../../src/lib/metadata";
import { publicClinic } from "../../../src/lib/public-api-server";

type Props = { params: Promise<{ clinicId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { clinicId } = await params;
  const data = await publicClinic(clinicId);
  return pageMetadata(data?.clinic.displayName ?? "Clinic", "View published clinic services and availability at The CliniQ.", `/clinics/${encodeURIComponent(clinicId)}`);
}

export default async function ClinicDetailPage({ params }: Props) {
  const { clinicId } = await params;
  const data = await publicClinic(clinicId);
  if (!data) notFound();
  return <SiteLayout><Section tint><Container><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Clinics", href: "/clinics" }, { label: data.clinic.displayName }]} /><p className="eyebrow">Public clinic</p><h1 className="section-heading">{data.clinic.displayName}</h1><p className="section-copy">Explore services currently published by this clinic.</p></Container></Section><Section><Container><p className="eyebrow">Available services</p><h2 className="section-heading">Choose a service to view actual availability.</h2>{data.services.length ? <div className="grid grid--three">{data.services.map((service) => <ServiceCard service={service} key={service.id} />)}</div> : <p className="directory-empty">No public services are currently listed for this clinic.</p>}</Container></Section></SiteLayout>;
}
