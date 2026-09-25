import { DiscoveryShell } from "../../src/components/DiscoveryShell";
import { ServiceDirectory } from "../../src/components/PublicDiscovery";

export default async function ServicesPage({ searchParams }: { searchParams: Promise<{ doctorProfileId?: string; q?: string }> }) {
  const { doctorProfileId, q } = await searchParams;
  return <DiscoveryShell><ServiceDirectory initialDoctorProfileId={doctorProfileId} initialQuery={q} /></DiscoveryShell>;
}
