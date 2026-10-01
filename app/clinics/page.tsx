import { ClinicCard } from "../../src/components/site/Cards";
import { Container } from "../../src/components/site/Container";
import { PageHero } from "../../src/components/site/PageHero";
import { Section } from "../../src/components/site/Section";
import { SiteLayout } from "../../src/components/site/SiteLayout";
import { pageMetadata } from "../../src/lib/metadata";
import { publicClinics } from "../../src/lib/public-api-server";

export const metadata = pageMetadata("Clinics", "Explore clinics with published services and availability at The CliniQ.", "/clinics");

export default async function ClinicsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const clinics = await publicClinics(q);
  return <SiteLayout><PageHero eyebrow="Public directory" title="Explore clinics" description="Browse clinics with published services and availability." /><Section><Container><div className="directory-toolbar"><div><p className="eyebrow">Available clinics</p><h2 className="section-heading">Find care near your preferred clinic.</h2></div><form className="search-form"><label className="field"><span className="muted">Search by clinic name</span><input className="input" name="q" defaultValue={q} /></label><button className="button">Search</button></form></div>{clinics.length ? <div className="grid grid--three">{clinics.map((clinic) => <ClinicCard clinic={clinic} key={clinic.id} />)}</div> : <p className="directory-empty">No public clinics are available right now. Published clinics will appear here when available.</p>}</Container></Section></SiteLayout>;
}
