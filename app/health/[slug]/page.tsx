import { notFound } from "next/navigation";
import { ContentPage } from "../../../src/components/site/ContentPage";
import { healthArticles } from "../../../src/content/public-content";
import { pageMetadata } from "../../../src/lib/metadata";
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const item = healthArticles.find((article) => article.slug === slug); return pageMetadata(item?.title ?? "Health resource", item?.description ?? "Health resources from The CliniQ.", `/health/${slug}`); }
export default async function HealthDetail({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const item = healthArticles.find((article) => article.slug === slug); if (!item) notFound(); return <ContentPage title={item.title} description={item.description}><article className="card"><h2>Reviewed content is pending</h2><p>Health articles will be published here only after an approved editorial and clinical review process is available. This page does not provide medical advice.</p></article></ContentPage>; }
