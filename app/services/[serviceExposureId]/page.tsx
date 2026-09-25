import { DiscoveryShell } from "../../../src/components/DiscoveryShell";
import { ServiceDetail } from "../../../src/components/PublicDiscovery";

export default async function ServiceDetailPage({ params }: { params: Promise<{ serviceExposureId: string }> }) {
  const { serviceExposureId } = await params;
  return <DiscoveryShell><ServiceDetail serviceExposureId={serviceExposureId} /></DiscoveryShell>;
}
