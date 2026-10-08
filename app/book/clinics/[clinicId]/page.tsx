import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Breadcrumbs } from "../../../../src/components/site/Breadcrumbs";
import { Container } from "../../../../src/components/site/Container";
import { Section } from "../../../../src/components/site/Section";
import { SiteLayout } from "../../../../src/components/site/SiteLayout";
import { publicClinic } from "../../../../src/lib/public-api-server";

export default async function ClinicBookingContext({ params }: { params: Promise<{ clinicId: string }> }) {
  const { clinicId: slug } = await params; const data = await publicClinic(slug); if (!data) notFound();
  if (data.services.length === 1) redirect(`/services/offering/${encodeURIComponent(data.services[0].id)}`);
  return <SiteLayout><Section tint><Container><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Clinics", href: "/clinics" }, { label: data.clinic.displayName, href: `/clinics/${encodeURIComponent(slug)}` }, { label: "Book appointment" }]} /><p className="eyebrow">Book an appointment</p><h1 className="section-heading">Choose a service</h1><p className="section-copy">Select the service you would like to book with {data.clinic.displayName}.</p></Container></Section><Section><Container><div className="grid grid--three">{data.services.map((service) => <Link className="card card-link service-card" href={`/services/offering/${encodeURIComponent(service.id)}`} key={service.id}><p className="eyebrow">Healthcare service</p><h2>{service.name}</h2><p>{service.description ?? "View available appointment times."}</p><div className="card-bottom"><span>Choose service</span><span aria-hidden="true">↗</span></div></Link>)}</div></Container></Section></SiteLayout>;
}
