import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Breadcrumbs } from "../../../../src/components/site/Breadcrumbs";
import { Container } from "../../../../src/components/site/Container";
import { Section } from "../../../../src/components/site/Section";
import { SiteLayout } from "../../../../src/components/site/SiteLayout";
import { publicDoctor } from "../../../../src/lib/public-api-server";

export default async function DoctorBookingContext({ params }: { params: Promise<{ doctorProfileId: string }> }) {
  const { doctorProfileId: slug } = await params; const data = await publicDoctor(slug); if (!data) notFound();
  const suffix = `?doctor=${encodeURIComponent(slug)}`;
  if (data.services.length === 1) redirect(`/services/offering/${encodeURIComponent(data.services[0].id)}${suffix}`);
  const name = data.doctor.displayName ?? "this doctor";
  return <SiteLayout><Section tint><Container><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Doctors", href: "/doctors" }, { label: name, href: `/doctors/${encodeURIComponent(slug)}` }, { label: "Book appointment" }]} /><p className="eyebrow">Book an appointment</p><h1 className="section-heading">Choose a service</h1><p className="section-copy">Select the service you would like to book with {name}.</p></Container></Section><Section><Container><div className="grid grid--three">{data.services.map((service) => <Link className="card card-link service-card" href={`/services/offering/${encodeURIComponent(service.id)}${suffix}`} key={service.id}><p className="eyebrow">Healthcare service</p><h2>{service.name}</h2><p>{service.description ?? "View available appointment times."}</p><div className="card-bottom"><span>Choose service</span><span aria-hidden="true">↗</span></div></Link>)}</div></Container></Section></SiteLayout>;
}
