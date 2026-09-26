import { ServiceCard } from "../../src/components/site/Cards";
import { Container } from "../../src/components/site/Container";
import { PageHero } from "../../src/components/site/PageHero";
import { Section } from "../../src/components/site/Section";
import { SiteLayout } from "../../src/components/site/SiteLayout";
import { pageMetadata } from "../../src/lib/metadata";
import { publicServices } from "../../src/lib/public-api-server";
export const metadata = pageMetadata("Services", "Explore currently available public services at The CliniQ.", "/services");
export default async function ServicesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) { const { q } = await searchParams; const services = await publicServices(q); return <SiteLayout><PageHero eyebrow="Public directory" title="Explore services" description="Browse currently published service information and public availability." /><Section><Container><div className="directory-toolbar"><div><p className="eyebrow">Available services</p><h2 className="section-heading">Learn what is currently listed.</h2></div><form className="search-form"><label className="field"><span className="muted">Search services</span><input className="input" name="q" defaultValue={q} /></label><button className="button">Search</button></form></div>{services.length ? <div className="grid grid--three">{services.map((service) => <ServiceCard service={service} key={service.id} />)}</div> : <p className="directory-empty">No public services are available right now. Published services will appear here when available.</p>}</Container></Section></SiteLayout>; }
