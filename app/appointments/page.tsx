import { PatientAppointments } from "../../src/components/site/PatientAppointments";
import { Container } from "../../src/components/site/Container";
import { PageHero } from "../../src/components/site/PageHero";
import { Section } from "../../src/components/site/Section";
import { SiteLayout } from "../../src/components/site/SiteLayout";
import { pageMetadata } from "../../src/lib/metadata";

export const metadata = pageMetadata("My appointments", "View your appointments at The CliniQ.", "/appointments");

export default function AppointmentsPage() {
  return <SiteLayout><PageHero eyebrow="Patient account" title="My appointments" description="Review your booked appointments in one place." /><Section><Container><PatientAppointments /></Container></Section></SiteLayout>;
}
