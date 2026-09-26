import { ContentPage } from "../../src/components/site/ContentPage";
import { pageMetadata } from "../../src/lib/metadata";
export const metadata = pageMetadata("Locations", "Location information for The CliniQ will be published when an approved source is available.", "/locations");
export default function LocationsPage() { return <ContentPage title="Locations" description="Service-area information will be published here when an approved location source is available."><article className="card"><h2>Location information is being prepared</h2><p>This page intentionally does not infer or publish service areas before they are confirmed.</p></article></ContentPage>; }
