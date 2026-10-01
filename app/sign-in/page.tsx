import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { SignInPanel } from "../../src/components/SignInPanel";
import { Container } from "../../src/components/site/Container";
import { SiteLayout } from "../../src/components/site/SiteLayout";
import { GOOGLE_PLAY_URL } from "../../src/components/site/links";
import { pageMetadata } from "../../src/lib/metadata";

export const metadata = pageMetadata("Patient sign in", "Secure patient sign-in for The CliniQ.", "/sign-in");

export default function SignInPage() {
  return <SiteLayout><section className="auth-section"><Container>
    <div className="auth-layout">
      <aside className="auth-intro">
        <Image className="auth-logo" src="/brand/thecliniq-logo-tagline.png" alt="The CliniQ — Your Health Partner" width={1229} height={455} sizes="230px" />
        <p className="eyebrow">Patient access</p>
        <h2>A familiar place for your healthcare journey.</h2>
        <p>Welcome to The CliniQ. Sign in with your Google account or verify your phone number to continue.</p>
        <div className="auth-explore"><span>Just exploring?</span><Link href="/doctors">Meet our doctors <span aria-hidden="true">→</span></Link><Link href="/services">Discover services <span aria-hidden="true">→</span></Link></div>
        <a className="text-link" href={GOOGLE_PLAY_URL}>Prefer your phone? Get the App ↗</a>
      </aside>
      <Suspense><SignInPanel /></Suspense>
    </div>
  </Container></section></SiteLayout>;
}
