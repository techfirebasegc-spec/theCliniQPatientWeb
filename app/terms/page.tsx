import { ContentPage } from "../../src/components/site/ContentPage";
import { pageMetadata } from "../../src/lib/metadata";
export const metadata = pageMetadata("Terms", "Terms information for The CliniQ.", "/terms");
export default function TermsPage() { return <ContentPage title="Terms" description="The public terms will be published here after approved legal content is provided."><article className="card"><h2>Terms pending</h2><p>This placeholder does not create terms or clinical policies. Approved terms will replace it when they are available.</p></article></ContentPage>; }
