"use client";

import Link from "next/link";
import { FormEvent, useRef, useState } from "react";
import { useAuth } from "../providers/AuthProvider";

export function SignInPanel() {
  const { loading, error, platformSessionEstablished, phoneOtpPending, signInWithGoogle, sendPhoneOtp, verifyPhoneOtp } = useAuth();
  const recaptcha = useRef<HTMLDivElement>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const busy = loading || sending;

  const sendCode = async (event: FormEvent) => {
    event.preventDefault(); setLocalError(null);
    if (!recaptcha.current || busy) return;
    setSending(true);
    try { await sendPhoneOtp(phoneNumber.trim(), recaptcha.current); }
    catch { setLocalError("We couldn’t send your code. Check your number and try again."); }
    finally { setSending(false); }
  };
  const verifyCode = async (event: FormEvent) => {
    event.preventDefault(); setLocalError(null);
    try { await verifyPhoneOtp(code.trim()); }
    catch { setLocalError("We couldn’t verify your code or complete sign-in. Please try again."); }
  };

  return <section className="auth-card" aria-labelledby="sign-in-title" aria-busy={busy}>
    <p className="eyebrow">Welcome back</p>
    <h1 id="sign-in-title">{platformSessionEstablished ? "You’re signed in" : "Sign in to The CliniQ"}</h1>
    <p className="auth-description">{platformSessionEstablished ? "Your patient session is ready." : "Choose how you’d like to continue."}</p>
    {platformSessionEstablished ? <div className="auth-success"><span className="success-mark" aria-hidden="true">✓</span><h2>Welcome to The CliniQ</h2><p>You can return to exploring doctors and services.</p><Link className="button" href="/doctors">Explore doctors →</Link></div> : <>
      <button className="button google-button" disabled={busy} onClick={async () => { setLocalError(null); try { await signInWithGoogle(); } catch { setLocalError("Google sign-in couldn’t be completed. Please try again."); } }}>
        <span className="google-letter" aria-hidden="true">G</span>Continue with Google
      </button>
      <div className="auth-divider"><span>or use your phone</span></div>
      <form onSubmit={phoneOtpPending ? verifyCode : sendCode} className="auth-form">
        <label className="field"><span>Phone number</span><input className="input" type="tel" autoComplete="tel" value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} disabled={phoneOtpPending || busy} placeholder="+91 98765 43210" aria-describedby="phone-help" required /></label>
        <p id="phone-help" className="field-help">Include your country code. We’ll send a verification code by SMS.</p>
        {phoneOtpPending ? <label className="field"><span>Verification code</span><input className="input otp-input" inputMode="numeric" autoComplete="one-time-code" value={code} onChange={(event) => setCode(event.target.value)} disabled={busy} placeholder="Enter your code" required /></label> : null}
        <button className="button phone-button" disabled={busy}>{busy ? <><span className="spinner" aria-hidden="true" />Please wait…</> : phoneOtpPending ? "Verify code & sign in" : "Send verification code"}</button>
      </form>
      <div ref={recaptcha} />
    </>}
    {loading && !platformSessionEstablished ? <p className="auth-status" role="status">Checking your sign-in…</p> : null}
    {error || localError ? <div className="auth-error" role="alert"><strong>Sign-in needs your attention</strong><p>{localError ?? error}</p></div> : null}
    <p className="auth-legal">Learn how The CliniQ works: <Link href="/privacy">Privacy</Link> and <Link href="/terms">Terms</Link>.</p>
    <Link className="auth-back" href="/">← Back to home</Link>
  </section>;
}
