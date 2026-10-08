import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../src/components/site/Button";
import { DoctorCard, ServiceCard } from "../src/components/site/Cards";
import { CTA } from "../src/components/site/CTA";
import { Container } from "../src/components/site/Container";
import { FAQSection } from "../src/components/site/FAQSection";
import { JsonLd } from "../src/components/site/JsonLd";
import { Section } from "../src/components/site/Section";
import { SiteLayout } from "../src/components/site/SiteLayout";
import { BOOKING_URL, GOOGLE_PLAY_URL } from "../src/components/site/links";
import { pageMetadata, siteUrlValue } from "../src/lib/metadata";
import { publicDoctors, publicServices } from "../src/lib/public-api-server";

export const metadata: Metadata = pageMetadata("Healthcare made clearer", "Explore available doctors, services, and health resources with The CliniQ.", "/");

export default async function HomePage() {
  const [doctors, services] = await Promise.all([publicDoctors(), publicServices()]);
  return <SiteLayout>
    <JsonLd value={{ "@context": "https://schema.org", "@type": "WebSite", name: "The CliniQ", url: siteUrlValue }} />
    <section className="home-hero"><Container>
      <div className="hero-grid">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-line" />Your Health Partner</p>
          <h1>Healthcare, with a<br /><em>clearer next step.</em></h1>
          <p>Find a doctor, explore available services, and understand your options before your consultation.</p>
          <div className="hero-actions"><Button href={BOOKING_URL}>Book an appointment</Button><Button href="/doctors" secondary>Meet our doctors</Button></div>
        </div>
        <figure className="hero-visual">
          <Image src="/brand/consultation.png" alt="Illustrative healthcare consultation" width={1536} height={1024} priority sizes="(max-width: 720px) 100vw, 46vw" />
          <figcaption><span>The CliniQ</span>Illustrative healthcare consultation</figcaption>
        </figure>
      </div>
      <nav className="care-paths" aria-label="Explore The CliniQ">
        <Link href="/doctors"><span className="path-number">01</span><div><strong>Meet our doctors</strong><span>Start with a doctor profile</span></div><span aria-hidden="true">↗</span></Link>
        <Link href="/services"><span className="path-number">02</span><div><strong>Explore services</strong><span>Understand your care options</span></div><span aria-hidden="true">↗</span></Link>
        <Link href="/clinics"><span className="path-number">03</span><div><strong>Explore clinics</strong><span>Find published clinic services</span></div><span aria-hidden="true">↗</span></Link>
      </nav>
    </Container></section>
    <Section><Container>
      <div className="section-intro"><div><p className="eyebrow">Care options</p><h2 className="section-heading">Understand your options.</h2><p className="section-copy">The CliniQ brings together doctor profiles, healthcare services, and clear health information.</p></div><Link className="text-link" href="/services">All services <span aria-hidden="true">→</span></Link></div>
      {services.length ? <div className="grid grid--three">{services.slice(0, 3).map((service) => <ServiceCard key={service.id} service={service} />)}</div> : <div className="discovery-empty"><div><h3>Explore healthcare services</h3><p>Service listings aren’t available to display right now. You can explore the directory or continue to consultation booking.</p></div><Link className="text-link" href="/services">View services →</Link></div>}
    </Container></Section>
    <Section tint><Container>
      <div className="section-intro"><div><p className="eyebrow">Healthcare professionals</p><h2 className="section-heading">Start with a conversation.</h2><p className="section-copy">Explore the doctors and services currently listed on The CliniQ.</p></div><Link className="text-link" href="/doctors">All doctors <span aria-hidden="true">→</span></Link></div>
      {doctors.length ? <div className="grid grid--three">{doctors.slice(0, 3).map((doctor) => <DoctorCard key={doctor.id} doctor={doctor} />)}</div> : <div className="discovery-empty"><div><h3>Find your next step in care</h3><p>Doctor profiles aren’t available to display right now. Visit the directory to explore current listings.</p></div><Link className="text-link" href="/doctors">View doctors →</Link></div>}
    </Container></Section>
    <Section><Container><div className="app-promotion">
      <div className="app-identity"><Image src="/brand/thecliniq-logo-tagline.png" alt="The CliniQ — Your Health Partner" width={1229} height={455} sizes="250px" /><span>For your everyday healthcare journey</span></div>
      <div><p className="eyebrow">The CliniQ app</p><h2 className="section-heading">Take The CliniQ with you.</h2><p className="section-copy">Book consultations, manage your healthcare journey, and stay connected with The CliniQ app.</p><a className="play-link" href={GOOGLE_PLAY_URL}><span aria-hidden="true">▷</span><span><small>Available on Google Play</small>Get the App</span><span aria-hidden="true">↗</span></a></div>
    </div></Container></Section>
    <Section compact><Container><div className="faq-layout"><div><p className="eyebrow">A little clarity</p><h2 className="section-heading">Before your next step.</h2><p className="section-copy">A few helpful things to know about exploring The CliniQ.</p></div><FAQSection /></div></Container></Section>
    <Section><Container><CTA /></Container></Section>
  </SiteLayout>;
}
