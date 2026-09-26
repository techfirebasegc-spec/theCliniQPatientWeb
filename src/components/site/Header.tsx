"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { Container } from "./Container";
import { BOOKING_URL, GOOGLE_PLAY_URL } from "./links";

const links = [
  { href: "/", label: "Home" }, { href: "/doctors", label: "Doctors" },
  { href: "/services", label: "Services" }, { href: "/specialties", label: "Specialties" },
  { href: "/health", label: "Health" }, { href: "/about", label: "About" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const close = () => setOpen(false);
  return <>
    <div className="announcement"><Container><span className="announcement-dot" aria-hidden="true" />The CliniQ is under development. Stay tuned for our launch.</Container></div>
    <header className="site-header" onKeyDown={(event) => {
      if (event.key === "Escape" && open) { close(); toggle.current?.focus(); }
    }}>
      <Container>
        <div className="header-row">
          <Link className="brand" href="/" aria-label="The CliniQ home" onClick={close}>
            <Image src="/brand/thecliniq-logo-tagline.png" alt="The CliniQ — Your Health Partner" width={1229} height={455} priority sizes="180px" />
          </Link>
          <nav className="desktop-nav" aria-label="Primary navigation">
            {links.map(({ href, label }) => <Link className="nav-link" href={href} key={href} aria-current={(href === "/" ? pathname === "/" : pathname.startsWith(href)) ? "page" : undefined}>{label}</Link>)}
          </nav>
          <div className="header-actions">
            <a className="app-link" href={GOOGLE_PLAY_URL}>Get the App <span aria-hidden="true">↗</span></a>
            <Link className="sign-in-link" href="/sign-in">Sign in</Link>
            <a className="button booking-button" href={BOOKING_URL}>Book Consultation</a>
            <button ref={toggle} className="menu-toggle" type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d={open ? "M6 6l12 12M6 18L18 6" : "M4 6h16M4 12h16M4 18h16"} /></svg>
            </button>
          </div>
        </div>
        <nav className="mobile-nav" id="mobile-navigation" aria-label="Mobile navigation" hidden={!open}>
          {links.map(({ href, label }) => <Link key={href} href={href} onClick={close} aria-current={(href === "/" ? pathname === "/" : pathname.startsWith(href)) ? "page" : undefined}>{label}</Link>)}
          <Link href="/contact" onClick={close}>Contact</Link><Link href="/sign-in" onClick={close}>Sign in</Link>
          <a href={GOOGLE_PLAY_URL}>Get the App ↗</a>
        </nav>
      </Container>
    </header>
  </>;
}
