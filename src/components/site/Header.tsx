"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useOptionalAuth } from "../../providers/AuthProvider";
import { Container } from "./Container";
import { GOOGLE_PLAY_URL } from "./links";

const links = [
  { href: "/", label: "Home" }, { href: "/doctors", label: "Doctors" },
  { href: "/services", label: "Services" }, { href: "/clinics", label: "Clinics" }, { href: "/specialties", label: "Specialties" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const drawerClose = useRef<HTMLButtonElement>(null);
  const accountMenu = useRef<HTMLDivElement>(null);
  const accountTrigger = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const auth = useOptionalAuth();
  const close = () => { setOpen(false); setAccountOpen(false); };
  const closeDrawer = () => { setOpen(false); requestAnimationFrame(() => toggle.current?.focus()); };
  const signOut = async () => {
    close();
    try { await auth?.logout(); }
    finally { router.replace("/"); }
  };
  useEffect(() => {
    if (!accountOpen) return;
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!accountMenu.current?.contains(event.target as Node)) setAccountOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsidePointer, true);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePointer, true);
  }, [accountOpen]);
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") closeDrawer(); };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    requestAnimationFrame(() => drawerClose.current?.focus());
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener("keydown", onKeyDown); };
  }, [open]);
  return <>
    <div className="announcement"><Container><span className="announcement-dot" aria-hidden="true" />The CliniQ is under development. Stay tuned for our launch.</Container></div>
    <header className="site-header" onKeyDown={(event) => {
      if (event.key === "Escape" && accountOpen) { setAccountOpen(false); accountTrigger.current?.focus(); }
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
            {auth?.user ? <>
              <Link className="appointments-link" href="/appointments">My appointments</Link>
              <div className="account-menu" ref={accountMenu}>
                <button className="account-trigger" ref={accountTrigger} type="button" aria-expanded={accountOpen} aria-haspopup="menu" onClick={() => setAccountOpen((value) => !value)}>Account <span aria-hidden="true">▾</span></button>
                {accountOpen ? <div className="account-popover" role="menu"><Link href="/account" role="menuitem" onClick={close}>My profile</Link><Link href="/appointments" role="menuitem" onClick={close}>My appointments</Link><button type="button" role="menuitem" onClick={() => void signOut()}>Sign out</button></div> : null}
              </div>
            </> : <><Link className="sign-in-link" href="/sign-in">Sign in</Link><Link className="button booking-button" href="/services">Book an appointment</Link></>}
            <button ref={toggle} className="menu-toggle" type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d={open ? "M6 6l12 12M6 18L18 6" : "M4 6h16M4 12h16M4 18h16"} /></svg>
            </button>
          </div>
        </div>
      </Container>
    </header>
    {open ? <><button className="mobile-nav-backdrop" type="button" aria-label="Close menu" onClick={closeDrawer} /><aside className="mobile-drawer" id="mobile-navigation" aria-label="Mobile navigation"><div className="mobile-drawer-header"><Link className="brand" href="/" aria-label="The CliniQ home" onClick={close}><Image src="/brand/thecliniq-logo-tagline.png" alt="The CliniQ — Your Health Partner" width={1229} height={455} sizes="150px" /></Link><button ref={drawerClose} className="mobile-drawer-close" type="button" aria-label="Close menu" onClick={closeDrawer}>×</button></div><nav className="mobile-nav" aria-label="Mobile navigation">{links.map(({ href, label }) => <Link key={href} href={href} onClick={close} aria-current={(href === "/" ? pathname === "/" : pathname.startsWith(href)) ? "page" : undefined}>{label}</Link>)}{auth?.user ? <><Link href="/appointments" onClick={close}>My appointments</Link><Link href="/account" onClick={close}>My profile</Link><button className="header-sign-out" type="button" onClick={() => void signOut()}>Sign out</button></> : <><Link href="/sign-in" onClick={close}>Sign in</Link><Link className="button" href="/services" onClick={close}>Book an appointment</Link></>}<a href={GOOGLE_PLAY_URL} onClick={close}>Get the App ↗</a></nav></aside></> : null}
  </>;
}
