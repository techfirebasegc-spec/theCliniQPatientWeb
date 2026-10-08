import { Container } from "../../src/components/site/Container";
import { PageHero } from "../../src/components/site/PageHero";
import { Section } from "../../src/components/site/Section";
import { SiteLayout } from "../../src/components/site/SiteLayout";
import { pageMetadata } from "../../src/lib/metadata";
export const metadata = pageMetadata("Specialties", "Specialty discovery is being prepared at The CliniQ.", "/specialties");
export default function SpecialtiesPage() { return <SiteLayout><PageHero eyebrow="Care discovery" title="Specialty discovery is being prepared" description="Approved specialty information will appear here when a reviewed source is available." /><Section><Container><div className="discovery-empty"><div><h2>Explore care through services today</h2><p>Specialty categories are not available yet. You can browse the published services and doctors currently listed on The CliniQ.</p></div></div></Container></Section></SiteLayout>; }
