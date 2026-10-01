import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "../../src/components/site/Container";
import { PageHero } from "../../src/components/site/PageHero";
import { Section } from "../../src/components/site/Section";
import { SiteLayout } from "../../src/components/site/SiteLayout";
import { pageMetadata } from "../../src/lib/metadata";

export const metadata: Metadata = pageMetadata("Join Us", "Explore current ways to join The CliniQ.", "/join-us");

export default function JoinUsPage() {
  return <SiteLayout>
    <PageHero eyebrow="Join The CliniQ" title="Join Us" description="Choose the pathway that matches how you would like to work with The CliniQ." />
    <Section><Container><div className="grid grid--three join-options">
      <article className="card join-option"><p className="eyebrow">Healthcare professionals</p><h2>Join as a Doctor</h2><p>Start your Doctor application. A Platform Admin reviews applications before Provider access is available.</p><Link className="button" href="/join-us/doctor">Start Doctor application <span aria-hidden="true">→</span></Link></article>
      <article className="card join-option"><p className="eyebrow">Clinics</p><h2>Join as a Clinic</h2><p>Submit a Clinic application for Platform Admin review before existing owner onboarding begins.</p><Link className="button" href="/join-us/clinic">Start Clinic application <span aria-hidden="true">→</span></Link></article>
      <article className="card join-option"><p className="eyebrow">Careers</p><h2>Careers / Jobs</h2><p>Career opportunities and job applications will be shared here when available.</p><span className="coming-soon" aria-label="Coming soon">Coming Soon</span></article>
    </div></Container></Section>
  </SiteLayout>;
}
