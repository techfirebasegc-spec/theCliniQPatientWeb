import { notFound } from "next/navigation";
import { ContentPage } from "../../../src/components/site/ContentPage";
import { specialties } from "../../../src/content/public-content";
import { pageMetadata } from "../../../src/lib/metadata";
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const item = specialties.find((specialty) => specialty.slug === slug); return pageMetadata(item?.title ?? "Specialty", item?.description ?? "Specialty information at The CliniQ.", `/specialties/${slug}`); }
export default async function SpecialtyDetail({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const item = specialties.find((specialty) => specialty.slug === slug); if (!item) notFound(); return <ContentPage title={item.title} description={item.description}><article className="card"><h2>Content source pending</h2><p>Approved public specialty information will be added here when there is a reviewed content source. This page does not make clinical claims in the meantime.</p></article></ContentPage>; }
