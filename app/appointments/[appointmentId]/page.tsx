import { PatientAppointmentDetail } from "../../../src/components/site/PatientAppointmentDetail";
import { Container } from "../../../src/components/site/Container";
import { Section } from "../../../src/components/site/Section";
import { SiteLayout } from "../../../src/components/site/SiteLayout";

export default async function AppointmentDetailPage({ params }: { params: Promise<{ appointmentId: string }> }) { const { appointmentId } = await params; return <SiteLayout><Section><Container><PatientAppointmentDetail appointmentId={appointmentId} /></Container></Section></SiteLayout>; }
