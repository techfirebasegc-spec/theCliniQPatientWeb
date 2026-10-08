import { PatientAccount } from "../../src/components/site/PatientAccount";
import { Container } from "../../src/components/site/Container";
import { PageHero } from "../../src/components/site/PageHero";
import { Section } from "../../src/components/site/Section";
import { SiteLayout } from "../../src/components/site/SiteLayout";
import { pageMetadata } from "../../src/lib/metadata";

export const metadata = pageMetadata("My profile", "Manage your patient profile at The CliniQ.", "/account");

export default function AccountPage() {
  return <SiteLayout><PageHero eyebrow="Patient account" title="My profile" description="Manage your patient account and appointment access." /><Section><Container><PatientAccount /></Container></Section></SiteLayout>;
}
