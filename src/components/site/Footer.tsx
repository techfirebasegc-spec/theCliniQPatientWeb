import Link from "next/link";
import Image from "next/image";
import { Container } from "./Container";
import { CONTACT_EMAIL, GOOGLE_PLAY_URL } from "./links";

const groups = [
  { title: "Explore care", links: [["Home", "/"], ["Doctors", "/doctors"], ["Services", "/services"], ["Clinics", "/clinics"], ["Specialties", "/specialties"]] },
  { title: "The CliniQ", links: [["About", "/about"], ["Contact", "/contact"], ["Locations", "/locations"], ["Join Us", "/join-us"], ["Careers", "/careers"], ["Partners", "/partners"]] },
];

export function Footer() {
  return <footer className="site-footer"><Container>
    <div className="footer-grid">
      <div>
        <Link className="footer-brand" href="/" aria-label="The CliniQ home"><Image src="/brand/thecliniq-logo-tagline.png" alt="The CliniQ — Your Health Partner" width={1229} height={455} sizes="210px" /></Link>
        <p className="footer-copy">Doctor profiles, healthcare services, and clear information for your next step in care.</p>
        <a className="contact-link" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      </div>
      {groups.map((group) => <div key={group.title}><h2 className="footer-title">{group.title}</h2><nav className="footer-links" aria-label={group.title}>{group.links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav></div>)}
      <div className="footer-app"><h2 className="footer-title">Care, wherever you are</h2><p>Take The CliniQ with you.</p><a className="play-link" href={GOOGLE_PLAY_URL}><span aria-hidden="true">▷</span><span><small>Available on Google Play</small>Get the App</span><span aria-hidden="true">↗</span></a></div>
    </div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} The CliniQ. Your Health Partner.</span><nav aria-label="Legal"><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></nav></div>
    <p className="footer-disclaimer">Health information is for general education and does not replace individual medical advice.</p>
  </Container></footer>;
}
