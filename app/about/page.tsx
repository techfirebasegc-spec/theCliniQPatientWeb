import Link from "next/link";
import { CTA } from "../../src/components/site/CTA";
import { ContentPage } from "../../src/components/site/ContentPage";
import { pageMetadata } from "../../src/lib/metadata";
export const metadata = pageMetadata("About", "Learn about The CliniQ's public care-discovery experience.", "/about");
export default function AboutPage() { return <ContentPage title="Your Health Partner." description="The CliniQ brings together doctor profiles, healthcare services, and clear health information so you can understand your options before booking.">
  <div className="about-layout"><div><p className="eyebrow">About The CliniQ</p><h2 className="section-heading">A clearer path to care.</h2><p className="section-copy">Start with a doctor, a service, or a question. Explore the information that matters to you, then choose your next step.</p></div><div className="editorial-list"><Link href="/doctors"><span>01</span><div><h3>Doctor profiles</h3><p>Get to know the doctors currently listed on The CliniQ.</p></div>→</Link><Link href="/services"><span>02</span><div><h3>Healthcare services</h3><p>Explore available services and consultation information.</p></div>→</Link><Link href="/health"><span>03</span><div><h3>Health information</h3><p>A place for general educational resources before a consultation.</p></div>→</Link></div></div><div className="content-followup"><CTA /></div>
</ContentPage>; }
