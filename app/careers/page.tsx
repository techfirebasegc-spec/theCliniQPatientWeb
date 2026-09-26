import { ContentPage } from "../../src/components/site/ContentPage";
import { PlaceholderForm } from "../../src/components/site/PlaceholderForm";
import { pageMetadata } from "../../src/lib/metadata";
export const metadata = pageMetadata("Careers", "Career enquiries for The CliniQ.", "/careers");
export default function CareersPage() { return <ContentPage title="Careers" description="Career opportunities and a secure application process will be published when available."><PlaceholderForm kind="career" /></ContentPage>; }
