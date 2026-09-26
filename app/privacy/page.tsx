import { ContentPage } from "../../src/components/site/ContentPage";
import { pageMetadata } from "../../src/lib/metadata";
export const metadata = pageMetadata("Privacy", "Privacy information for The CliniQ.", "/privacy");
export default function PrivacyPage() { return <ContentPage title="Privacy" description="The public privacy notice will be published here after approved legal content is provided."><article className="card"><h2>Privacy notice pending</h2><p>This placeholder deliberately does not state data-handling commitments before the approved privacy notice is available. The existing authentication and Platform session mechanisms remain unchanged.</p></article></ContentPage>; }
