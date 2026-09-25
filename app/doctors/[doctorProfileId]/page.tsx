import { DiscoveryShell } from "../../../src/components/DiscoveryShell";
import { DoctorDetail } from "../../../src/components/PublicDiscovery";

export default async function DoctorDetailPage({ params }: { params: Promise<{ doctorProfileId: string }> }) {
  const { doctorProfileId } = await params;
  return <DiscoveryShell><DoctorDetail doctorProfileId={doctorProfileId} /></DiscoveryShell>;
}
