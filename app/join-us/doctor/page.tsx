import type { Metadata } from "next";
import { DoctorApplicationPanel } from "../../../src/components/DoctorApplicationPanel";
import { Container } from "../../../src/components/site/Container";
import { SiteLayout } from "../../../src/components/site/SiteLayout";
import { pageMetadata } from "../../../src/lib/metadata";

export const metadata: Metadata = pageMetadata("Doctor application", "Apply to join The CliniQ as a Doctor.", "/join-us/doctor");

export default function DoctorApplicationPage() {
  return <SiteLayout><section className="auth-section"><Container><DoctorApplicationPanel /></Container></section></SiteLayout>;
}
