import Link from "next/link";
import { Container } from "../../src/components/site/Container";
import { PageHero } from "../../src/components/site/PageHero";
import { Section } from "../../src/components/site/Section";
import { SiteLayout } from "../../src/components/site/SiteLayout";
import { healthArticles } from "../../src/content/public-content";
import { pageMetadata } from "../../src/lib/metadata";
export const metadata = pageMetadata("Health", "Approved health resources from The CliniQ.", "/health");
export default function HealthPage() { return <SiteLayout><PageHero eyebrow="Information hub" title="Health resources" description="A dedicated space for approved, reviewed public health resources." /><Section><Container><div className="grid grid--three">{healthArticles.map((article) => <Link className="card card-link" href={`/health/${article.slug}`} key={article.slug}><span className="card-icon" aria-hidden="true">i</span><h2>{article.title}</h2><p>{article.description}</p><p className="card-meta">Read more →</p></Link>)}</div></Container></Section></SiteLayout>; }
