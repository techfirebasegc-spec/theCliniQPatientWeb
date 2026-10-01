import type { Metadata } from "next";
import { ClinicApplicationPanel } from "../../../src/components/ClinicApplicationPanel";
import { Container } from "../../../src/components/site/Container";
import { SiteLayout } from "../../../src/components/site/SiteLayout";
import { pageMetadata } from "../../../src/lib/metadata";

export const metadata: Metadata = pageMetadata("Clinic application", "Apply to join The CliniQ as a Clinic.", "/join-us/clinic");

export default function ClinicApplicationPage() {
  return <SiteLayout><section className="auth-section"><Container><ClinicApplicationPanel /></Container></section></SiteLayout>;
}
