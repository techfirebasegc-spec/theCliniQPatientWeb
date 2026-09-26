import { DoctorCard } from "../../src/components/site/Cards";
import { Container } from "../../src/components/site/Container";
import { PageHero } from "../../src/components/site/PageHero";
import { Section } from "../../src/components/site/Section";
import { SiteLayout } from "../../src/components/site/SiteLayout";
import { pageMetadata } from "../../src/lib/metadata";
import { publicDoctors } from "../../src/lib/public-api-server";
export const metadata = pageMetadata("Doctors", "Explore currently available public doctor profiles at The CliniQ.", "/doctors");
export default async function DoctorsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) { const { q } = await searchParams; const doctors = await publicDoctors(q); return <SiteLayout><PageHero eyebrow="Public directory" title="Explore doctors" description="Browse currently published doctor profiles and their available public services." /><Section><Container><div className="directory-toolbar"><div><p className="eyebrow">Available profiles</p><h2 className="section-heading">Find the right starting point.</h2></div><form className="search-form"><label className="field"><span className="muted">Search by name</span><input className="input" name="q" defaultValue={q} /></label><button className="button">Search</button></form></div>{doctors.length ? <div className="grid grid--three">{doctors.map((doctor) => <DoctorCard doctor={doctor} key={doctor.id} />)}</div> : <p className="directory-empty">No public doctor profiles are available right now. Published profiles will appear here when available.</p>}</Container></Section></SiteLayout>; }
