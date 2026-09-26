import { ContentPage } from "../../src/components/site/ContentPage";
import { PlaceholderForm } from "../../src/components/site/PlaceholderForm";
import { pageMetadata } from "../../src/lib/metadata";
export const metadata = pageMetadata("Partners", "Partnership enquiries for The CliniQ.", "/partners");
export default function PartnersPage() { return <ContentPage title="Partner with The CliniQ" description="We are preparing an approved pathway for partnership enquiries."><PlaceholderForm kind="partner" /></ContentPage>; }
