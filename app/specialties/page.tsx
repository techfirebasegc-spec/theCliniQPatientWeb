import { SpecialtyCard } from "../../src/components/site/Cards";
import { Container } from "../../src/components/site/Container";
import { PageHero } from "../../src/components/site/PageHero";
import { Section } from "../../src/components/site/Section";
import { SiteLayout } from "../../src/components/site/SiteLayout";
import { specialties } from "../../src/content/public-content";
import { pageMetadata } from "../../src/lib/metadata";
export const metadata = pageMetadata("Specialties", "Explore future specialty information at The CliniQ.", "/specialties");
export default function SpecialtiesPage() { return <SiteLayout><PageHero eyebrow="Information hub" title="Specialties" description="This area is structured for approved specialty information as that content becomes available." /><Section><Container><div className="grid grid--three">{specialties.map((specialty) => <SpecialtyCard {...specialty} key={specialty.slug} />)}</div></Container></Section></SiteLayout>; }
